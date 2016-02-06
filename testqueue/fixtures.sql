# ************************************************************
# Sequel Pro SQL dump
# Version 4500
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.6.22)
# Database: testqueue
# Generation Time: 2016-02-02 19:13:29 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table received
# ------------------------------------------------------------

DROP TABLE IF EXISTS `received`;

CREATE TABLE `received` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `body` text,
  `from` varchar(255) DEFAULT NULL,
  `to` varchar(255) DEFAULT NULL,
  `data` text,
  `createdAt` timestamp(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `from` (`from`(191)),
  KEY `to` (`to`(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

LOCK TABLES `received` WRITE;
/*!40000 ALTER TABLE `received` DISABLE KEYS */;


/*!40000 ALTER TABLE `received` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table sent
# ------------------------------------------------------------

DROP TABLE IF EXISTS `sent`;

CREATE TABLE `sent` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `body` text,
  `from` varchar(255) DEFAULT NULL,
  `to` varchar(255) DEFAULT NULL,
  `status` int(3) unsigned NOT NULL DEFAULT '0',
  `initiated_id` int(11) unsigned DEFAULT NULL,
  `createdAt` timestamp(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `from` (`from`(191)),
  KEY `to` (`to`(191))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

