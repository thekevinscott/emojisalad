-- MySQL dump 10.13  Distrib 5.6.22, for osx10.10 (x86_64)
--
-- Host: 45.55.41.73    Database: emojinary
-- ------------------------------------------------------
-- Server version	5.6.19-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `game_numbers`
--

DROP TABLE IF EXISTS `game_numbers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `game_numbers` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `number` varchar(255) DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `games`
--

DROP TABLE IF EXISTS `games`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `games` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `state_id` int(11) NOT NULL DEFAULT '1',
  `guesses` int(11) DEFAULT NULL,
  `clues_allowed` int(11) DEFAULT NULL,
  `random` tinyint(1) NOT NULL DEFAULT '1',
  `last_activity` timestamp(6) NOT NULL DEFAULT '0000-00-00 00:00:00.000000',
  `created` timestamp(6) NOT NULL DEFAULT '0000-00-00 00:00:00.000000',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-03-09 18:09:12
-- MySQL dump 10.13  Distrib 5.6.22, for osx10.10 (x86_64)
--
-- Host: 45.55.41.73    Database: emojinary
-- ------------------------------------------------------
-- Server version	5.6.19-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `category` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'BOOK'),(2,'COMIC'),(3,'MOVIE'),(4,'MUSIC'),(5,'TV SHOW'),(6,'VIDEO GAME');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clues`
--

DROP TABLE IF EXISTS `clues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `clues` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `phrase_id` int(11) DEFAULT NULL,
  `clue` varchar(255) DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clues`
--

