CREATE DATABASE IF NOT EXISTS CorsacKMS;
USE CorsacKMS;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
SET time_zone = "+00:00";
START TRANSACTION;
DROP TABLE IF EXISTS audit;
DROP TABLE IF EXISTS configurations;
DROP TABLE IF EXISTS configuration_keys;
DROP TABLE IF EXISTS configuration_strings;
DROP TABLE IF EXISTS devices;
DROP TABLE IF EXISTS permissions;
DROP TABLE IF EXISTS permission_lookup;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS role_lookup;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS user_auth;
CREATE TABLE `audit` (  `user_id` int NOT NULL,  `action` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `configurations` (  `id` int NOT NULL,  `configuration_number` int NOT NULL,  `device_id` int NOT NULL,  `created_at` timestamp NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `configuration_keys` (  `configuration_id` int NOT NULL,  `hexdigest` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,  `salt` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `configuration_strings` (  `configuration_id` int NOT NULL,  `hexdigest` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,  `salt` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `devices` (  `id` int NOT NULL,  `device_guid` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,  `device_name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,  `created_by` int NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `permissions` (  `id` int NOT NULL,  `action` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,  `description` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `permission_lookup` (  `role_id` int NOT NULL,  `permission_id` int NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `roles` (  `id` int NOT NULL,  `name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `role_lookup` (  `user_id` int NOT NULL,  `role_id` int NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `users` (  `id` int NOT NULL,  `first_name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,  `last_name` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,  `username` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,  `modified_at` timestamp NULL DEFAULT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE `user_auth` (  `user_id` int NOT NULL,  `password` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,  `OTP_secret` JSON NOT NULL, `authentication_attempts` int NOT NULL,  `locked` tinyint(1) NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
ALTER TABLE `audit`  ADD KEY `user_id` (`user_id`);
ALTER TABLE `configurations`  ADD PRIMARY KEY (`id`),  ADD KEY `device_id` (`device_id`);
ALTER TABLE `configuration_keys`  ADD KEY `configuration_id` (`configuration_id`);
ALTER TABLE `configuration_strings`  ADD KEY `configuration_id` (`configuration_id`);
ALTER TABLE `devices`  ADD PRIMARY KEY (`id`),  ADD KEY `created_by` (`created_by`);
ALTER TABLE `permissions`  ADD PRIMARY KEY (`id`);
ALTER TABLE `permission_lookup`  ADD KEY `role_id` (`role_id`,`permission_id`),  ADD KEY `permission_id` (`permission_id`);
ALTER TABLE `roles`  ADD PRIMARY KEY (`id`);
ALTER TABLE `role_lookup`  ADD KEY `user_id` (`user_id`,`role_id`),  ADD KEY `role_id` (`role_id`);
ALTER TABLE `users`  ADD PRIMARY KEY (`id`),  ADD UNIQUE KEY `username` (`username`);
ALTER TABLE `user_auth`  ADD KEY `user_id` (`user_id`);
ALTER TABLE `configurations`  MODIFY `id` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `devices`  MODIFY `id` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `permissions`  MODIFY `id` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `roles`  MODIFY `id` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `users`  MODIFY `id` int NOT NULL AUTO_INCREMENT;
ALTER TABLE `user_auth` CHANGE `authentication_attempts` `authentication_attempts` INT NOT NULL DEFAULT '0';
ALTER TABLE `user_auth` CHANGE `locked` `locked` TINYINT(1) NOT NULL DEFAULT '0';
ALTER TABLE `audit`  ADD CONSTRAINT `audit_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
ALTER TABLE `configurations`  ADD CONSTRAINT `configurations_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`);
ALTER TABLE `configuration_keys`  ADD CONSTRAINT `configuration_keys_ibfk_1` FOREIGN KEY (`configuration_id`) REFERENCES `configurations` (`id`);
ALTER TABLE `configuration_strings`  ADD CONSTRAINT `configuration_strings_ibfk_1` FOREIGN KEY (`configuration_id`) REFERENCES `configurations` (`id`);
ALTER TABLE `devices`  ADD CONSTRAINT `devices_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);
ALTER TABLE `permission_lookup`  ADD CONSTRAINT `permission_lookup_ibfk_1` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`),  ADD CONSTRAINT `permission_lookup_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);
ALTER TABLE `role_lookup`  ADD CONSTRAINT `role_lookup_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),  ADD CONSTRAINT `role_lookup_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`);
ALTER TABLE `user_auth`  ADD CONSTRAINT `user_auth_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;
SET FOREIGN_KEY_CHECKS = 1;