-- ============================================================
-- 03_dishes.sql  –  Dishes & Ingredients
-- Run this in SQL Developer: File > Open > press F5
-- ============================================================

-- Sequences
CREATE SEQUENCE hv_dish_seq        START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;
CREATE SEQUENCE hv_ingredient_seq  START WITH 1 INCREMENT BY 1 NOCACHE NOCYCLE;

-- Dishes table
CREATE TABLE hv_dishes (
  dish_id        NUMBER        PRIMARY KEY,
  name           VARCHAR2(100) NOT NULL,
  display_price  NUMBER(8,2)   NOT NULL,
  video_path     VARCHAR2(200),
  thumbnail_path VARCHAR2(200),
  description    VARCHAR2(200),
  is_active      NUMBER(1)     DEFAULT 1
);

-- Ingredients table
CREATE TABLE hv_ingredients (
  ingredient_id   NUMBER        PRIMARY KEY,
  dish_id         NUMBER        NOT NULL,
  name            VARCHAR2(100) NOT NULL,
  qty_per_serving NUMBER(8,3)   NOT NULL,
  unit            VARCHAR2(20)  NOT NULL,
  cost_per_unit   NUMBER(8,4)   NOT NULL,
  CONSTRAINT fk_ing_dish FOREIGN KEY (dish_id) REFERENCES hv_dishes(dish_id)
);

-- ── Insert all 11 dishes ────────────────────────────────────
INSERT INTO hv_dishes VALUES (hv_dish_seq.NEXTVAL, 'Chocolate Milkshake',  98,  'videos/chocolatemilkshake.mp4',  'thumbnails/chocolatemilkshake.jpg',  'Super Thick Shake Tasty Feel', 1);
INSERT INTO hv_dishes VALUES (hv_dish_seq.NEXTVAL, 'Chicken Biryani',      235, 'videos/chickenbiryani.mp4',      'thumbnails/chickenbiryani.jpg',      'Restaurant Biryani At Home',   1);
INSERT INTO hv_dishes VALUES (hv_dish_seq.NEXTVAL, 'Chicken Manchuriya',   149, 'videos/chickenmanchurya.mp4',    'thumbnails/chickenmanchuriya.jpg',   'Fresh Chicken Manchuriya',     1);
INSERT INTO hv_dishes VALUES (hv_dish_seq.NEXTVAL, 'Egg Fried Rice',        90, 'videos/eggfriedrice.mp4',        'thumbnails/eggfriedrice.jpg',        'Tasty And Full Of Protein',    1);
INSERT INTO hv_dishes VALUES (hv_dish_seq.NEXTVAL, 'Fried Veg Momos',       80, 'videos/friedmomos.mp4',          'thumbnails/friedmomos.jpg',          'Yummy Fried Momos',            1);
INSERT INTO hv_dishes VALUES (hv_dish_seq.NEXTVAL, 'Paneer Butter Masala', 152, 'videos/paneerbuttermasala.mp4',  'thumbnails/pannerbuttermasala.jpg',  'Try With Your Own And See',    1);
INSERT INTO hv_dishes VALUES (hv_dish_seq.NEXTVAL, 'Paneer Tikka',         155, 'videos/pannertikka.mp4',         'thumbnails/pannertikka.jpg',         'Healthy Paneer Tikka',         1);
INSERT INTO hv_dishes VALUES (hv_dish_seq.NEXTVAL, 'Cheese Pizza',         219, 'videos/pizza.mp4',               'thumbnails/chesesepizza.jpg',        'Overloaded Extra Cheese',      1);
INSERT INTO hv_dishes VALUES (hv_dish_seq.NEXTVAL, 'Street Maggie',         53, 'videos/strretmaggie.mp4',        'thumbnails/strretmaggie.jpg',        'Ready In 2 Minutes',           1);
INSERT INTO hv_dishes VALUES (hv_dish_seq.NEXTVAL, 'Veg Noodles',           90, 'videos/vegnoodles.mp4',          'thumbnails/vegnoodles.jpg',          'Delicious Noodles',            1);
INSERT INTO hv_dishes VALUES (hv_dish_seq.NEXTVAL, 'Tandoori Roti',         45, 'videos/thandooriroti.mp4',       'thumbnails/tandooriroti.jpg',        'Street Style Roti At Home',    1);

-- ── Chocolate Milkshake (dish_id = 1) ──────────────────────
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 1, 'Full Cream Milk',     200,  'ml',      0.06);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 1, 'Chocolate Ice Cream', 3,    'scoops',  15);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 1, 'Cocoa Powder',        2,    'tbsp',    8);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 1, 'Sugar',               1,    'tbsp',    3);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 1, 'Whipped Cream',       2,    'tbsp',    6);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 1, 'Chocolate Sauce',     1,    'tbsp',    10);

-- ── Chicken Biryani (dish_id = 2) ──────────────────────────
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 2, 'Basmati Rice',        2,    'cups',    30);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 2, 'Chicken',             400,  'g',       0.22);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 2, 'Onion',               2,    'medium',  8);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 2, 'Curd / Yogurt',       4,    'tbsp',    4);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 2, 'Biryani Masala',      2,    'tbsp',    5);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 2, 'Ghee',                2,    'tbsp',    12);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 2, 'Fresh Mint Leaves',   1,    'handful', 5);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 2, 'Saffron',             1,    'pinch',   16);

