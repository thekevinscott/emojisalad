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
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-02-21 23:01:11
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
) ENGINE=MyISAM AUTO_INCREMENT=94 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,'intro',NULL,'? Hi friend! You\'ve been invited to play Emoji Pictionary! Think Pictionary, but with emojis. Want to play? Text YES to start playing. Text NO and I won\'t text you again.',NULL,'2015-08-15 19:19:42'),(2,'intro_2',NULL,'? I’m glad you said yes! First off, what should I call you?',NULL,'2015-08-16 03:35:18'),(6,'intro_3',NULL,'Nice to meet you, %1$s! We\'ve picked an emoji to represent you: %2$s. Text KEEP to keep the default emoji or text a single emoji to replace it.',NULL,'2015-08-16 04:10:23'),(88,NULL,NULL,'Thanks! The group will now see you as %1$s %2$s. Now we need to add a friend to play with. What is their 10-digit phone number? (e.g. 555-555-5555)',NULL,'2015-12-16 03:36:22'),(7,'invite',NULL,'? Hi friend! %1$s %2$s has invited you to play Emoji Pictionary! Think Pictionary, but with emojis. Want to play? Text YES to start playing. Text NO and I won\'t text you again.',NULL,'2015-08-16 14:17:39'),(8,'intro_5',NULL,'? %1$s has been invited. As soon as they accept, the game can begin! To add another friend, text INVITE followed by their 10-digit phone number.',NULL,'2015-08-16 14:18:06'),(9,'invite_error',NULL,'%1$s',NULL,'2015-08-16 14:24:50'),(10,'intro_error',NULL,'Error %1$s',NULL,'2015-08-16 15:47:31'),(11,'already_invited',NULL,'Phone number %1$s has already been invited. To add another friend, text INVITE followed by their 10-digit phone number.',NULL,'2015-08-16 16:07:32'),(12,'not_yet_onboarded_error',NULL,'Please finish the onboarding process first! %1$s','This is for when a user has begun onboarding, but has not yet completed (like giving a nickname or responding affirmatively with yes) and tries to invite someone','2015-08-16 18:35:23'),(14,'accepted-invited',NULL,'? %1$s has accepted your invitation and joined the game! Game on!',NULL,'2015-08-16 20:00:14'),(15,'wait-to-invite',NULL,'I understand you\'re excited to invite users to your game; I am too! But hold yo\' ride, first tell me your name.','If we\'re expecting a nickname but they ask to invite someone, tell them to slow their ride','2015-08-17 20:51:57'),(17,'error-1',NULL,'You entered an invalid number: %1$s','This is for when a number is invalid format','2015-08-17 22:56:46'),(18,'error-2',NULL,'Slow yo\' roll, the phone %1$s has already been invited.','This is for when a user has already invited another user','2015-08-17 22:57:08'),(19,'error-3',NULL,'%1$s asked us not to contact us again. To add another friend, text INVITE followed by their 10-digit phone number.','User is on the do not call list.','2015-08-17 22:57:44'),(20,'error-4',NULL,'You must provide a user with valid identifying info',NULL,'2015-08-17 23:13:39'),(21,'error-5',NULL,'There was an unknown error registering the phone number',NULL,'2015-08-17 23:13:55'),(22,'error-6',NULL,'The number %1$s is unverified. Trial accounts cannot send messages to unverified numbers; verify +17243836654 at twilio.com/user/account/phone-numbers/verified, or purchase a Twilio number to send messages to unverified numbers.','This is what Twilio says when a number is unverified','2015-08-18 00:08:51'),(23,'accepted-inviter',NULL,'Nice to meet you, %1$s %2$s! %3$s %4$s is going to start us off. When I get the emojis, you\'ll have to guess what they mean!',NULL,'2015-08-18 00:58:02'),(24,'error-7',NULL,'You must provide a valid user',NULL,'2015-08-21 16:58:10'),(25,'error-8',NULL,'You entered a blank number. Try sending something like: INVITE 555-555-5555',NULL,'2015-08-21 22:29:19'),(26,'game-start',NULL,'? You’ll start us off, %1$s %2$s! Your phrase is: %3$s\n\nReply using emojis only. Your goal is to get the other players to guess your phrase. Text OPTIONS if you get stuck, and PASS if you give up. (PASS will cost you 1 point).',NULL,'2015-08-26 18:09:48'),(27,'error-9',NULL,'Sorry, that\'s not valid emoji!',NULL,'2015-08-26 19:09:53'),(29,'game-submission-sent',NULL,'? What a wonderful set of emoji! You are smart, and good looking. I sent your emoji phrase to the group. Let the games begin!',NULL,'2015-08-26 20:02:15'),(30,'says',NULL,'%1$s %2$s: %3$s',NULL,'2015-08-26 20:03:46'),(31,'guessing-instructions',NULL,'Text OPTIONS if you get stuck, and PASS if you give up.',NULL,'2015-08-26 20:04:32'),(32,'correct-guess',NULL,'⛑⛑KAPOW %1$s %2$s GOT IT RIGHT! The phrase was %3$s⛑⛑',NULL,'2015-08-26 21:30:08'),(33,'game-next-round',NULL,'⛑ Next up is %1$s %2$s. When the round starts, you\'ll be guessing.',NULL,'2015-08-27 06:04:03'),(34,'game-next-round-suggestion',NULL,'⛑ It’s your turn, %1$s %2$s. Your phrase is: %3$s\n\nReply using emojis only. Your goal is to get the other players to guess your phrase. Text OPTIONS if you get stuck, and PASS if you give up..',NULL,'2015-08-27 06:05:16'),(35,'incorrect-guess',NULL,'⛑ THAT IS THE WRONG GUESS, %1$s',NULL,'2015-08-30 05:45:22'),(36,'join-game',NULL,'⛑ %1$s %2$s has joined the game! Game on!',NULL,'2015-08-31 01:20:04'),(37,'accepted-invited-next-round',NULL,'⛑ %1$s has accepted your invitation and will join at the next round!',NULL,'2015-08-31 03:00:05'),(38,'join-game-next-round',NULL,'⛑ %1$s will join the game at the next round!',NULL,'2015-08-31 03:00:27'),(39,'accepted-inviter-next-round',NULL,'Nice to meet you, %1$s! A game is progress but you\'ll join at the next round.',NULL,'2015-08-31 03:02:09'),(40,'error-10',NULL,'You must provide a phone number',NULL,'2015-09-02 18:36:56'),(41,'error-11',NULL,'You must provide a message',NULL,'2015-09-02 18:37:09'),(42,'incorrect-out-of-guesses',NULL,'That is the wrong guess, AND you\'re out of guesses. Sucks to be you... why don\'t you sit and think about what you\'ve done.',NULL,'2015-09-04 06:02:19'),(43,'out-of-guesses',NULL,'I refuse to dignify that with an answer; YOU\'RE OUT OF GUESSES, %1$s. Don\'t make me come over there...',NULL,'2015-09-04 06:31:03'),(44,'round-over',NULL,'Looks like no one got it right this time! The correct phrase was %1$s',NULL,'2015-09-04 06:57:58'),(45,'submitter-dont-guess',NULL,'%1$s, that\'s called *cheating* and you\'ve just ruined the round for everyone. Good job.',NULL,'2015-09-04 17:32:40'),(46,'clue',NULL,'%1$s %2$s asked for a clue! All right then, your clue is: %3$s',NULL,'2015-09-04 22:14:24'),(47,'no-clue-for-submitter',NULL,'Dude, you\'re not even playing! You can\'t ask for a clue.',NULL,'2015-09-04 23:05:19'),(48,'no-more-clues-allowed',NULL,'Sorry, you only get %1$s per round.',NULL,'2015-09-04 23:16:49'),(49,'no-more-clues-available',NULL,'Sorry, I don\'t have any more clues in my records for this round. You\'re on your own!',NULL,'2015-09-04 23:26:36'),(51,'guesses',NULL,'%1$s %2$s guesses: %3$s',NULL,'2015-09-15 00:06:29'),(52,'help-submitter-waiting-for-submission',NULL,'You should submit some emoji for the others to guess. To submit a phrase, text me something like:\n\n⛑⛑⛑\n\nThen I\'ll forward that to the group.',NULL,'2015-09-17 20:22:49'),(53,'help-submitter-submitted',NULL,'Sit tight! Your work here is done. Now you just have to wait for everyone else to guess correctly.',NULL,'2015-09-17 20:37:58'),(54,'help-player-bench',NULL,'You\'re waiting until the next round; once this round is complete you\'ll be in the game.',NULL,'2015-09-17 20:47:12'),(55,'help-player-ready-for-game',NULL,'We\'re waiting for %(game.round.submitter.nickname)s to submit a clue. Once the submission is in we\'ll forward it along and you can guess.',NULL,'2015-09-17 20:52:06'),(56,'help-player-guessing',NULL,'You are currently trying to guess what %(game.round.submission)s means. Text your guesses and I\'ll let you know when you\'ve landed on the right one. Text PASS to give up.',NULL,'2015-09-17 21:00:06'),(57,'help-player-waiting-for-round',NULL,'We\'re just waiting for the next round. %(game.round.submitter.nickname)s is going to guess next.',NULL,'2015-09-17 21:02:17'),(58,'pass-rejected-not-playing',NULL,'You\'re not currently in a round, so you can\'t guess.',NULL,'2015-09-22 00:35:50'),(59,'pass-rejected-not-guessing',NULL,'You\'re the submitter, you can\'t pass.',NULL,'2015-09-22 01:06:27'),(60,'pass-rejected-need-a-guess',NULL,'You can\'t skip, you need to submit something as a clue.',NULL,'2015-09-22 01:11:03'),(61,'pass',NULL,'You\'ve passed successfully, %1$s',NULL,'2015-09-22 02:00:07'),(62,'player-passed',NULL,'%1$s has chosen to pass this round.',NULL,'2015-09-22 02:00:20'),(63,'no-clue-after-passing',NULL,'You can\'t ask for a clue, you\'ve already passed.',NULL,'2015-09-22 02:10:42'),(64,'no-pass-after-loss',NULL,'You can\'t pass, you\'ve already lost this round',NULL,'2015-09-22 02:29:12'),(65,'no-guessing-after-passing',NULL,'You can\'t guess, you already passed this round.',NULL,'2015-09-22 02:35:41'),(66,'mixed-emoji',NULL,'You sent mixed emoji, %1$s; did you mean to send a submission? If so, you must send only emoji.',NULL,'2015-09-30 18:58:50'),(67,'new-game',NULL,'\"Welcome to your new game, %1$s! It\'s so swell to have you. Now we need to add some friends to play with. Text INVITE followed by a friend’s 10-digit phone number to invite them to the game.\n(e.g. ‘INVITE 555-555-5555’)\"',NULL,'2015-10-20 23:03:33'),(68,'intro_existing_player',NULL,'⛑ %1$s has been invited to your new game.',NULL,'2015-10-21 00:33:17'),(69,'invite_existing_player',NULL,'Hey %1$s, %2$s has challenged you to a new game. Text YES to start playing. Text NO and you won\'t.',NULL,'2015-10-21 00:33:44'),(70,'error-maximum-games',NULL,'Sorry, you\'re currently playing the maximum number of games.',NULL,'2015-10-21 01:40:22'),(71,'error-12',NULL,'Sorry, that user is already playing the maximum number of games.',NULL,'2015-10-21 02:03:14'),(72,'error-13',NULL,'Finish the onboarding process first before starting a new game.',NULL,'2015-10-21 02:29:26'),(87,'pass-initiator',NULL,'Ok, onto the next round!',NULL,'2015-12-16 02:40:35'),(89,'intro_4',NULL,'Thanks! The group will now see you as %1$s %2$s. Now we need to add a friend to play with. What is their 10-digit phone number? (e.g. 555-555-5555)',NULL,'2015-12-16 03:41:14'),(90,'error-14',NULL,'Come again? Text KEEP to keep the default emoji or text a single emoji to replace it.',NULL,'2015-12-16 04:13:27'),(91,'onboarding_wtf',NULL,'Come again? Text YES to start playing. Text NO and I won\'t text you again.',NULL,'2015-12-17 22:47:11'),(92,'emojis',NULL,'%1$s: %3$s',NULL,'2015-12-26 01:43:07'),(93,'invited-chilling',NULL,'We\'re just waiting for somebody to confirm their invite, and then we can get started.',NULL,'2016-02-22 03:59:07');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-02-21 23:01:12