LOCK TABLES `clues` WRITE;
/*!40000 ALTER TABLE `clues` DISABLE KEYS */;
INSERT INTO `clues` VALUES (11,98,'42','2015-09-23 01:58:39'),(12,99,'AND THE TREE WAS HAPPY','2015-09-23 01:58:58'),(13,100,'ATTICUS','2015-09-23 01:58:58'),(14,101,'BETTY','2015-09-23 01:58:58'),(15,67,'STANLEY KUBRICK','2015-09-23 01:58:58'),(16,68,'ULTRAVIOLENCE','2015-09-23 01:58:58'),(17,69,'WOOF','2015-09-23 01:58:58'),(18,70,'MARTY MCFLY','2015-09-23 01:58:58'),(19,71,'BASEBALL','2015-09-23 01:59:25'),(20,72,'A TALE AS OLD AS TIME','2015-09-23 02:00:28'),(21,73,'HARRISON FORD','2015-09-23 02:00:28'),(22,74,'PATRICK SWAYZE','2015-09-23 02:00:28'),(23,75,'THE NUMBER ONE RULE','2015-09-23 02:00:28'),(24,76,'BOX OF CHOCOLATES','2015-09-23 02:00:28'),(25,77,'NOT AFRAID OF GHOSTS','2015-09-23 02:00:28'),(26,78,'I DONT GIVE A DAMN','2015-09-23 02:00:28'),(27,79,'HOLD ONTO YOUR BUTTS','2015-09-23 02:00:28'),(28,80,'THE BRIDE','2015-09-23 02:00:28'),(29,81,'TINA FEY','2015-09-23 02:00:28'),(30,82,'ZOMBIES','2015-09-23 02:00:28'),(31,83,'VEGAS HEIST','2015-09-23 02:00:28'),(32,84,'STAPLER','2015-09-23 02:00:28'),(33,85,'DO THE MONKEY','2015-09-23 02:00:28'),(34,86,'HITCHCOCK','2015-09-23 02:00:28'),(35,87,'FAVA BEANS','2015-09-23 02:00:28'),(36,90,'TOM HANKS','2015-09-23 02:00:28'),(37,91,'DADDY ISSUES','2015-09-23 02:00:28'),(38,92,'JOHN HUGHES','2015-09-23 02:00:28'),(39,93,'TRIBUTE','2015-09-23 02:00:28'),(40,94,'HAMLET','2015-09-23 02:00:28'),(41,95,'KING OF THE WORLD','2015-09-23 02:00:28'),(42,96,'TO INFINITY','2015-09-23 02:00:28'),(43,97,'FUNNY','2015-09-23 02:00:28'),(44,61,'SMALL TOWN GIRL','2015-09-23 02:00:28'),(45,62,'ROCKY','2015-09-23 02:00:28'),(46,63,'MILEY CYRUS','2015-09-23 02:00:28'),(47,64,'WANNABE','2015-09-23 02:00:28'),(48,65,'GIMME SHELTER','2015-09-23 02:00:28'),(49,66,'CYNDI LAUPER','2015-09-23 02:00:28'),(50,46,'RYAN SEACREST','2015-09-23 02:00:28'),(51,47,'BANANA STAND','2015-09-23 02:00:28'),(52,48,'HEISENBERG','2015-09-23 02:00:28'),(53,49,'SCREWDRIVER','2015-09-23 02:00:28'),(54,50,'MCDREAMY','2015-09-23 02:00:28'),(55,51,'IN THE CRIMINAL JUSTICE SYSTEM','2015-09-23 02:00:28'),(56,52,'SAWYER','2015-09-23 02:00:28'),(57,53,'AGENCY','2015-09-23 02:00:28'),(58,54,'LIVE FROM NEW YORK','2015-09-23 02:00:28'),(59,55,'LIVE LONG','2015-09-23 02:00:28'),(60,56,'COWABUNGA','2015-09-23 02:00:28'),(61,57,'LA LA LA LA LA LA LA LA LA LA LA','2015-09-23 02:00:28'),(62,58,'JAMES GANDOLFINI','2015-09-23 02:00:28'),(63,59,'FIFTH DIMENSION','2015-09-23 02:00:28'),(64,60,'INTELLIGENT LIFE','2015-09-23 02:00:28'),(65,40,'ADDICTIVE GAME','2015-09-23 02:00:28'),(66,41,'A FELONY','2015-09-23 02:00:28'),(67,42,'BLINKY PINKY INKY AND CLYDE','2015-09-23 02:00:28'),(68,43,'SHORYUKEN','2015-09-23 02:00:28'),(69,44,'IT\'S A ME','2015-09-23 02:00:28'),(70,45,'OCARINA','2015-09-23 02:00:28'),(71,89,'YOUNG ADULT FICTION','2015-09-23 02:00:28');
/*!40000 ALTER TABLE `clues` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emojis`
--

DROP TABLE IF EXISTS `emojis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `emojis` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `emoji` varchar(255) DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emojis`
--

LOCK TABLES `emojis` WRITE;
/*!40000 ALTER TABLE `emojis` DISABLE KEYS */;
INSERT INTO `emojis` VALUES (1,'?','2016-02-28 18:17:29');
/*!40000 ALTER TABLE `emojis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_phrases`
--

DROP TABLE IF EXISTS `game_phrases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `game_phrases` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `game_id` int(11) DEFAULT NULL,
  `phrase_id` int(11) DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_phrases`
--

LOCK TABLES `game_phrases` WRITE;
/*!40000 ALTER TABLE `game_phrases` DISABLE KEYS */;
/*!40000 ALTER TABLE `game_phrases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guesses`
--

DROP TABLE IF EXISTS `guesses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `guesses` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `player_id` int(11) DEFAULT NULL,
  `round_id` int(11) DEFAULT NULL,
  `guess` text,
  `correct` tinyint(1) DEFAULT NULL,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guesses`
--

LOCK TABLES `guesses` WRITE;
/*!40000 ALTER TABLE `guesses` DISABLE KEYS */;
/*!40000 ALTER TABLE `guesses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invites`
--

DROP TABLE IF EXISTS `invites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `invites` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `game_id` int(11) unsigned NOT NULL,
  `game_number_id` int(11) unsigned NOT NULL,
  `invited_id` int(11) DEFAULT NULL,
  `inviter_id` int(11) DEFAULT NULL,
  `used` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `unique-invites` (`invited_id`,`inviter_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invites`
--

LOCK TABLES `invites` WRITE;
/*!40000 ALTER TABLE `invites` DISABLE KEYS */;
/*!40000 ALTER TABLE `invites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `phrases`
--

DROP TABLE IF EXISTS `phrases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `phrases` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `phrase` varchar(255) DEFAULT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phrases`
--

LOCK TABLES `phrases` WRITE;
/*!40000 ALTER TABLE `phrases` DISABLE KEYS */;
INSERT INTO `phrases` VALUES (40,'ANGRY BIRDS',NULL,6,'2015-09-23 01:47:16'),(41,'GRAND THEFT AUTO',NULL,6,'2015-09-23 01:47:17'),(42,'PAC-MAN',NULL,6,'2015-09-23 01:47:17'),(43,'STREET FIGHTER',NULL,6,'2015-09-23 01:47:17'),(44,'SUPER MARIO BROTHERS',NULL,6,'2015-09-23 01:47:17'),(45,'THE LEGEND OF ZELDA',NULL,6,'2015-09-23 01:47:17'),(46,'AMERICAN IDOL',NULL,5,'2015-09-23 01:47:19'),(47,'ARRESTED DEVELOPMENT',NULL,5,'2015-09-23 01:47:19'),(48,'BREAKING BAD',NULL,5,'2015-09-23 01:47:19'),(49,'DOCTOR WHO',NULL,5,'2015-09-23 01:47:19'),(50,'GREYS ANATOMY',NULL,5,'2015-09-23 01:47:19'),(51,'LAW AND ORDER',NULL,5,'2015-09-23 01:47:19'),(52,'LOST',NULL,5,'2015-09-23 01:47:19'),(53,'MAD MEN',NULL,5,'2015-09-23 01:47:20'),(54,'SATURDAY NIGHT LIVE',NULL,5,'2015-09-23 01:47:20'),(55,'STAR TREK',NULL,5,'2015-09-23 01:47:20'),(56,'TEENAGE MUTANT NINJA TURTLES',NULL,5,'2015-09-23 01:47:20'),(57,'THE SMURFS',NULL,5,'2015-09-23 01:47:20'),(58,'THE SOPRANOS',NULL,5,'2015-09-23 01:47:20'),(59,'THE TWILIGHT ZONE',NULL,5,'2015-09-23 01:47:20'),(60,'THE X-FILES',NULL,5,'2015-09-23 01:47:20'),(61,'DONT STOP BELIEVING',NULL,4,'2015-09-23 01:47:23'),(62,'EYE OF THE TIGER',NULL,4,'2015-09-23 01:47:23'),(63,'PARTY IN THE USA',NULL,4,'2015-09-23 01:47:23'),(64,'SPICE GIRLS',NULL,4,'2015-09-23 01:47:23'),(65,'THE ROLLING STONES',NULL,4,'2015-09-23 01:47:23'),(66,'TIME AFTER TIME',NULL,4,'2015-09-23 01:47:23'),(67,'2001: A SPACE ODYSSEY',NULL,3,'2015-09-23 01:47:25'),(68,'A CLOCKWORK ORANGE',NULL,3,'2015-09-23 01:47:25'),(69,'ALL DOGS GO TO HEAVEN',NULL,3,'2015-09-23 01:47:25'),(70,'BACK TO THE FUTURE',NULL,3,'2015-09-23 01:47:25'),(71,'BAD NEWS BEARS',NULL,3,'2015-09-23 01:47:25'),(72,'BEAUTY AND THE BEAST',NULL,3,'2015-09-23 01:47:25'),(73,'BLADE RUNNER',NULL,3,'2015-09-23 01:47:25'),(74,'DIRTY DANCING',NULL,3,'2015-09-23 01:47:25'),(75,'FIGHT CLUB',NULL,3,'2015-09-23 01:47:25'),(76,'FORREST GUMP',NULL,3,'2015-09-23 01:47:25'),(77,'GHOSTBUSTERS',NULL,3,'2015-09-23 01:47:25'),(78,'GONE WITH THE WIND',NULL,3,'2015-09-23 01:47:26'),(79,'JURASSIC PARK',NULL,3,'2015-09-23 01:47:26'),(80,'KILL BILL',NULL,3,'2015-09-23 01:47:26'),(81,'MEAN GIRLS',NULL,3,'2015-09-23 01:47:26'),(82,'NIGHT OF THE LIVING DEAD',NULL,3,'2015-09-23 01:47:26'),(83,'OCEAN\'S ELEVEN',NULL,3,'2015-09-23 01:47:26'),(84,'OFFICE SPACE',NULL,3,'2015-09-23 01:47:26'),(85,'PLANET OF THE APES',NULL,3,'2015-09-23 01:47:26'),(86,'PSYCHO',NULL,3,'2015-09-23 01:47:26'),(87,'SILENCE OF THE LAMBS',NULL,3,'2015-09-23 01:47:26'),(88,'SINGING IN THE RAIN',NULL,3,'2015-09-23 01:47:26'),(89,'SISTERHOOD OF THE TRAVELING PANTS',NULL,3,'2015-09-23 01:47:26'),(90,'SLEEPLESS IN SEATTLE',NULL,3,'2015-09-23 01:47:26'),(91,'STAR WARS',NULL,3,'2015-09-23 01:47:26'),(92,'THE BREAKFAST CLUB',NULL,3,'2015-09-23 01:47:26'),(93,'THE HUNGER GAMES',NULL,3,'2015-09-23 01:47:26'),(94,'THE LION KING',NULL,3,'2015-09-23 01:47:26'),(95,'TITANIC',NULL,3,'2015-09-23 01:47:26'),(96,'TOY STORY',NULL,3,'2015-09-23 01:47:26'),(97,'WET HOT AMERICAN SUMMER',NULL,3,'2015-09-23 01:47:26'),(98,'HITCHHIKER\'S GUIDE TO THE GALAXY',NULL,1,'2015-09-23 01:47:37'),(99,'THE GIVING TREE',NULL,1,'2015-09-23 01:47:37'),(100,'TO KILL A MOCKINGBIRD',NULL,1,'2015-09-23 01:47:37'),(101,'ARCHIE',NULL,2,'2015-09-23 01:47:37');
/*!40000 ALTER TABLE `phrases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `players`
--

DROP TABLE IF EXISTS `players`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `players` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL,
  `state_id` int(11) DEFAULT NULL,
  `to` int(11) unsigned NOT NULL,
  `blacklist` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `last_activity` timestamp(6) NOT NULL DEFAULT '0000-00-00 00:00:00.000000',
  `created` timestamp(6) NOT NULL DEFAULT '0000-00-00 00:00:00.000000',
  `archived` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `game_id` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_to` (`user_id`,`to`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `players`
--

LOCK TABLES `players` WRITE;
/*!40000 ALTER TABLE `players` DISABLE KEYS */;
/*!40000 ALTER TABLE `players` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rounds`
--

DROP TABLE IF EXISTS `rounds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rounds` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `game_id` int(11) DEFAULT NULL,
  `state_id` int(11) DEFAULT NULL,
  `submitter_id` int(11) DEFAULT NULL,
  `submission` text CHARACTER SET utf8mb4,
  `phrase_id` int(11) DEFAULT NULL,
  `winner_id` int(11) DEFAULT NULL,
  `last_activity` timestamp(6) NULL DEFAULT NULL,
  `created` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rounds`
--

LOCK TABLES `rounds` WRITE;
/*!40000 ALTER TABLE `rounds` DISABLE KEYS */;
/*!40000 ALTER TABLE `rounds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `blacklist` tinyint(1) NOT NULL DEFAULT '0',
  `from` varchar(255) CHARACTER SET latin1 NOT NULL DEFAULT '',
  `nickname` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `maximum_games` int(11) unsigned NOT NULL DEFAULT '4',
  `last_activity` timestamp(6) NULL DEFAULT NULL,
  `created` timestamp(6) NULL DEFAULT NULL,
  `archived` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `confirmed` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `confirmed_avatar` tinyint(1) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `from` (`from`),
  KEY `from_index` (`from`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-03-09 18:09:16
