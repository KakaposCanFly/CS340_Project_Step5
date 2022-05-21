-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Host: classmysql.engr.oregonstate.edu:3306
-- Generation Time: May 23, 2018 at 05:07 PM
-- Server version: 10.1.22-MariaDB
-- PHP Version: 7.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cs340_hedaoos`
--

-- --------------------------------------------------------

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
    ('1','George','Immler','immler@massivehats.net','5039475829','ohio','1990/04/26'),
    ('2','June','Elizabeth','elizabeth@greenthumb.net','5039412329','portland','1987/02/15'),
    ('3','Harold','Shwab','gigachad@hidethepainharold.gov','5039400029','ohio','1990/04/26'),
    ('4','Rachael','Breats','breats@iliketoshop.net','5039475425','new jersey','1984/01/19');

INSERT INTO distributors (distributor_ID, distributor_name, distributor_address, distributor_email, distributor_phone, distributor_contact_person) VALUES 
    ('1','Raf''s Drip','nebraska','sweetkicks@evangelizeddd.com','5039475829','Josh'),
    ('2','Mike''s Shirts','washington','mikesshirts@quantity.net','5039412329','Mike'),
    ('3','Bailey''s Rings','new york','ringmyphone@snazzy.com','5039400029','Rick');

INSERT INTO products (product_ID,product_type,product_name,distributor_ID,retail_price,release_date,quant_in_stock) VALUES 
    ('1','shoes','Raf''s Godly Kicks','02496','419.99','1990/04/26','1'),
    ('2','t-shirt','Standard Long Sleeve','02092','	11.99','1990/04/26','119'),
    ('3','hat','Magician''s Tophat','04446','49.99','1990/04/26','7'),
    ('4','poncho','Unparalleled Comfort','	03002','79.99','1990/04/26','22');

INSERT INTO sale_orders(order_number, customer_ID, order_date, cc_number, cc_exp_date, delivery_status, paid_status) VALUES 
    ('1','12','1984/01/19','12982918478729781','1990/04/15','Delivered', 'Paid'),
    ('2','13','1984/01/19','12688918478829784','1990/04/15','Delivered', 'Not Paid'),
    ('3','14','1984/01/19','75688912478829883','1990/04/15','Not Delivered', 'Paid');

INSERT INTO sale_order_products(order_number,product_ID,quantity,selling_price,shipping_status,shipping_date) VALUES 
     ('1','1','900','419.99','Shipped','1984/01/19'),
     ('2','2','1045','11.99','Not Shipped','1984/01/19'),
     ('3','3','2000','49.99','Shipped','1984/01/19');




--
-- Table structure for table `bsg_cert`
--

DROP TABLE IF EXISTS `bsg_cert`;
CREATE TABLE `bsg_cert` (
  `certification_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `bsg_cert`
--

INSERT INTO `bsg_cert` (`certification_id`, `title`) VALUES
(1, 'Raptor'),
(2, 'Viper'),
(3, 'Mechanic'),
(4, 'Command');

-- --------------------------------------------------------

--
-- Table structure for table `bsg_cert_people`
--

