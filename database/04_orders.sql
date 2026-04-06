-- ============================================================
-- 04_orders.sql  –  Addresses, Order Items, Contact Messages
-- Run this in SQL Developer: File > Open > press F5
-- ============================================================

CREATE SEQUENCE hv_address_seq    START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE hv_order_item_seq START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE hv_msg_seq        START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

-- Delivery addresses
CREATE TABLE hv_addresses (
  address_id   NUMBER         PRIMARY KEY,
  user_id      NUMBER         NOT NULL,
  label        VARCHAR2(20),
  full_address VARCHAR2(300)  NOT NULL,
  city         VARCHAR2(50),
  pincode      VARCHAR2(10),
  landmark     VARCHAR2(100),
  phone        VARCHAR2(15),
  is_default   NUMBER(1)      DEFAULT 0,
  created_at   TIMESTAMP      DEFAULT SYSTIMESTAMP,
  CONSTRAINT fk_addr_user FOREIGN KEY (user_id) REFERENCES hv_users(user_id) ON DELETE CASCADE
);

-- Order line items
CREATE TABLE hv_order_items (
  item_id    NUMBER        PRIMARY KEY,
  order_id   NUMBER        NOT NULL,
  dish_id    NUMBER,
  dish_name  VARCHAR2(100) NOT NULL,
  quantity   NUMBER        DEFAULT 1,
  price      NUMBER(8,2)   NOT NULL,
  CONSTRAINT fk_oi_order FOREIGN KEY (order_id) REFERENCES hv_orders(order_id) ON DELETE CASCADE
);

-- Contact messages
CREATE TABLE hv_contact_messages (
  msg_id       NUMBER        PRIMARY KEY,
  user_id      NUMBER,
  name         VARCHAR2(100) NOT NULL,
  email        VARCHAR2(200) NOT NULL,
  topic        VARCHAR2(50),
  message      CLOB,
  rating       VARCHAR2(30),
  submitted_at TIMESTAMP     DEFAULT SYSTIMESTAMP,
  CONSTRAINT fk_msg_user FOREIGN KEY (user_id) REFERENCES hv_users(user_id) ON DELETE SET NULL
);
DESC hv_order_items;
COMMIT;