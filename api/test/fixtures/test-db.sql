-- MySQL dump 10.13  Distrib 5.6.22, for osx10.10 (x86_64)
--
-- Host: 45.55.41.73    Database: emojinaryfriend
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
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admins` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `salt` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `attributes`
--

DROP TABLE IF EXISTS `attributes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attributes` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `avatars`
--

DROP TABLE IF EXISTS `avatars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `avatars` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `avatar` varchar(255) DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=233 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `game_players`
--

DROP TABLE IF EXISTS `game_players`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `game_players` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `player_id` int(11) DEFAULT NULL,
  `game_id` int(11) DEFAULT NULL,
  `state_id` int(11) DEFAULT NULL,
  `score` int(11) NOT NULL DEFAULT '0',
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `one_user_per_game` (`player_id`,`game_id`)
) ENGINE=InnoDB AUTO_INCREMENT=94 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `game_scores`
--

DROP TABLE IF EXISTS `game_scores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `game_scores` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `game_id` int(11) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `key` varchar(255) DEFAULT NULL,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=167 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `game_states`
--

DROP TABLE IF EXISTS `game_states`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `game_states` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `state` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
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
) ENGINE=MyISAM AUTO_INCREMENT=98 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=846 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `incomingMessages`
--

DROP TABLE IF EXISTS `incomingMessages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `incomingMessages` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `player_id` int(11) DEFAULT NULL,
  `player_state` int(11) DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `response` text COLLATE utf8mb4_unicode_ci,
  `created` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1497 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `invites`
--

DROP TABLE IF EXISTS `invites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `invites` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `invited_player_id` int(11) DEFAULT NULL,
  `inviter_player_id` int(11) DEFAULT NULL,
  `used` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `unique-invites` (`invited_player_id`,`inviter_player_id`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `messages` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(187) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `comments` text COLLATE utf8mb4_unicode_ci,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=93 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `outgoingMessages`
--

DROP TABLE IF EXISTS `outgoingMessages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `outgoingMessages` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `player_id` int(11) DEFAULT NULL,
  `player_state` int(11) DEFAULT NULL,
  `message_key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `options` text COLLATE utf8mb4_unicode_ci,
  `message` text COLLATE utf8mb4_unicode_ci,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2417 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
-- Table structure for table `player_order`
--

DROP TABLE IF EXISTS `player_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `player_order` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `player_id` int(11) DEFAULT NULL,
  `game_id` int(11) DEFAULT NULL,
  `order` int(3) DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`player_id`,`game_id`),
  UNIQUE KEY `order` (`order`,`game_id`)
) ENGINE=InnoDB AUTO_INCREMENT=161 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `player_states`
--

DROP TABLE IF EXISTS `player_states`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `player_states` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `state` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=527 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `round_clues`
--

DROP TABLE IF EXISTS `round_clues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `round_clues` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `player_id` int(11) DEFAULT NULL,
  `round_id` int(11) DEFAULT NULL,
  `clue_id` int(11) DEFAULT NULL,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `round_states`
--

DROP TABLE IF EXISTS `round_states`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `round_states` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `state` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `phrase_id` int(11) DEFAULT NULL,
  `winner_id` int(11) DEFAULT NULL,
  `guesses` int(11) DEFAULT NULL,
  `clues_allowed` int(11) DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=231 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `submissions`
--

DROP TABLE IF EXISTS `submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `submissions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `round_id` int(11) DEFAULT NULL,
  `player_id` int(11) DEFAULT NULL,
  `submission` text,
  `created` timestamp(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `blacklist` tinyint(1) NOT NULL DEFAULT '0',
  `from` varchar(15) CHARACTER SET latin1 NOT NULL DEFAULT '',
  `nickname` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `maximum_games` int(11) unsigned NOT NULL DEFAULT '4',
  `last_activity` timestamp(6) NULL DEFAULT NULL,
  `created` timestamp(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `from` (`from`),
  KEY `from_index` (`from`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-01-16 14:36:32
-- MySQL dump 10.13  Distrib 5.6.22, for osx10.10 (x86_64)
--
-- Host: 45.55.41.73    Database: emojinaryfriend
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
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admins` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `salt` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (16,'schloo123','$6$YTtpkndBlh/HSQ==$Ka6XF4N5j/6GTGjDsiBWkSw1/6/F/0/OJ9VqN.s4wnsIVAG660aJxDUZa.lq.mkHuCXco.mK.I.yFFnPgMclo0','$6$YTtpkndBlh/HSQ==','2015-08-15 14:50:46'),(29,'thekevinscott','$2a$10$EvZo0lm4x3vWT4L7cU8icu4a.RpadVUhKjXt1zrSb7AqBAj627k7W','$2a$10$EvZo0lm4x3vWT4L7cU8icu','2015-09-29 07:50:42'),(31,'ari','$2a$10$aoJgUu/.uKc/j0VQrKR72uIptCibbE63b/jR4f95US4BbV1msZY7e','$2a$10$aoJgUu/.uKc/j0VQrKR72u','2015-11-22 23:43:29'),(30,'schloo','$2a$10$ha4xXEZ2pqdliQYRkwzlau6lokDXN7.VG1fwLc2Ix8lWBilDBuvxq','$2a$10$ha4xXEZ2pqdliQYRkwzlau','2015-09-29 15:34:19');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `avatars`
--

