-- Drop existing objects if re-running
BEGIN EXECUTE IMMEDIATE 'DROP SEQUENCE hv_users_seq'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE hv_login_audit CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE hv_orders CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE hv_addresses CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE hv_sessions CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN EXECUTE IMMEDIATE 'DROP TABLE hv_users CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;
/

-- Sequences
CREATE SEQUENCE hv_users_seq     START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE hv_address_seq   START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE hv_order_seq     START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE hv_audit_seq     START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

-- Users table
CREATE TABLE hv_users (
  user_id        NUMBER         PRIMARY KEY,
  full_name      VARCHAR2(120)  NOT NULL,
  dob            DATE           NOT NULL,
  email          VARCHAR2(200)  NOT NULL,
  password_hash  VARCHAR2(64)   NOT NULL,
  created_at     TIMESTAMP      DEFAULT SYSTIMESTAMP NOT NULL,
  last_login     TIMESTAMP,
  is_active      NUMBER(1)      DEFAULT 1 NOT NULL,
  CONSTRAINT uq_hv_users_email UNIQUE (email)
);

CREATE INDEX idx_hv_users_email ON hv_users (email);

-- Sessions table
CREATE TABLE hv_sessions (
  session_id     VARCHAR2(64)   PRIMARY KEY,
  user_id        NUMBER         NOT NULL,
  created_at     TIMESTAMP      DEFAULT SYSTIMESTAMP NOT NULL,
  expires_at     TIMESTAMP      NOT NULL,
  ip_address     VARCHAR2(45),
  user_agent     VARCHAR2(512),
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES hv_users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_hv_sessions_user ON hv_sessions (user_id);

-- Addresses table
CREATE TABLE hv_addresses (
  address_id     NUMBER         PRIMARY KEY,
  user_id        NUMBER         NOT NULL,
  label          VARCHAR2(50),
  line1          VARCHAR2(200)  NOT NULL,
  line2          VARCHAR2(200),
  city           VARCHAR2(100)  NOT NULL,
  state          VARCHAR2(100),
  postcode       VARCHAR2(20)   NOT NULL,
  country        VARCHAR2(80)   DEFAULT 'India' NOT NULL,
  is_default     NUMBER(1)      DEFAULT 0,
  created_at     TIMESTAMP      DEFAULT SYSTIMESTAMP NOT NULL,
  CONSTRAINT fk_addresses_user FOREIGN KEY (user_id) REFERENCES hv_users(user_id) ON DELETE CASCADE
);

-- Orders table
CREATE TABLE hv_orders (
  order_id       NUMBER         PRIMARY KEY,
  user_id        NUMBER         NOT NULL,
  order_ref      VARCHAR2(20)   NOT NULL,
  status         VARCHAR2(30)   DEFAULT 'PENDING' NOT NULL,
  total_amount   NUMBER(10,2)   NOT NULL,
  address_id     NUMBER,
  payment_method VARCHAR2(50),
  created_at     TIMESTAMP      DEFAULT SYSTIMESTAMP NOT NULL,
  CONSTRAINT uq_hv_order_ref UNIQUE (order_ref),
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES hv_users(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_orders_address FOREIGN KEY (address_id) REFERENCES hv_addresses(address_id)
);

-- Login audit table
CREATE TABLE hv_login_audit (
  audit_id       NUMBER         PRIMARY KEY,
  email          VARCHAR2(200)  NOT NULL,
  success        NUMBER(1)      NOT NULL,
  ip_address     VARCHAR2(45),
  attempted_at   TIMESTAMP      DEFAULT SYSTIMESTAMP NOT NULL,
  fail_reason    VARCHAR2(200)
);

COMMIT;