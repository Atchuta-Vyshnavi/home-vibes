CREATE OR REPLACE PACKAGE hv_auth_pkg AS
  PROCEDURE register_user (
    p_full_name   IN  VARCHAR2,
    p_dob         IN  DATE,
    p_email       IN  VARCHAR2,
    p_password    IN  VARCHAR2,
    p_result_code OUT NUMBER,
    p_message     OUT VARCHAR2,
    p_user_id     OUT NUMBER
  );
  PROCEDURE login_user (
    p_email       IN  VARCHAR2,
    p_password    IN  VARCHAR2,
    p_ip_address  IN  VARCHAR2,
    p_user_agent  IN  VARCHAR2,
    p_result_code OUT NUMBER,
    p_message     OUT VARCHAR2,
    p_session_id  OUT VARCHAR2,
    p_user_json   OUT VARCHAR2
  );
  PROCEDURE validate_session (
    p_session_id  IN  VARCHAR2,
    p_result_code OUT NUMBER,
    p_user_json   OUT VARCHAR2
  );
  PROCEDURE logout (
    p_session_id IN VARCHAR2
  );
END hv_auth_pkg;
/

CREATE OR REPLACE PACKAGE BODY hv_auth_pkg AS

 FUNCTION hash_password (p_plain IN VARCHAR2) RETURN VARCHAR2 IS
    v_raw RAW(32);
  BEGIN
    v_raw := DBMS_CRYPTO.HASH(
      src => UTL_RAW.CAST_TO_RAW(p_plain),
      typ => 3
    );
    RETURN LOWER(RAWTOHEX(v_raw));
  END hash_password;

  FUNCTION gen_uuid RETURN VARCHAR2 IS
    v_guid VARCHAR2(36);
  BEGIN
    v_guid := LOWER(REGEXP_REPLACE(
      RAWTOHEX(SYS_GUID()),
      '([A-F0-9]{8})([A-F0-9]{4})([A-F0-9]{4})([A-F0-9]{4})([A-F0-9]{12})',
      '\1-\2-\3-\4-\5'
    ));
    RETURN v_guid;
  END gen_uuid;

  PROCEDURE register_user (
    p_full_name   IN  VARCHAR2,
    p_dob         IN  DATE,
    p_email       IN  VARCHAR2,
    p_password    IN  VARCHAR2,
    p_result_code OUT NUMBER,
    p_message     OUT VARCHAR2,
    p_user_id     OUT NUMBER
  ) IS
    v_count  NUMBER;
    v_hash   VARCHAR2(64);
    v_email  VARCHAR2(200) := LOWER(TRIM(p_email));
    v_newid  NUMBER;
  BEGIN
    SELECT COUNT(*) INTO v_count
    FROM   hv_users
    WHERE  LOWER(email) = v_email;

    IF v_count > 0 THEN
      p_result_code := 1;
      p_message     := 'Email already registered.';
      p_user_id     := NULL;
      RETURN;
    END IF;

    v_hash  := hash_password(p_password);
    v_newid := hv_users_seq.NEXTVAL;

    INSERT INTO hv_users (user_id, full_name, dob, email, password_hash)
    VALUES (v_newid, TRIM(p_full_name), p_dob, v_email, v_hash);

    COMMIT;
    p_result_code := 0;
    p_message     := 'Account created successfully.';
    p_user_id     := v_newid;

  EXCEPTION
    WHEN OTHERS THEN
      ROLLBACK;
      p_result_code := 2;
      p_message     := 'Registration error: ' || SQLERRM;
      p_user_id     := NULL;
  END register_user;

  PROCEDURE login_user (
    p_email       IN  VARCHAR2,
    p_password    IN  VARCHAR2,
    p_ip_address  IN  VARCHAR2,
    p_user_agent  IN  VARCHAR2,
    p_result_code OUT NUMBER,
    p_message     OUT VARCHAR2,
    p_session_id  OUT VARCHAR2,
    p_user_json   OUT VARCHAR2
  ) IS
    v_email   VARCHAR2(200) := LOWER(TRIM(p_email));
    v_hash    VARCHAR2(64)  := hash_password(p_password);
    v_uid     NUMBER;
    v_name    VARCHAR2(120);
    v_active  NUMBER(1);
    v_stored  VARCHAR2(64);
    v_sid     VARCHAR2(64);
    v_expires TIMESTAMP;
    v_newaud  NUMBER;
  BEGIN
    BEGIN
      SELECT user_id, full_name, password_hash, is_active
      INTO   v_uid, v_name, v_stored, v_active
      FROM   hv_users
      WHERE  LOWER(email) = v_email;
    EXCEPTION
      WHEN NO_DATA_FOUND THEN
        p_result_code := 1;
        p_message     := 'Email not found.';
        p_session_id  := NULL;
        p_user_json   := NULL;
        v_newaud := hv_audit_seq.NEXTVAL;
        INSERT INTO hv_login_audit (audit_id, email, success, ip_address, fail_reason)
        VALUES (v_newaud, v_email, 0, p_ip_address, 'Email not found');
        COMMIT;
        RETURN;
    END;

    IF v_active = 0 THEN
      p_result_code := 3;
      p_message     := 'Account is inactive.';
      p_session_id  := NULL;
      p_user_json   := NULL;
      RETURN;
    END IF;

    IF v_stored != v_hash THEN
      p_result_code := 2;
      p_message     := 'Invalid password.';
      p_session_id  := NULL;
      p_user_json   := NULL;
      v_newaud := hv_audit_seq.NEXTVAL;
      INSERT INTO hv_login_audit (audit_id, email, success, ip_address, fail_reason)
      VALUES (v_newaud, v_email, 0, p_ip_address, 'Wrong password');
      COMMIT;
      RETURN;
    END IF;

    v_sid     := gen_uuid();
  v_expires := SYSTIMESTAMP + (1/24) * 1;

    INSERT INTO hv_sessions (session_id, user_id, expires_at, ip_address, user_agent)
    VALUES (v_sid, v_uid, v_expires, p_ip_address, p_user_agent);

    UPDATE hv_users SET last_login = SYSTIMESTAMP WHERE user_id = v_uid;

    v_newaud := hv_audit_seq.NEXTVAL;
    INSERT INTO hv_login_audit (audit_id, email, success, ip_address)
    VALUES (v_newaud, v_email, 1, p_ip_address);

    COMMIT;

    p_result_code := 0;
    p_message     := 'Login successful.';
    p_session_id  := v_sid;
    p_user_json   := '{"userId":' || v_uid ||
                     ',"fullName":"' || REPLACE(v_name, '"', '\"') ||
                     '","email":"' || v_email || '"}';

  EXCEPTION
    WHEN OTHERS THEN
      ROLLBACK;
      p_result_code := 2;
      p_message     := 'Login error: ' || SQLERRM;
      p_session_id  := NULL;
      p_user_json   := NULL;
  END login_user;

  PROCEDURE validate_session (
    p_session_id  IN  VARCHAR2,
    p_result_code OUT NUMBER,
    p_user_json   OUT VARCHAR2
  ) IS
    v_uid     NUMBER;
    v_expires TIMESTAMP;
    v_name    VARCHAR2(120);
    v_email   VARCHAR2(200);
  BEGIN
    SELECT s.user_id, s.expires_at, u.full_name, u.email
    INTO   v_uid, v_expires, v_name, v_email
    FROM   hv_sessions s
    JOIN   hv_users u ON u.user_id = s.user_id
    WHERE  s.session_id = p_session_id;

    IF v_expires < SYSTIMESTAMP THEN
      DELETE FROM hv_sessions WHERE session_id = p_session_id;
      COMMIT;
      p_result_code := 1;
      p_user_json   := NULL;
      RETURN;
    END IF;

    p_result_code := 0;
    p_user_json   := '{"userId":' || v_uid ||
                     ',"fullName":"' || REPLACE(v_name, '"', '\"') ||
                     '","email":"' || v_email || '"}';

  EXCEPTION
    WHEN NO_DATA_FOUND THEN
      p_result_code := 1;
      p_user_json   := NULL;
  END validate_session;

  PROCEDURE logout (p_session_id IN VARCHAR2) IS
  BEGIN
    DELETE FROM hv_sessions WHERE session_id = p_session_id;
    COMMIT;
  END logout;

END hv_auth_pkg;
/
SELECT object_name, status FROM user_objects WHERE object_name = 'HV_AUTH_PKG';
SELECT user_id, full_name, email, created_at FROM hv_users;