-- ── Chicken Manchuriya (dish_id = 3) ───────────────────────
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 3, 'Boneless Chicken',    150,  'g',       0.50);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 3, 'Cornflour',           4,    'tbsp',    3);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 3, 'Soy Sauce',           2,    'tbsp',    4);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 3, 'Ginger+Garlic',       4,    'tbsp',    2);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 3, 'Green Chilli',        2,    'pieces',  2);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 3, 'Spring Onion',        3,    'stalks',  4);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 3, 'Tomato Ketchup',      2,    'tbsp',    5);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 3, 'Cooking Oil',         1,    'cups',    20);

-- ── Egg Fried Rice (dish_id = 4) ───────────────────────────
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 4, 'Basmati Rice',        2,    'cups',    15);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 4, 'Eggs',                3,    'pieces',  7);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 4, 'Carrot',              1,    'medium',  8);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 4, 'Spring Onion',        2,    'stalks',  4);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 4, 'Soy Sauce',           2,    'tbsp',    5);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 4, 'Cooking Oil',         2,    'tbsp',    4);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 4, 'Black Pepper Powder', 1,    'tsp',     4.25);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 4, 'Salt',                0.75, 'tsp',     1);

-- ── Fried Veg Momos (dish_id = 5) ──────────────────────────
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 5, 'All-Purpose Flour',   2,    'cups',    12);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 5, 'Cabbage',             1,    'cups',    8);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 5, 'Carrot',              1,    'medium',  8);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 5, 'Onion',               1,    'medium',  8);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 5, 'Garlic',              3,    'cloves',  2);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 5, 'Soy Sauce',           1,    'tbsp',    5);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 5, 'Cooking Oil',         1,    'cups',    20);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 5, 'Salt',                1,    'tsp',     1);

-- ── Paneer Butter Masala (dish_id = 6) ─────────────────────
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 6, 'Paneer',              125,  'g',       0.44);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 6, 'Tomatoes',            3,    'medium',  5);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 6, 'Butter',              2,    'tbsp',    10);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 6, 'Fresh Cream',         2,    'tbsp',    8);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 6, 'Onion',               1,    'medium',  8);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 6, 'Garam Masala',        1,    'tsp',     4);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 6, 'Kashmiri Chilli',     1,    'tsp',     4);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 6, 'Cashews',             10,   'pieces',  3);

-- ── Paneer Tikka (dish_id = 7) ─────────────────────────────
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 7, 'Paneer',              150,  'g',       0.44);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 7, 'Curd / Yogurt',       4,    'tbsp',    4);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 7, 'Capsicum',            1,    'medium',  15);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 7, 'Onion',               2,    'medium',  8);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 7, 'Tikka Masala',        2,    'tbsp',    8);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 7, 'Lemon Juice',         1,    'tbsp',    2);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 7, 'Cooking Oil',         5,    'tbsp',    4);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 7, 'Chaat Masala',        1,    'tsp',     4);

-- ── Cheese Pizza (dish_id = 8) ─────────────────────────────
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 8, 'Pizza Dough',         300,  'g',       0.15);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 8, 'Mozzarella Cheese',   100,  'g',       0.8);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 8, 'Pizza Sauce',         4,    'tbsp',    8);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 8, 'Cheddar Cheese',      50,   'g',       0.9);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 8, 'Dried Oregano',       1,    'tsp',     4);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 8, 'Chilli Flakes',       1,    'tsp',     3);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 8, 'Olive Oil',           1,    'tbsp',    10);

-- ── Street Maggie (dish_id = 9) ────────────────────────────
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 9, 'Maggi Noodles',       2,    'packets', 14);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 9, 'Butter',              1,    'tbsp',    10);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 9, 'Onion',               1,    'small',   5);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 9, 'Tomato',              1,    'small',   6);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 9, 'Green Chilli',        1,    'pieces',  2);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 9, 'Chaat Masala',        0.5,  'tsp',     4);

-- ── Veg Noodles (dish_id = 10) ─────────────────────────────
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 10, 'Hakka Noodles',      200,  'g',       0.12);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 10, 'Cabbage',            1,    'cups',    10);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 10, 'Carrot',             1,    'medium',  8);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 10, 'Capsicum',           1,    'medium',  20);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 10, 'Spring Onion',       2,    'stalks',  4);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 10, 'Soy Sauce',          2,    'tbsp',    5);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 10, 'Vinegar',            1,    'tsp',     2);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 10, 'Cooking Oil',        2,    'tbsp',    4);

-- ── Tandoori Roti (dish_id = 11) ───────────────────────────
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 11, 'Wheat Flour',        2,    'cups',    10.25);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 11, 'Salt',               0.5,  'tsp',     1);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 11, 'Butter',             2,    'tbsp',    10);
INSERT INTO hv_ingredients VALUES (hv_ingredient_seq.NEXTVAL, 11, 'Curd / Yogurt',      1,    'tbsp',    4);

COMMIT;