DROP TABLE IF EXISTS `bsg_cert_people`;
CREATE TABLE `bsg_cert_people` (
  `cid` int(11) NOT NULL DEFAULT '0',
  `pid` int(11) NOT NULL DEFAULT '0',
  `certification_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `bsg_people`
--

DROP TABLE IF EXISTS `bsg_people`;
CREATE TABLE `bsg_people` (
  `character_id` int(11) NOT NULL,
  `fname` varchar(255) NOT NULL,
  `lname` varchar(255) DEFAULT NULL,
  `homeworld` int(11) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `race` varchar(5) NOT NULL DEFAULT 'Human'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `bsg_people`
--

INSERT INTO `bsg_people` (`character_id`, `fname`, `lname`, `homeworld`, `age`, `race`) VALUES
(6, 'Saul', 'Tigh', NULL, 71, 'Human'),
(9, 'Callandra', 'Henderson', NULL, NULL, 'Human'),
(121, 'harryeet', 'goober', 18, 23, 'Human'),
(156, '', '', 1, 0, 'Human'),
(157, '', '', 3, 0, 'Human'),
(158, 'The', 'Man', 16, 22, 'Human');

-- --------------------------------------------------------

--
-- Table structure for table `bsg_planets`
--

DROP TABLE IF EXISTS `bsg_planets`;
CREATE TABLE `bsg_planets` (
  `planet_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `population` bigint(20) DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  `capital` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `bsg_planets`
--

INSERT INTO `bsg_planets` (`planet_id`, `name`, `population`, `language`, `capital`) VALUES
(1, 'Gemenon', 2800000000, 'Old Gemenese', 'Oranu'),
(2, 'Leonis', 2600000000, 'Leonese', 'Luminere'),
(3, 'Caprica', 4900000000, 'Caprican', 'Caprica City'),
(7, 'Sagittaron', 1700000000, NULL, 'Tawa'),
(16, 'Aquaria', 25000, NULL, NULL),
(17, 'Canceron', 6700000000, NULL, 'Hades'),
(18, 'Libran', 2100000, NULL, NULL),
(19, 'Picon', 1400000000, NULL, 'Queestown'),
(20, 'Scorpia', 450000000, NULL, 'Celeste'),
(21, 'Tauron', 2500000000, 'Tauron', 'Hypatia'),
(22, 'Virgon', 4300000000, NULL, 'Boskirk');

-- --------------------------------------------------------

--
-- Table structure for table `bsg_spaceship`
--

DROP TABLE IF EXISTS `bsg_spaceship`;
CREATE TABLE `bsg_spaceship` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `seperate_saucer_section` bit(1) DEFAULT b'0',
  `length` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `bsg_spaceship`
--

INSERT INTO `bsg_spaceship` (`id`, `name`, `seperate_saucer_section`, `length`) VALUES
(1, 't1', b'1', 0),
(2, 't2', b'1', 0),
(3, 't2', b'1', 0),
(4, 't3', b'1', 0),
(5, 't4', b'0', 0),
(6, 't5', b'1', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bsg_cert`
--
ALTER TABLE `bsg_cert`
  ADD PRIMARY KEY (`certification_id`);

--
-- Indexes for table `bsg_cert_people`
--
ALTER TABLE `bsg_cert_people`
  ADD PRIMARY KEY (`cid`,`pid`),
  ADD KEY `pid` (`pid`);

--
-- Indexes for table `bsg_people`
--
ALTER TABLE `bsg_people`
  ADD PRIMARY KEY (`character_id`),
  ADD KEY `homeworld` (`homeworld`);

--
-- Indexes for table `bsg_planets`
--
ALTER TABLE `bsg_planets`
  ADD PRIMARY KEY (`planet_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `bsg_spaceship`
--
ALTER TABLE `bsg_spaceship`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bsg_cert`
--
ALTER TABLE `bsg_cert`
  MODIFY `certification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `bsg_people`
--
ALTER TABLE `bsg_people`
  MODIFY `character_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=159;

--
-- AUTO_INCREMENT for table `bsg_planets`
--
ALTER TABLE `bsg_planets`
  MODIFY `planet_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `bsg_spaceship`
--
ALTER TABLE `bsg_spaceship`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bsg_cert_people`
--
ALTER TABLE `bsg_cert_people`
  ADD CONSTRAINT `bsg_cert_people_ibfk_1` FOREIGN KEY (`cid`) REFERENCES `bsg_cert` (`certification_id`),
  ADD CONSTRAINT `bsg_cert_people_ibfk_2` FOREIGN KEY (`pid`) REFERENCES `bsg_people` (`character_id`);

--
-- Constraints for table `bsg_people`
--
ALTER TABLE `bsg_people`
  ADD CONSTRAINT `bsg_people_ibfk_1` FOREIGN KEY (`homeworld`) REFERENCES `bsg_planets` (`planet_id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

