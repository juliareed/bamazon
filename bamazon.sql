-- Drops the bamazon if it exists currently --
DROP DATABASE IF EXISTS bamazon
-- Creates the "bamazon" database --
CREATE DATABASE bamazon;

-- Makes it so all of the following code will affect bamazon --
USE bamazon;

-- Creates the table "products" within bamazon --
CREATE TABLE products (
  id INTEGER(11) AUTO_INCREMENT NOT NULL,
  item_id VARCHAR(30) NOT NULL,
  product_name VARCHAR(30) NOT NULL,
  department_name VARCHAR(30) NOT NULL,
  price INTEGER(10) DEFAULT 0,
  stock_quantity INTEGER(10) DEFAULT 0,
  PRIMARY KEY (id)
);

-- Creates new rows containing data in all named columns --
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (1, "Tide Detergent", "Home", 5, 100)

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (2, "Crock Pot", "Home", 67, 50)

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (3, "Beats", "Electronics", 220, 70)

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (4, "Echo Dot", "Electronics", 60, 800)

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (5, "A Heartbreaking Work of Staggering Genius", "Books", 15, 300)

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (6, "This Is How You Lose Her", "Books", 20, 500)

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (7, "Connect 4", "Games", 8, 25)

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (8, "Settlers of Catan", "Games", 10, 400)

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (9, "Christian Louboutin Heels", "Shoes", 700, 20)

INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (10, "Tevas", "Shoes", 30, 400)

