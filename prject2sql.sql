CREATE DATABASE  IF NOT EXISTS `project2eme` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `project2eme`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: project2eme
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `avis`
--

DROP TABLE IF EXISTS `avis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `avis` (
  `id_avis` int NOT NULL AUTO_INCREMENT,
  `crit` json NOT NULL,
  PRIMARY KEY (`id_avis`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avis`
--

LOCK TABLES `avis` WRITE;
/*!40000 ALTER TABLE `avis` DISABLE KEYS */;
INSERT INTO `avis` VALUES (1,'[\"Excellent service\", \"Great food\", \"Nice ambiance\"]');
/*!40000 ALTER TABLE `avis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client`
--

DROP TABLE IF EXISTS `client`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `prenom` json NOT NULL,
  `mdp` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `is_owner` tinyint(1) DEFAULT '0',
  `id_avis` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `id_avis` (`id_avis`),
  CONSTRAINT `client_ibfk_1` FOREIGN KEY (`id_avis`) REFERENCES `avis` (`id_avis`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client`
--

LOCK TABLES `client` WRITE;
/*!40000 ALTER TABLE `client` DISABLE KEYS */;
INSERT INTO `client` VALUES (2,'client','[\"client\"]','client','client@email.com',0,1),(3,'ben','[\"yacine\"]','benyacine','benyacine@gmail.com',0,NULL),(4,'test','[\"test\"]','test','test@email.com',0,NULL),(5,'code','[\"code\"]','code','code@email.com',0,NULL),(9,'yacine','[\"benramdane\"]','t31louse','yacine2005tiaret@gmail.com',0,NULL);
/*!40000 ALTER TABLE `client` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `manager`
--

DROP TABLE IF EXISTS `manager`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `manager` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `prenom` json NOT NULL,
  `mdp` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `is_owner` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `manager`
--

LOCK TABLES `manager` WRITE;
/*!40000 ALTER TABLE `manager` DISABLE KEYS */;
INSERT INTO `manager` VALUES (2,'manager','[\"manager\"]','manager','manager@email.com',1);
/*!40000 ALTER TABLE `manager` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `photo`
--

DROP TABLE IF EXISTS `photo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `photo` (
  `id_photo` int NOT NULL AUTO_INCREMENT,
  `lesphoto` json NOT NULL,
  PRIMARY KEY (`id_photo`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `photo`
--

LOCK TABLES `photo` WRITE;
/*!40000 ALTER TABLE `photo` DISABLE KEYS */;
INSERT INTO `photo` VALUES (1,'[\"binary_data_1\", \"binary_data_2\"]');
/*!40000 ALTER TABLE `photo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `restaurant`
--

DROP TABLE IF EXISTS `restaurant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `restaurant` (
  `id_restaurant` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `emplacement` varchar(255) NOT NULL,
  `note` int DEFAULT NULL,
  `id_avis` int DEFAULT NULL,
  `opening_days` varchar(255) DEFAULT 'N/A',
  `opening_hours` json NOT NULL,
  `closing_hours` json NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `category` varchar(50) NOT NULL DEFAULT 'Restaurant',
  PRIMARY KEY (`id_restaurant`),
  KEY `id_avis` (`id_avis`),
  CONSTRAINT `restaurant_ibfk_1` FOREIGN KEY (`id_avis`) REFERENCES `avis` (`id_avis`),
  CONSTRAINT `restaurant_chk_1` CHECK ((`note` between 0 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurant`
--

LOCK TABLES `restaurant` WRITE;
/*!40000 ALTER TABLE `restaurant` DISABLE KEYS */;
INSERT INTO `restaurant` VALUES (1,'Le Gourmet','123 Rue de Paris, Paris',4,1,'[\"Monday\", \"Tuesday\", \"Wednesday\", \"Thursday\", \"Friday\", \"Saturday\"]','[9, 9, 9, 9, 9, 11]','[22, 22, 22, 22, 23, 23]',NULL,'Restaurant'),(5,'test',', , ',NULL,NULL,'[{\"day\": \"Monday\", \"open\": false}, {\"day\": \"Tuesday\", \"open\": false}, {\"day\": \"Wednesday\", \"open\": false}, {\"day\": \"Thursday\", \"open\": false}, {\"day\": \"Friday\", \"open\": false}, {\"day\": \"Saturday\", \"open\": false}, {\"day\": \"Sunday\", \"open\": false}]','[\"09:00\", \"09:00\", \"09:00\", \"09:00\", \"09:00\", \"10:00\", \"10:00\"]','[\"18:00\", \"18:00\", \"18:00\", \"18:00\", \"18:00\", \"16:00\", \"16:00\"]',NULL,'Restaurant'),(6,'Chabati Sousa','Es senia En face Arret de Tramway Es senia Center',5,NULL,'Monday','\"08:00\"','\"08:00\"','A fine dining experience with exquisite cuisine and elegant atmosphere.','Restaurant'),(7,'Snack Boulvard','M92F+HG6, N2A, Es Senia',4,NULL,'Monday','\"08:00\"','\"08:00\"','Tacos, Pizza, Snack, Hamburgers & Others','Restaurant');
/*!40000 ALTER TABLE `restaurant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `restaurant_photo`
--

DROP TABLE IF EXISTS `restaurant_photo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `restaurant_photo` (
  `id_restaurant` int NOT NULL,
  `id_photo` int NOT NULL,
  PRIMARY KEY (`id_restaurant`,`id_photo`),
  KEY `id_photo` (`id_photo`),
  CONSTRAINT `restaurant_photo_ibfk_1` FOREIGN KEY (`id_restaurant`) REFERENCES `restaurant` (`id_restaurant`),
  CONSTRAINT `restaurant_photo_ibfk_2` FOREIGN KEY (`id_photo`) REFERENCES `photo` (`id_photo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `restaurant_photo`
--

LOCK TABLES `restaurant_photo` WRITE;
/*!40000 ALTER TABLE `restaurant_photo` DISABLE KEYS */;
INSERT INTO `restaurant_photo` VALUES (1,1);
/*!40000 ALTER TABLE `restaurant_photo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shopowner`
--

DROP TABLE IF EXISTS `shopowner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shopowner` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `prenom` json NOT NULL,
  `mdp` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `is_owner` tinyint(1) DEFAULT '1',
  `registre` longblob,
  `id_sub` int DEFAULT NULL,
  `id_avis` int DEFAULT NULL,
  `id_restaurant` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `id_sub` (`id_sub`),
  KEY `id_avis` (`id_avis`),
  KEY `fk_restaurant` (`id_restaurant`),
  CONSTRAINT `fk_restaurant` FOREIGN KEY (`id_restaurant`) REFERENCES `restaurant` (`id_restaurant`),
  CONSTRAINT `shopowner_ibfk_1` FOREIGN KEY (`id_sub`) REFERENCES `subscriber` (`id_sub`),
  CONSTRAINT `shopowner_ibfk_2` FOREIGN KEY (`id_avis`) REFERENCES `avis` (`id_avis`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shopowner`
--

LOCK TABLES `shopowner` WRITE;
/*!40000 ALTER TABLE `shopowner` DISABLE KEYS */;
INSERT INTO `shopowner` VALUES (4,'Shop','\"Owner\"','shopowner','shopowner@email.com',1,NULL,NULL,NULL,5);
/*!40000 ALTER TABLE `shopowner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shopowner_restaurant`
--

DROP TABLE IF EXISTS `shopowner_restaurant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shopowner_restaurant` (
  `id_owner` int NOT NULL,
  `id_restaurant` int NOT NULL,
  PRIMARY KEY (`id_owner`,`id_restaurant`),
  KEY `id_restaurant` (`id_restaurant`),
  CONSTRAINT `shopowner_restaurant_ibfk_1` FOREIGN KEY (`id_owner`) REFERENCES `shopowner` (`id`) ON DELETE CASCADE,
  CONSTRAINT `shopowner_restaurant_ibfk_2` FOREIGN KEY (`id_restaurant`) REFERENCES `restaurant` (`id_restaurant`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shopowner_restaurant`
--

LOCK TABLES `shopowner_restaurant` WRITE;
/*!40000 ALTER TABLE `shopowner_restaurant` DISABLE KEYS */;
/*!40000 ALTER TABLE `shopowner_restaurant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscriber`
--

DROP TABLE IF EXISTS `subscriber`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscriber` (
  `id_sub` int NOT NULL AUTO_INCREMENT,
  `type` int NOT NULL,
  `end` date NOT NULL,
  PRIMARY KEY (`id_sub`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscriber`
--

LOCK TABLES `subscriber` WRITE;
/*!40000 ALTER TABLE `subscriber` DISABLE KEYS */;
INSERT INTO `subscriber` VALUES (1,1,'2026-05-19');
/*!40000 ALTER TABLE `subscriber` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-21 19:44:27
