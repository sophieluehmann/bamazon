DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon; 

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(40),
    department_name VARCHAR(40),
    price INT(100),
    stock_quantity INT(200),
    PRIMARY KEY(item_id)
);