DROP TABLE IF EXISTS `avatars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `avatars` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `avatar` varchar(255) DEFAULT NULL,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avatars`
--

LOCK TABLES `avatars` WRITE;
/*!40000 ALTER TABLE `avatars` DISABLE KEYS */;
INSERT INTO `avatars` VALUES (1,'⚽️','2015-12-17 17:00:14'),(2,'?','2015-12-17 17:01:03'),(3,'?','2015-12-17 17:01:14'),(4,'?','2015-12-17 17:01:13'),(5,'?','2015-12-17 17:01:12'),(6,'?','2015-12-17 17:01:10'),(7,'⚾️','2015-12-17 17:01:09'),(8,'?','2015-12-17 17:01:05'),(9,'?','2015-12-17 17:01:17'),(10,'?','2015-12-17 17:01:19'),(11,'?','2015-12-17 17:01:22'),(12,'?','2015-12-17 17:01:24'),(13,'?','2015-12-17 17:01:27'),(14,'?','2015-12-17 17:01:30'),(15,'?','2015-12-17 17:01:32'),(16,'?','2015-12-17 17:01:35'),(17,'?','2015-12-17 17:01:37'),(18,'?','2015-12-17 17:01:39'),(19,'⛄️','2015-12-17 17:01:45'),(20,'⚡️','2015-12-17 17:01:48'),(21,'?','2015-12-17 17:01:50'),(22,'?','2015-12-17 17:01:52'),(23,'?','2015-12-17 17:01:54'),(24,'?','2015-12-17 17:01:56'),(25,'?','2015-12-17 17:01:58'),(26,'?','2015-12-17 17:02:00'),(27,'?','2015-12-17 17:02:03'),(28,'☂','2015-12-17 17:02:07'),(29,'?','2015-12-17 17:02:09');
/*!40000 ALTER TABLE `avatars` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_states`
--

DROP TABLE IF EXISTS `game_states`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `game_states` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `state` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_states`
--

LOCK TABLES `game_states` WRITE;
/*!40000 ALTER TABLE `game_states` DISABLE KEYS */;
INSERT INTO `game_states` VALUES (1,'pending'),(3,'ready-to-play'),(4,'playing');
/*!40000 ALTER TABLE `game_states` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `messages` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(187) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `comments` text COLLATE utf8mb4_unicode_ci,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=93 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,'intro',NULL,'? Hi friend! You\'ve been invited to play Emoji Pictionary! Think Pictionary, but with emojis. Want to play? Text YES to start playing. Text NO and I won\'t text you again.',NULL,'2015-08-15 19:19:42'),(2,'intro_2',NULL,'? I’m glad you said yes! First off, what should I call you?',NULL,'2015-08-16 03:35:18'),(6,'intro_3',NULL,'Nice to meet you, %1$s! We\'ve picked an emoji to represent you: %2$s. Text KEEP to keep the default emoji or text a single emoji to replace it.',NULL,'2015-08-16 04:10:23'),(88,NULL,NULL,'Thanks! The group will now see you as %1$s %2$s. Now we need to add a friend to play with. What is their 10-digit phone number? (e.g. 555-555-5555)',NULL,'2015-12-16 03:36:22'),(7,'invite',NULL,'? Hi friend! %1$s %2$s has invited you to play Emoji Pictionary! Think Pictionary, but with emojis. Want to play? Text YES to start playing. Text NO and I won\'t text you again.',NULL,'2015-08-16 14:17:39'),(8,'intro_5',NULL,'? %1$s has been invited. As soon as they accept, the game can begin! To add another friend, text INVITE followed by their 10-digit phone number.',NULL,'2015-08-16 14:18:06'),(9,'invite_error',NULL,'%1$s',NULL,'2015-08-16 14:24:50'),(10,'intro_error',NULL,'Error %1$s',NULL,'2015-08-16 15:47:31'),(11,'already_invited',NULL,'Phone number %1$s has already been invited. To add another friend, text INVITE followed by their 10-digit phone number.',NULL,'2015-08-16 16:07:32'),(12,'not_yet_onboarded_error',NULL,'Please finish the onboarding process first! %1$s','This is for when a user has begun onboarding, but has not yet completed (like giving a nickname or responding affirmatively with yes) and tries to invite someone','2015-08-16 18:35:23'),(14,'accepted-invited',NULL,'? %1$s has accepted your invitation and joined the game! Game on!',NULL,'2015-08-16 20:00:14'),(15,'wait-to-invite',NULL,'I understand you\'re excited to invite users to your game; I am too! But hold yo\' ride, first tell me your name.','If we\'re expecting a nickname but they ask to invite someone, tell them to slow their ride','2015-08-17 20:51:57'),(17,'error-1',NULL,'You entered an invalid number: %1$s','This is for when a number is invalid format','2015-08-17 22:56:46'),(18,'error-2',NULL,'Slow yo\' roll, the phone %1$s has already been invited.','This is for when a user has already invited another user','2015-08-17 22:57:08'),(19,'error-3',NULL,'%1$s asked us not to contact us again. To add another friend, text INVITE followed by their 10-digit phone number.','User is on the do not call list.','2015-08-17 22:57:44'),(20,'error-4',NULL,'You must provide a user with valid identifying info',NULL,'2015-08-17 23:13:39'),(21,'error-5',NULL,'There was an unknown error registering the phone number',NULL,'2015-08-17 23:13:55'),(22,'error-6',NULL,'The number %1$s is unverified. Trial accounts cannot send messages to unverified numbers; verify +17243836654 at twilio.com/user/account/phone-numbers/verified, or purchase a Twilio number to send messages to unverified numbers.','This is what Twilio says when a number is unverified','2015-08-18 00:08:51'),(23,'accepted-inviter',NULL,'Nice to meet you, %1$s! %2$s is going to start us off. When I get the emojis, you\'ll have to guess what they mean!',NULL,'2015-08-18 00:58:02'),(24,'error-7',NULL,'You must provide a valid user',NULL,'2015-08-21 16:58:10'),(25,'error-8',NULL,'You entered a blank number. Try sending something like: INVITE 555-555-5555',NULL,'2015-08-21 22:29:19'),(26,'game-start',NULL,'? You’ll start us off, %1$s! Your phrase is: %2$s\n\nReply using emojis only. Your goal is to get the other players to guess your phrase. Text OPTIONS if you get stuck, and PASS if you give up. (PASS will cost you 1 point).',NULL,'2015-08-26 18:09:48'),(27,'error-9',NULL,'Sorry, that\'s not valid emoji!',NULL,'2015-08-26 19:09:53'),(29,'game-submission-sent',NULL,'? What a wonderful set of emoji! You are smart, and good looking. I sent your emoji phrase to the group. Let the games begin!',NULL,'2015-08-26 20:02:15'),(30,'says',NULL,'%1$s %2$s: %3$s',NULL,'2015-08-26 20:03:46'),(31,'guessing-instructions',NULL,'Text OPTIONS if you get stuck, and PASS if you give up.',NULL,'2015-08-26 20:04:32'),(32,'correct-guess',NULL,'⛑⛑KAPOW %1$s %2$s GOT IT RIGHT! The phrase was %3$s⛑⛑',NULL,'2015-08-26 21:30:08'),(33,'game-next-round',NULL,'⛑ Next up is %1$s %2$s. When the round starts, you\'ll be guessing.',NULL,'2015-08-27 06:04:03'),(34,'game-next-round-suggestion',NULL,'⛑ It’s your turn, %1$s %2$s. Your phrase is: %3$s\n\nReply using emojis only. Your goal is to get the other players to guess your phrase. Text OPTIONS if you get stuck, and PASS if you give up..',NULL,'2015-08-27 06:05:16'),(35,'incorrect-guess',NULL,'⛑ THAT IS THE WRONG GUESS, %1$s',NULL,'2015-08-30 05:45:22'),(36,'join-game',NULL,'⛑ %1$s %2$s has joined the game! Game on!',NULL,'2015-08-31 01:20:04'),(37,'accepted-invited-next-round',NULL,'⛑ %1$s has accepted your invitation and will join at the next round!',NULL,'2015-08-31 03:00:05'),(38,'join-game-next-round',NULL,'⛑ %1$s will join the game at the next round!',NULL,'2015-08-31 03:00:27'),(39,'accepted-inviter-next-round',NULL,'Nice to meet you, %1$s! A game is progress but you\'ll join at the next round.',NULL,'2015-08-31 03:02:09'),(40,'error-10',NULL,'You must provide a phone number',NULL,'2015-09-02 18:36:56'),(41,'error-11',NULL,'You must provide a message',NULL,'2015-09-02 18:37:09'),(42,'incorrect-out-of-guesses',NULL,'That is the wrong guess, AND you\'re out of guesses. Sucks to be you... why don\'t you sit and think about what you\'ve done.',NULL,'2015-09-04 06:02:19'),(43,'out-of-guesses',NULL,'I refuse to dignify that with an answer; YOU\'RE OUT OF GUESSES, %1$s. Don\'t make me come over there...',NULL,'2015-09-04 06:31:03'),(44,'round-over',NULL,'Looks like no one got it right this time! The correct phrase was %1$s',NULL,'2015-09-04 06:57:58'),(45,'submitter-dont-guess',NULL,'%1$s, that\'s called *cheating* and you\'ve just ruined the round for everyone. Good job.',NULL,'2015-09-04 17:32:40'),(46,'clue',NULL,'%1$s asked for a clue! All right then, your clue is: %2$s',NULL,'2015-09-04 22:14:24'),(47,'no-clue-for-submitter',NULL,'Dude, you\'re not even playing! You can\'t ask for a clue.',NULL,'2015-09-04 23:05:19'),(48,'no-more-clues-allowed',NULL,'Sorry, you only get %1$s per round.',NULL,'2015-09-04 23:16:49'),(49,'no-more-clues-available',NULL,'Sorry, I don\'t have any more clues in my records for this round. You\'re on your own!',NULL,'2015-09-04 23:26:36'),(51,'guesses',NULL,'%1$s %2$s guesses: %3$s',NULL,'2015-09-15 00:06:29'),(52,'help-submitter-waiting-for-submission',NULL,'You should submit some emoji for the others to guess. To submit a phrase, text me something like:\n\n⛑⛑⛑\n\nThen I\'ll forward that to the group.',NULL,'2015-09-17 20:22:49'),(53,'help-submitter-submitted',NULL,'Sit tight! Your work here is done. Now you just have to wait for everyone else to guess correctly.',NULL,'2015-09-17 20:37:58'),(54,'help-player-bench',NULL,'You\'re waiting until the next round; once this round is complete you\'ll be in the game.',NULL,'2015-09-17 20:47:12'),(55,'help-player-ready-for-game',NULL,'We\'re waiting for %(game.round.submitter.nickname)s to submit a clue. Once the submission is in we\'ll forward it along and you can guess.',NULL,'2015-09-17 20:52:06'),(56,'help-player-guessing',NULL,'You are currently trying to guess what %(game.round.submission)s means. Text your guesses and I\'ll let you know when you\'ve landed on the right one. Text PASS to give up.',NULL,'2015-09-17 21:00:06'),(57,'help-player-waiting-for-round',NULL,'We\'re just waiting for the next round. %(game.round.submitter.nickname)s is going to guess next.',NULL,'2015-09-17 21:02:17'),(58,'pass-rejected-not-playing',NULL,'You\'re not currently in a round, so you can\'t guess.',NULL,'2015-09-22 00:35:50'),(59,'pass-rejected-not-guessing',NULL,'You\'re the submitter, you can\'t pass.',NULL,'2015-09-22 01:06:27'),(60,'pass-rejected-need-a-guess',NULL,'You can\'t skip, you need to submit something as a clue.',NULL,'2015-09-22 01:11:03'),(61,'pass',NULL,'You\'ve passed successfully, %1$s',NULL,'2015-09-22 02:00:07'),(62,'player-passed',NULL,'%1$s has chosen to pass this round.',NULL,'2015-09-22 02:00:20'),(63,'no-clue-after-passing',NULL,'You can\'t ask for a clue, you\'ve already passed.',NULL,'2015-09-22 02:10:42'),(64,'no-pass-after-loss',NULL,'You can\'t pass, you\'ve already lost this round',NULL,'2015-09-22 02:29:12'),(65,'no-guessing-after-passing',NULL,'You can\'t guess, you already passed this round.',NULL,'2015-09-22 02:35:41'),(66,'mixed-emoji',NULL,'You sent mixed emoji, %1$s; did you mean to send a submission? If so, you must send only emoji.',NULL,'2015-09-30 18:58:50'),(67,'new-game',NULL,'\"Welcome to your new game, %1$s! It\'s so swell to have you. Now we need to add some friends to play with. Text INVITE followed by a friend’s 10-digit phone number to invite them to the game.\n(e.g. ‘INVITE 555-555-5555’)\"',NULL,'2015-10-20 23:03:33'),(68,'intro_existing_player',NULL,'⛑ %1$s has been invited to your new game.',NULL,'2015-10-21 00:33:17'),(69,'invite_existing_player',NULL,'Hey %1$s, %2$s has challenged you to a new game. Text YES to start playing. Text NO and you won\'t.',NULL,'2015-10-21 00:33:44'),(70,'error-maximum-games',NULL,'Sorry, you\'re currently playing the maximum number of games.',NULL,'2015-10-21 01:40:22'),(71,'error-12',NULL,'Sorry, that user is already playing the maximum number of games.',NULL,'2015-10-21 02:03:14'),(72,'error-13',NULL,'Finish the onboarding process first before starting a new game.',NULL,'2015-10-21 02:29:26'),(87,'pass-initiator',NULL,'Ok, onto the next round!',NULL,'2015-12-16 02:40:35'),(89,'intro_4',NULL,'Thanks! The group will now see you as %1$s %2$s. Now we need to add a friend to play with. What is their 10-digit phone number? (e.g. 555-555-5555)',NULL,'2015-12-16 03:41:14'),(90,'error-14',NULL,'Come again? Text KEEP to keep the default emoji or text a single emoji to replace it.',NULL,'2015-12-16 04:13:27'),(91,'onboarding_wtf',NULL,'Come again? Text YES to start playing. Text NO and I won\'t text you again.',NULL,'2015-12-17 22:47:11'),(92,'emojis',NULL,'%1$s: %3$s',NULL,'2015-12-26 01:43:07');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `round_states`
--

DROP TABLE IF EXISTS `round_states`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `round_states` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `state` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `round_states`
--

LOCK TABLES `round_states` WRITE;
/*!40000 ALTER TABLE `round_states` DISABLE KEYS */;
INSERT INTO `round_states` VALUES (2,'waiting-for-submission'),(3,'won'),(4,'playing');
/*!40000 ALTER TABLE `round_states` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `player_states`
--

DROP TABLE IF EXISTS `player_states`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `player_states` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `state` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player_states`
--

LOCK TABLES `player_states` WRITE;
/*!40000 ALTER TABLE `player_states` DISABLE KEYS */;
INSERT INTO `player_states` VALUES (5,'waiting-for-confirmation'),(6,'waiting-for-nickname'),(8,'waiting-for-invites'),(10,'ready-for-game'),(11,'waiting-for-round'),(12,'waiting-for-submission'),(13,'guessing'),(14,'playing'),(15,'uncreated'),(16,'submitted'),(17,'bench'),(18,'passed'),(19,'lost'),(21,'invited-to-new-game'),(22,'waiting-for-avatar');
/*!40000 ALTER TABLE `player_states` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-01-16 14:36:35
