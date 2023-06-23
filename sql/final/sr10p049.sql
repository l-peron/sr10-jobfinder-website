-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 23, 2023 at 08:10 PM
-- Server version: 10.3.38-MariaDB-0+deb10u1
-- PHP Version: 7.3.31-1~deb10u3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sr10p049`
--

-- --------------------------------------------------------

--
-- Table structure for table `candidatures`
--

CREATE TABLE `candidatures` (
  `id` int(11) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `user` int(11) NOT NULL,
  `offre` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `fiche_postes`
--

CREATE TABLE `fiche_postes` (
  `id` int(11) NOT NULL,
  `title` varchar(256) NOT NULL,
  `status` varchar(256) NOT NULL,
  `type` enum('CDD','CDI','Stage','Mission') NOT NULL,
  `address` varchar(256) NOT NULL,
  `description` longtext NOT NULL,
  `responsable` int(11) NOT NULL,
  `workflow` int(11) NOT NULL,
  `salary` int(11) NOT NULL,
  `organisation` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `offre_emplois`
--

CREATE TABLE `offre_emplois` (
  `id` int(11) NOT NULL,
  `status` enum('draft','published','expired') DEFAULT 'draft',
  `valid_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `fiche` int(11) NOT NULL,
  `organisation` varchar(256) NOT NULL,
  `required_documents` varchar(256) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `organisations`
--

CREATE TABLE `organisations` (
  `siren` varchar(256) NOT NULL,
  `name` varchar(256) NOT NULL,
  `type` varchar(256) NOT NULL,
  `address` varchar(256) NOT NULL,
  `status` enum('pending','accepted','refused') NOT NULL DEFAULT 'pending',
  `created_by` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `organisations_members`
--

CREATE TABLE `organisations_members` (
  `id` int(11) NOT NULL,
  `requested_at` datetime NOT NULL DEFAULT current_timestamp(),
  `answered_at` timestamp NULL DEFAULT NULL,
  `user` int(11) NOT NULL,
  `organisation` varchar(256) NOT NULL,
  `status` enum('pending','accepted','refused') NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pieces_jointes`
--

CREATE TABLE `pieces_jointes` (
  `id` int(11) NOT NULL,
  `original_filename` varchar(256) NOT NULL,
  `categorie` varchar(256) NOT NULL,
  `candidature` int(11) NOT NULL,
  `filename` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `salarys`
--

CREATE TABLE `salarys` (
  `id` int(11) NOT NULL,
  `average_salary` float NOT NULL,
  `min_salary` float NOT NULL,
  `max_salary` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `utilisateurs`
--

CREATE TABLE `utilisateurs` (
  `id` int(11) NOT NULL,
  `name` varchar(256) NOT NULL,
  `surname` varchar(256) NOT NULL,
  `email` varchar(256) NOT NULL,
  `password` varchar(256) NOT NULL,
  `salt` varchar(256) DEFAULT NULL,
  `phone_number` varchar(256) NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `role` enum('utilisateur','recruteur') DEFAULT 'utilisateur',
  `admin` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `workflows`
--

CREATE TABLE `workflows` (
  `id` int(11) NOT NULL,
  `description` varchar(256) DEFAULT NULL,
  `hours` int(11) NOT NULL,
  `remote` tinyint(1) NOT NULL,
  `day_off` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `candidatures`
--
ALTER TABLE `candidatures`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_candidatures` (`offre`,`user`);

--
-- Indexes for table `fiche_postes`
--
ALTER TABLE `fiche_postes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `responsable` (`responsable`),
  ADD KEY `workflow` (`workflow`),
  ADD KEY `salary` (`salary`),
  ADD KEY `organisation` (`organisation`);

--
-- Indexes for table `offre_emplois`
--
ALTER TABLE `offre_emplois`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fiche` (`fiche`),
  ADD KEY `organisation` (`organisation`);

--
-- Indexes for table `organisations`
--
ALTER TABLE `organisations`
  ADD PRIMARY KEY (`siren`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `organisations_members`
--
ALTER TABLE `organisations_members`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_organisation` (`organisation`),
  ADD KEY `FK_user` (`user`);

--
-- Indexes for table `pieces_jointes`
--
ALTER TABLE `pieces_jointes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `candidature` (`candidature`);

--
-- Indexes for table `salarys`
--
ALTER TABLE `salarys`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `workflows`
--
ALTER TABLE `workflows`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `candidatures`
--
ALTER TABLE `candidatures`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `fiche_postes`
--
ALTER TABLE `fiche_postes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `offre_emplois`
--
ALTER TABLE `offre_emplois`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `organisations_members`
--
ALTER TABLE `organisations_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pieces_jointes`
--
ALTER TABLE `pieces_jointes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `salarys`
--
ALTER TABLE `salarys`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `workflows`
--
ALTER TABLE `workflows`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `candidatures`
--
ALTER TABLE `candidatures`
  ADD CONSTRAINT `candidatures_ibfk_2` FOREIGN KEY (`offre`) REFERENCES `offre_emplois` (`id`);

--
-- Constraints for table `fiche_postes`
--
ALTER TABLE `fiche_postes`
  ADD CONSTRAINT `fiche_postes_ibfk_1` FOREIGN KEY (`responsable`) REFERENCES `utilisateurs` (`id`),
  ADD CONSTRAINT `fiche_postes_ibfk_2` FOREIGN KEY (`workflow`) REFERENCES `workflows` (`id`),
  ADD CONSTRAINT `fiche_postes_ibfk_3` FOREIGN KEY (`salary`) REFERENCES `salarys` (`id`),
  ADD CONSTRAINT `fiche_postes_ibfk_4` FOREIGN KEY (`organisation`) REFERENCES `organisations` (`siren`);

--
-- Constraints for table `offre_emplois`
--
ALTER TABLE `offre_emplois`
  ADD CONSTRAINT `offre_emplois_ibfk_1` FOREIGN KEY (`fiche`) REFERENCES `fiche_postes` (`id`),
  ADD CONSTRAINT `offre_emplois_ibfk_2` FOREIGN KEY (`organisation`) REFERENCES `organisations` (`siren`);

--
-- Constraints for table `organisations`
--
ALTER TABLE `organisations`
  ADD CONSTRAINT `organisations_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `utilisateurs` (`id`);

--
-- Constraints for table `organisations_members`
--
ALTER TABLE `organisations_members`
  ADD CONSTRAINT `organisations_members_ibfk_1` FOREIGN KEY (`user`) REFERENCES `utilisateurs` (`id`),
  ADD CONSTRAINT `organisations_members_ibfk_2` FOREIGN KEY (`organisation`) REFERENCES `organisations` (`siren`);

--
-- Constraints for table `pieces_jointes`
--
ALTER TABLE `pieces_jointes`
  ADD CONSTRAINT `candidature` FOREIGN KEY (`candidature`) REFERENCES `candidatures` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `pieces_jointes_ibfk_1` FOREIGN KEY (`candidature`) REFERENCES `candidatures` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
