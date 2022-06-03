-- ##############################
--          CREATE QUERIES
-- ##############################
DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers` (
    `customer_ID` INT AUTO_INCREMENT UNIQUE NOT NULL PRIMARY KEY,
    `customer_first_name` varchar(255) NOT NULL,
    `customer_last_name` varchar(255) NOT NULL,
    `customer_email` varchar(255) NOT NULL,
    `customer_phone_number` varchar(32) NOT NULL,
    `customer_address` varchar(255) NOT NULL,
    `customer_birthdate` date NOT NULL
);

DROP TABLE IF EXISTS `distributors`;
CREATE TABLE `distributors` (
    `distributor_ID` INT AUTO_INCREMENT UNIQUE NOT NULL PRIMARY KEY,
    `distributor_name` varchar(255) NOT NULL,
    `distributor_address` varchar(255) NOT NULL,
    `distributor_email` varchar(255) NOT NULL,
    `distributor_phone` varchar(32) NOT NULL,
    `distributor_contact_person` varchar(255) NOT NULL
);

DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
    `product_ID` int AUTO_INCREMENT UNIQUE NOT NULL PRIMARY KEY,
    `product_type` varchar(255) NOT NULL,
    `product_name` varchar(255) NOT NULL,
    `distributor_ID` int(16) NOT NULL,
    `retail_price` decimal(16) NOT NULL,
    `release_date` date NOT NULL,
    `quant_in_stock` int(16) NOT NULL
);

DROP TABLE IF EXISTS `sale_orders`;
CREATE TABLE `sale_orders` (
    `order_number` INT(16) AUTO_INCREMENT UNIQUE NOT NULL PRIMARY KEY,
    `customer_ID` INT(16) NOT NULL,
    `order_date` date NOT NULL,
    `cc_number` varchar(255) NOT NULL,
    `cc_exp_date` date NOT NULL,
    `delivery_status` varchar(32) NOT NULL,
    `paid_status` varchar(32) NOT NULL
);

DROP TABLE IF EXISTS `sale_order_products`;
CREATE TABLE `sale_order_products` (
    `order_number` int(16) NOT NULL,
    `product_ID` int(16) NOT NULL,
    `quantity` int(16) NOT NULL,
    `selling_price` decimal(16,2),
    `shipping_status` varchar(16) NOT NULL,
    `shipping_date` date NOT NULL,
    FOREIGN KEY (`order_number`) REFERENCES `sale_orders` (`order_number`),
    FOREIGN KEY (`product_ID`) REFERENCES `products` (`product_ID`),
    PRIMARY KEY (`order_number`,`product_ID`)
);

-- ##############################
--          INSERT QUERIES
-- ##############################
INSERT INTO customers (customer_ID, customer_first_name, customer_last_name, customer_email, customer_phone_number, customer_address, customer_birthdate) VALUES 
    ('1','George','Immler','immler@massivehats.net','5039475829','505 SE Janson Ln.','1990/04/26'),
    ('2','June','Elizabeth','elizabeth@greenthumb.net','5039412329','1012 NE Alby Blvd.','1987/02/15'),
    ('3','Harold','Shwab','gigachad@hidethepainharold.gov','5039400029','707 SW Bora Ln.','1990/04/26'),
    ('4','Rachael','Breats','breats@iliketoshop.net','5039475425','209 NW Harrison Blvd.','1984/01/19');

INSERT INTO distributors (distributor_ID, distributor_name, distributor_address, distributor_email, distributor_phone, distributor_contact_person) VALUES 
    ('1','Raf''s Drip','2835 SE Hawthorne Lane','sweetkicks@evangelizeddd.com','5039475829','Josh'),
    ('2','Mike''s Shirts','2384 NW Maybell Street','mikesshirts@quantity.net','5039412329','Mike'),
    ('3','Bailey''s Rings','2934 SW Morris Drive','ringmyphone@snazzy.com','5039400029','Rick');

INSERT INTO products (product_ID,product_type,product_name,distributor_ID,retail_price,release_date,quant_in_stock) VALUES 
    ('1','shoes','Raf''s Godly Kicks','1','419.99','1990/04/26','1'),
    ('2','t-shirt','Standard Long Sleeve','2','	11.99','1990/04/26','119'),
    ('3','hat','Magician''s Tophat','3','49.99','1990/04/26','7'),
    ('4','poncho','Unparalleled Comfort','2 ','79.99','1990/04/26','22');

INSERT INTO sale_orders(order_number, customer_ID, order_date, cc_number, cc_exp_date, delivery_status, paid_status) VALUES 
    ('1','1','1984/01/19','12982918478729781','1990/04/15','Delivered', 'Paid'),
    ('2','2','1984/01/19','12688918478829784','1990/04/15','Delivered', 'Not Paid'),
    ('3','3','1984/01/19','75688912478829883','1990/04/15','Not Delivered', 'Paid');

INSERT INTO sale_order_products(order_number,product_ID,quantity,selling_price,shipping_status,shipping_date) VALUES 
     ('1','1','900','419.99','Shipped','1984/01/19'),
     ('2','2','1045','11.99','Not Shipped','1984/01/19'),
     ('3','3','2000','49.99','Shipped','1984/01/19');
