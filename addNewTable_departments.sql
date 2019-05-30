USE bamazondb;


CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(55) NULL,
  over_head_costs DECIMAL(10,2) NULL,
  PRIMARY KEY (department_id)
);

ALTER TABLE products
ADD COLUMN product_sales DECIMAL(10,2) AFTER stock_quantity;

