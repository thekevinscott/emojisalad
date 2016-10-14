-- MySQL dump 10.13  Distrib 5.6.29, for osx10.11 (x86_64)
--
-- Host: 45.55.41.73    Database: emojinaryfriend
-- ------------------------------------------------------
-- Server version	5.6.19-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=138402 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `timers`
--

DROP TABLE IF EXISTS `timers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `timers` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `game_id` int(11) NOT NULL,
  `payload` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `execution_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `timeout_length` int(11) NOT NULL,
  `active` tinyint(1) unsigned NOT NULL DEFAULT '1',
  `cleared` tinyint(1) NOT NULL DEFAULT '0',
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5650 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-10-09 16:23:53
-- MySQL dump 10.13  Distrib 5.6.29, for osx10.11 (x86_64)
--
-- Host: 45.55.41.73    Database: emojinaryfriend
-- ------------------------------------------------------
-- Server version	5.6.19-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
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
) ENGINE=MyISAM AUTO_INCREMENT=108 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,'intro',NULL,'👾 Hi friend! You\'ve been invited to play Emoji Pictionary! Think Pictionary, but with emojis. Want to play? Text YES to start playing. Text NO and I won\'t text you again.',NULL,'2015-08-15 19:19:42'),(2,'intro_2',NULL,'👾 I’m glad you said yes! First off, what should I call you?',NULL,'2015-08-16 03:35:18'),(6,'intro_3',NULL,'👾 Nice to meet you, %1$s! We\'ve picked an emoji to represent you: %2$s. Text KEEP to keep the default emoji or text a single emoji to replace it.',NULL,'2015-08-16 04:10:23'),(7,'invite',NULL,'👾 Hi friend! %2$s %1$s has invited you to play Emoji Pictionary! Think Pictionary, but with emojis. Want to play? Text YES to start playing. Text NO and I won\'t text you again.',NULL,'2015-08-16 14:17:39'),(8,'intro_5',NULL,'👾 %1$s has been invited. As soon as they accept, the game can begin! To add another friend, text INVITE followed by their 10-digit phone number.',NULL,'2015-08-16 14:18:06'),(9,'invite_error',NULL,'%1$s',NULL,'2015-08-16 14:24:50'),(10,'intro_error',NULL,'Error %1$s',NULL,'2015-08-16 15:47:31'),(11,'already_invited',NULL,'👾 Phone number %1$s has already been invited. To add another friend, text INVITE followed by their 10-digit phone number.',NULL,'2015-08-16 16:07:32'),(12,'not_yet_onboarded_error',NULL,'👾 Please finish the onboarding process first! %1$s','This is for when a user has begun onboarding, but has not yet completed (like giving a nickname or responding affirmatively with yes) and tries to invite someone','2015-08-16 18:35:23'),(14,'accepted-invited',NULL,'👾  %2$s %1$s has accepted your invitation and joined the game! Game on! \n\nInvite friends by texting INVITE followed by a 10-digit phone number (e.g. ‘INVITE 555-555-5555’)',NULL,'2015-08-16 20:00:14'),(15,'wait-to-invite',NULL,'👾 I understand you\'re excited to invite users to your game; I am too! But hold yo\' ride, first tell me your name.','If we\'re expecting a nickname but they ask to invite someone, tell them to slow their ride','2015-08-17 20:51:57'),(17,'error-1',NULL,'👾 You entered an invalid number: %1$s','This is for when a number is invalid format','2015-08-17 22:56:46'),(18,'error-2',NULL,'👾 Slow yo\' roll, the phone %1$s has already been invited.','This is for when a user has already invited another user','2015-08-17 22:57:08'),(19,'error-3',NULL,'👾 %1$s asked us not to contact us again. To add another friend, text INVITE followed by their 10-digit phone number.','User is on the do not call list.','2015-08-17 22:57:44'),(20,'error-4',NULL,'👾 You must provide a user with valid identifying info',NULL,'2015-08-17 23:13:39'),(21,'error-5',NULL,'👾 There was an unknown error registering the phone number',NULL,'2015-08-17 23:13:55'),(22,'error-6',NULL,'👾 The number %1$s is unverified. Trial accounts cannot send messages to unverified numbers; verify +17243836654 at twilio.com/user/account/phone-numbers/verified, or purchase a Twilio number to send messages to unverified numbers.','This is what Twilio says when a number is unverified','2015-08-18 00:08:51'),(23,'accepted-inviter',NULL,'Nice to meet you, %2$s %1$s! %4$s %3$s is going to start us off. \n\nWe\'re waiting on them to send over some emojis. Once the emojis arrive, you\'ll have to guess what they mean! Get it right and you win! Simple, right?',NULL,'2015-08-18 00:58:02'),(24,'error-7',NULL,'👾 You must provide a valid user',NULL,'2015-08-21 16:58:10'),(25,'error-8',NULL,'👾 You entered a blank number. Try sending something like: INVITE 555-555-5555',NULL,'2015-08-21 22:29:19'),(26,'game-start',NULL,'👾 You’ll start us off, %2$s %1$s! Your phrase is: %3$s\n\nReply using emojis only. Your goal is to get the other players to guess your phrase. Text OPTIONS if you get stuck, and PASS if you give up. (PASS will cost you 1 point).',NULL,'2015-08-26 18:09:48'),(27,'error-9',NULL,'👾 Sorry, that\'s not valid emoji!',NULL,'2015-08-26 19:09:53'),(29,'game-submission-sent',NULL,'👾 What a wonderful set of emoji! You are smart, and good looking. I sent your emoji phrase to the group. Let the games begin!',NULL,'2015-08-26 20:02:15'),(30,'says',NULL,'%2$s %1$s: %3$s',NULL,'2015-08-26 20:03:46'),(31,'guessing-instructions',NULL,'Text OPTIONS if you get stuck, and PASS if you give up. You can also ask for a CLUE.',NULL,'2015-08-26 20:04:32'),(32,'correct-guess',NULL,'👾 🎉Yay! %2$s %1$s got it RIGHT! 🎉\nThe phrase was %3$s ',NULL,'2015-08-26 21:30:08'),(33,'game-next-round',NULL,'👾 Next up is %2$s %1$s. When the round starts, you\'ll be guessing.',NULL,'2015-08-27 06:04:03'),(34,'game-next-round-suggestion',NULL,'👾 It’s your turn, %2$s %1$s. Your phrase is: %3$s\n\nReply using emojis only. Your goal is to get the other players to guess your phrase. Text OPTIONS if you get stuck, and PASS if you give up.',NULL,'2015-08-27 06:05:16'),(35,'incorrect-guess',NULL,'👾 THAT IS THE WRONG GUESS, %1$s',NULL,'2015-08-30 05:45:22'),(36,'join-game',NULL,'👾 %2$s %1$s has joined the game! Game on!',NULL,'2015-08-31 01:20:04'),(38,'join-game-next-round',NULL,'👾 %1$s will join the game at the next round!',NULL,'2015-08-31 03:00:27'),(100,'cron-waiting-for-submission-2',NULL,'👾 Hi there %2$s %1$s, just wanted to remind you again to submit some emojis. The phrase is %3$s. You can also PASS if you don\'t want to play this round.',NULL,'2016-05-08 15:01:42'),(40,'error-10',NULL,'👾 You must provide a phone number',NULL,'2015-09-02 18:36:56'),(41,'error-11',NULL,'👾 You must provide a message',NULL,'2015-09-02 18:37:09'),(44,'round-over',NULL,'👾 Looks like no one got it right this time! The correct phrase was %1$s',NULL,'2015-09-04 06:57:58'),(94,'cron',NULL,'👾 No one has guessed correctly yet. Keep trying, you\'ll get it! The emojis are %1$s. If you get stuck, don\'t forget to ask for a CLUE.\n',NULL,'2016-03-18 03:51:57'),(95,'accepted-inviter-in-progress',NULL,'👾 Nice to meet you, %2$s %1$s! %4$s %3$s has started the round.',NULL,'2016-03-22 17:44:50'),(46,'clue',NULL,'👾 %2$s %1$s asked for a clue! All right then, your clue is: %3$s',NULL,'2015-09-04 22:14:24'),(47,'no-clue-before-submission-for-submitter',NULL,'👾 Please submit some emoji so others can guess before you ask for a clue',NULL,'2015-09-04 23:05:19'),(99,'cron-waiting-for-submission',NULL,'👾 Hey there %2$s %1$s, just a friendly reminder that the group is waiting on you to submit some emojis. The phrase is %3$s',NULL,'2016-05-01 00:04:56'),(49,'no-more-clues-available',NULL,'👾 Sorry, I don\'t have any more clues in my records for this round. You\'re on your own!',NULL,'2015-09-04 23:26:36'),(51,'guesses',NULL,'%2$s %1$s guesses: %3$s',NULL,'2015-09-15 00:06:29'),(52,'help-submitter-waiting-for-submission',NULL,'👾 You should submit some emoji for the others to guess. To submit a phrase, text me something like:\n\n🌊🐠🐟\n\nThen I\'ll forward that to the group.',NULL,'2015-09-17 20:22:49'),(53,'help-submitter-submitted',NULL,'👾 Sit tight! Your work here is done. Now you just have to wait for everyone else to guess correctly. \n\nWhile you wait, you can invite more friends to the game by texting INVITE followed by a 10-digit phone number (e.g. ‘INVITE 555-555-5555’)\n\nYou can also start a new game by texting NEW GAME.',NULL,'2015-09-17 20:37:58'),(54,'help-player-bench',NULL,'👾 You\'re waiting until the next round; once this round is complete you\'ll be in the game.\n\nWhile you wait, you can invite more friends to the game by texting INVITE followed by a 10-digit phone number (e.g. ‘INVITE 555-555-5555’)\n\nYou can also start a new game by texting NEW GAME.',NULL,'2015-09-17 20:47:12'),(55,'help-player-ready-for-game',NULL,'👾 We\'re waiting for %(game.round.submitter.nickname)s to submit a clue. Once the submission is in we\'ll forward it along and you can guess.\n\nWhile you wait, you can invite more friends to the game by texting INVITE followed by a 10-digit phone number (e.g. ‘INVITE 555-555-5555’)\n\nYou can also start a new game by texting NEW GAME.',NULL,'2015-09-17 20:52:06'),(56,'help-player-guessing',NULL,'👾 You are currently trying to guess what %(game.round.submission)s means. Text your guesses and I\'ll let you know when you\'ve landed on the right one. Text PASS to give up.\n\nYou can invite more friends to the game by texting INVITE followed by a 10-digit phone number (e.g. ‘INVITE 555-555-5555’)\n\nYou can also start a new game by texting NEW GAME.',NULL,'2015-09-17 21:00:06'),(57,'help-player-waiting-for-round',NULL,'👾 We\'re just waiting for the next round. %(game.round.submitter.nickname)s is going to guess next. \n\nWhile you wait, you can invite more friends to the game by texting INVITE followed by a 10-digit phone number (e.g. ‘INVITE 555-555-5555’)\n\nYou can also start a new game by texting NEW GAME.',NULL,'2015-09-17 21:02:17'),(58,'pass-rejected-not-playing',NULL,'👾 You\'re not currently in a round, so you can\'t guess.',NULL,'2015-09-22 00:35:50'),(59,'pass-rejected-not-guessing',NULL,'👾 You\'re the submitter, you can\'t pass.',NULL,'2015-09-22 01:06:27'),(60,'pass-rejected-need-a-guess',NULL,'👾 You can\'t skip, you need to submit something as a clue.',NULL,'2015-09-22 01:11:03'),(61,'pass',NULL,'👾 %2$s %1$s has passed the round.',NULL,'2015-09-22 02:00:07'),(62,'player-passed',NULL,'👾 %1$s has chosen to pass this round.',NULL,'2015-09-22 02:00:20'),(63,'no-clue-before-submission-for-guesser',NULL,'👾 You can ask a clue once the round begins',NULL,'2015-09-22 02:10:42'),(64,'no-pass-after-loss',NULL,'👾 You can\'t pass, you\'ve already lost this round',NULL,'2015-09-22 02:29:12'),(65,'no-guessing-after-passing',NULL,'👾 You can\'t guess, you already passed this round.',NULL,'2015-09-22 02:35:41'),(66,'mixed-emoji',NULL,'👾 You sent mixed emoji, %1$s; did you mean to send a submission? If so, you must send only emoji.',NULL,'2015-09-30 18:58:50'),(67,'new-game',NULL,'👾 Welcome to your new game, %1$s! It\'s so swell to have you. Now we need to add some friends to play with. Text INVITE followed by a friend’s 10-digit phone number to invite them to the game.\n(e.g. ‘INVITE 555-555-5555’)\"',NULL,'2015-10-20 23:03:33'),(68,'intro_existing_player',NULL,'👾 %1$s has been invited to your new game. \n\nYou can invite more friends by texting INVITE followed by a 10-digit phone number (e.g. ‘INVITE 555-555-5555’)\n\nYou can also start a new game by texting NEW GAME.',NULL,'2015-10-21 00:33:17'),(69,'invite_existing_player',NULL,'👾 Hey %2$s %1$s, %4$s %3$s has challenged you to a new game. Text YES to start playing. Text NO and you won\'t.',NULL,'2015-10-21 00:33:44'),(70,'error-maximum-games',NULL,'👾 Sorry, you\'re currently playing the maximum number of games.',NULL,'2015-10-21 01:40:22'),(71,'error-12',NULL,'👾 Sorry, that user is already playing the maximum number of games.',NULL,'2015-10-21 02:03:14'),(72,'error-13',NULL,'👾 Finish the onboarding process first before starting a new game.',NULL,'2015-10-21 02:29:26'),(87,'pass-initiator',NULL,'👾 Ok, onto the next round!',NULL,'2015-12-16 02:40:35'),(89,'intro_4',NULL,'👾 Thanks! The group will now see you as %2$s %1$s. Now we need to add a friend to play with. \n\nText INVITE followed by a friend’s 10-digit phone number to invite them to the game. (e.g. ‘INVITE 555-555-5555’)\n\nYou can invite as many people as you\'d like. The more the merrier!',NULL,'2015-12-16 03:41:14'),(90,'error-14',NULL,'👾 Come again? Text KEEP to keep the default emoji or text a single emoji to replace it.',NULL,'2015-12-16 04:13:27'),(91,'onboarding_wtf',NULL,'👾 Come again? Text YES to start playing. Text NO and I won\'t text you again.',NULL,'2015-12-17 22:47:11'),(92,'emojis',NULL,'%2$s %1$s: %3$s',NULL,'2015-12-26 01:43:07'),(93,'invited-chilling',NULL,'👾 We\'re just waiting for somebody to confirm their invite, and then we can get started.',NULL,'2016-02-22 03:59:07'),(96,'error-15',NULL,'👾 %1$s is already in the game!',NULL,'2016-03-27 23:13:18'),(97,'error-16',NULL,'👾 You can\'t invite yourself.',NULL,'2016-03-27 23:21:30'),(101,'intro_3_b',NULL,'👾 Nice to meet you, %(nickname)s! We\'ve picked an emoji to represent you: %(avatar)s. Text KEEP to keep the default emoji or text a single emoji to replace it.',NULL,'2016-05-20 15:48:41'),(102,'says_b',NULL,'%(avatar)s %(nickname)s: %(input)s',NULL,'2016-05-20 16:47:33'),(103,'clue_b',NULL,'👾 %(avatar)s %(nickname)s asked for a clue! All right then, your clue is: %(game.round.clue)s',NULL,'2016-05-20 17:07:23'),(104,'left_game_players',NULL,'👾 %(avatar)s %(nickname)s has left the game! Don\'t take it personally, y\'all.',NULL,'2016-05-27 18:56:59'),(105,'left_game_leaver',NULL,'👾 You\'ve successfully left the game. Sorry to see you go! If you\'d like to rejoin, you\'ll have to be reinvited by somebody.',NULL,'2016-05-27 18:57:19'),(106,'cron-waiting-to-begin-guessing',NULL,'Start guessing, kids! %(avatar)s %(nickname)s has submitted:\n\n%(submission)s',NULL,'2016-10-09 20:13:58'),(107,'cron-waiting-to-begin-guessing-2',NULL,'Come on, y\'all! %(avatar)s %(nickname)s has submitted:\n\n%(submission)s',NULL,'2016-10-09 20:14:05');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message_variants`
--

DROP TABLE IF EXISTS `message_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `message_variants` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `message_id` int(11) DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=129 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message_variants`
--

LOCK TABLES `message_variants` WRITE;
/*!40000 ALTER TABLE `message_variants` DISABLE KEYS */;
INSERT INTO `message_variants` VALUES (99,29,'👾 What a wonderful set of emoji! You are smart, and good looking. I sent your emoji phrase to the group. Let the round begin!','2016-04-30 21:31:35'),(100,29,'👾 Fantastic set of emoji! I sent your emoji phrase to the group. Let\'s play!','2016-04-30 21:34:27'),(101,31,'Text OPTIONS if you get stuck, or ask for a CLUE!','2016-04-30 22:17:07'),(102,31,'Text OPTIONS if you get stuck. You can also ask for a CLUE!','2016-04-30 22:17:21'),(103,29,'👾 Wow, that\'s an awesome emoji set! Let\'s start the round!','2016-04-30 22:25:23'),(104,29,'👾 Gosh, those are great. Let\'s get started!','2016-04-30 22:25:38'),(105,29,'👾 Great emoji, I sent along to the group. Let\'s get going!','2016-04-30 22:25:53'),(106,32,'👾 🎉Yay! %2$s %1$s got it RIGHT! 🎉\nThe phrase was %3$s ','2016-05-15 19:30:11'),(107,32,'👾 🎉WAHOO %2$s %1$s wins the round! 🎉\nThe phrase was %3$s ','2016-05-15 19:30:31'),(108,32,'👾 🎉KWABLAMMO %2$s %1$s is the winner! 🎉\nThe phrase was %3$s ','2016-05-15 19:30:43'),(109,32,'👾 🎉HUZZAH %2$s %1$s for the win! 🎉\nThe phrase was %3$s ','2016-05-15 19:30:55'),(110,103,'👾 %(avatar)s %(nickname)s wants a little hint! no problem—the clue I\'ll give you is: %(game.round.clue)s','2016-05-16 01:37:43'),(111,103,'👾 %(avatar)s %(nickname)s has kindly requested a clue! Your clue is: %(game.round.clue)s','2016-05-16 01:37:51'),(112,103,'👾Here\'s a clue for you, %(avatar)s %(nickname)s : %(game.round.clue)s','2016-05-16 01:38:45'),(113,90,'👾 Sorry, I didn\'t quite get that. Be sure to text KEEP to keep your default emoji or text a single emoji to replace it.','2016-05-16 01:40:15'),(114,33,'👾 It\'s time for %2$s %1$s to take a turn. You\'ll be guessing this round.','2016-05-16 01:42:38'),(115,33,'👾 And we continue on to %2$s %1$s. You\'ll be guessing the emoji in this round.','2016-05-16 01:43:06'),(116,34,'👾 Hey %2$s %1$s, this is your time to shine. Your phrase is: %3$s\n\nYour goal is to get the other players to guess the phrase using only emojis. If you get stuck you can ask for OPTIONS, or you can PASS if you give up.','2016-05-16 01:44:45'),(117,34,'👾 Hey %2$s %1$s, time to take your turn! Your phrase is: %3$s\n\nYour goal is to get the other players to guess the phrase using only emojis. If you get stuck you can ask for OPTIONS, or you can PASS if you give up.','2016-05-16 01:44:52'),(119,34,'👾 Let\'s see it, %2$s %1$s! It\'s your turn, and your phrase is: %3$s\n\nYour goal is to get the other players to guess the phrase using only emojis. If you get stuck you can ask for OPTIONS, or you can PASS if you give up.','2016-05-16 01:45:44'),(120,29,'👾 Oh I have a good feeling about this round! I sent your emoji phrase to the group. Let the see what they guess!','2016-05-16 01:48:36'),(121,29,'👾 You must have picked these emoji carefully—they look great! I sent your emoji phrase to the group. Let the guessing begin!','2016-05-16 01:48:42'),(122,29,'👾 Thanks so much for sending over your emoji! I just sent them over to the group. Let\'s see what they guess!','2016-05-16 01:51:19'),(123,29,'👾 Great job this round! I just sent over your emoji phrase to the group. These guesses should be coming through in no time!','2016-05-16 01:52:05'),(124,100,'👾 Hey %2$s %1$s, just a friendly reminder that the group\'s waiting on you to submit some emojis. The phrase is %3$s. feel free to PASS if you don\'t want to play this round.','2016-05-16 01:54:42'),(125,94,'👾 Looks like no one has got it right yet! Keep trying, I know you\'ll get it! The emojis are %1$s. Don\'t forget about that CLUE if you get stuck.\n','2016-05-16 01:56:09'),(126,94,'👾No correct answers quite yet. This must be a tough one! The emojis are %1$s. Don\'t forget about that CLUE if you get stuck.\n','2016-05-16 01:57:33'),(127,94,'👾 We\'re still waiting on that right answer. Keep trying, you\'ll get it! The emojis are %1$s. You can always ask for a CLUE if you get stuck.\n','2016-05-16 01:57:38'),(128,103,'👾 %(avatar)s %(nickname)s asked for a clue! All right then, your clue is: %(game.round.clue)s','2016-07-30 23:29:16');
/*!40000 ALTER TABLE `message_variants` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-10-09 16:23:53
