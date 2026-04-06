-- ============================================================
-- 05_procedures_order.sql  –  Order & Contact Procedures
-- Run this in SQL Developer: File > Open > press F5
-- Make sure 03_dishes.sql and 04_orders.sql are run first
-- ============================================================

-- Create order sequence if it doesn't exist yet
DECLARE
  v_count NUMBER;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM user_sequences
  WHERE sequence_name = 'HV_ORDER_SEQ';
  
  IF v_count = 0 THEN
    EXECUTE IMMEDIATE 'CREATE SEQUENCE hv_order_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE';
  END IF;
END;
/

-- Create order_item sequence if it doesn't exist yet
DECLARE
  v_count NUMBER;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM user_sequences
  WHERE sequence_name = 'HV_ORDER_ITEM_SEQ';
  
  IF v_count = 0 THEN
    EXECUTE IMMEDIATE 'CREATE SEQUENCE hv_order_item_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE';
  END IF;
END;
/

-- Create msg sequence if it doesn't exist yet
DECLARE
  v_count NUMBER;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM user_sequences
  WHERE sequence_name = 'HV_MSG_SEQ';
  
  IF v_count = 0 THEN
    EXECUTE IMMEDIATE 'CREATE SEQUENCE hv_msg_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE';
  END IF;
END;
/

-- ── Procedure: Save Order Header ───────────────────────────
CREATE OR REPLACE PROCEDURE hv_save_order (
  p_user_id        IN  NUMBER,
  p_address_id     IN  NUMBER,
  p_payment_method IN  VARCHAR2,
  p_subtotal       IN  NUMBER,
  p_delivery       IN  NUMBER,
  p_cod_fee        IN  NUMBER,
  p_total          IN  NUMBER,
  p_result_code    OUT NUMBER,
  p_message        OUT VARCHAR2,
  p_order_id       OUT NUMBER
) IS
  v_order_id  NUMBER;
  v_order_ref VARCHAR2(30);
BEGIN
  v_order_id  := hv_order_seq.NEXTVAL;
  v_order_ref := 'HV' || TO_CHAR(SYSDATE, 'YYYYMMDD') || TO_CHAR(v_order_id);

  INSERT INTO hv_orders (
    order_id,
    user_id,
    order_ref,
    status,
    total_amount,
    address_id,
    payment_method
  ) VALUES (
    v_order_id,
    p_user_id,
    v_order_ref,
    'CONFIRMED',
    p_total,
    p_address_id,
    p_payment_method
  );

  COMMIT;
  p_result_code := 0;
  p_message     := 'Order saved successfully.';
  p_order_id    := v_order_id;

EXCEPTION
  WHEN OTHERS THEN
    ROLLBACK;
    p_result_code := 1;
    p_message     := 'Error saving order: ' || SQLERRM;
    p_order_id    := NULL;
END hv_save_order;
/

-- ── Procedure: Save Order Item ─────────────────────────────
CREATE OR REPLACE PROCEDURE hv_save_order_item (
  p_order_id  IN NUMBER,
  p_dish_id   IN NUMBER,
  p_dish_name IN VARCHAR2,
  p_quantity  IN NUMBER,
  p_price     IN NUMBER
) IS
BEGIN
  INSERT INTO hv_order_items (
    item_id,
    order_id,
    dish_title,
    unit_price,
    qty,
    line_total
  ) VALUES (
    hv_order_item_seq.NEXTVAL,
    p_order_id,
    p_dish_name,
    p_price,
    p_quantity,
    p_price * p_quantity
  );
  COMMIT;

EXCEPTION
  WHEN OTHERS THEN
    ROLLBACK;
END hv_save_order_item;
/

-- ── Procedure: Save Contact Message ────────────────────────
CREATE OR REPLACE PROCEDURE hv_save_contact_message (
  p_name        IN  VARCHAR2,
  p_email       IN  VARCHAR2,
  p_topic       IN  VARCHAR2,
  p_message     IN  VARCHAR2,
  p_rating      IN  VARCHAR2,
  p_result_code OUT NUMBER,
  p_message_out OUT VARCHAR2
) IS
BEGIN
  INSERT INTO hv_contact_messages (
    msg_id,
    name,
    email,
    topic,
    message,
    rating
  ) VALUES (
    hv_msg_seq.NEXTVAL,
    p_name,
    p_email,
    p_topic,
    p_message,
    p_rating
  );

  COMMIT;
  p_result_code := 0;
  p_message_out := 'Message saved successfully.';

EXCEPTION
  WHEN OTHERS THEN
    ROLLBACK;
    p_result_code := 1;
    p_message_out := 'Error saving message: ' || SQLERRM;
END hv_save_contact_message;
/

-- ── Verify procedures were created ─────────────────────────
SELECT object_name, object_type, status
FROM user_objects
WHERE object_name IN ('HV_SAVE_ORDER', 'HV_SAVE_ORDER_ITEM', 'HV_SAVE_CONTACT_MESSAGE')
ORDER BY object_name;