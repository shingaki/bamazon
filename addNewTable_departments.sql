USE bamazondb;


CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(55) NULL,
  over_head_costs DECIMAL(10,2) NULL,
  PRIMARY KEY (department_id)
);

ALTER TABLE products
ADD COLUMN product_sales DECIMAL(10,2) AFTER stock_quantity;

INSERT INTO departments (department_name, over_head_costs) VALUES
('household', 500.00);

INSERT INTO departments (department_name, over_head_costs) VALUES
('toys', 300.00);

INSERT INTO departments (department_name, over_head_costs) VALUES
('outdoor furniture', 800.00);


select p.department_id, p.department_name, d.over_head_costs, sum(p.product_sales), sum(p.product_sales) - over_head_costs as profit
from departments d, products p
where p.department_id = d.department_id
group by p.department_id, p.department_name, d.over_head_costs;






