-- Active: 1706643717890@@127.0.0.1@3306@video_game
CREATE DATABASE video_game;
USE video_game;
  DEFAULT CHARACTER SET = 'utf8mb4';


CREATE TABLE Platforms (
  platform_id INTEGER PRIMARY KEY,
  platform_name VARCHAR(100) UNIQUE NOT NULL,
  platform_game_count INTEGER NOT NULL,
  platform_year INTEGER,
  platform_image VARCHAR(255),
  CONSTRAINT check_platform_uri_format CHECK (platform_image REGEXP '^https?://.*')
  
);



CREATE TABLE Genres (
  genre_id INTEGER PRIMARY KEY,
  genre_name VARCHAR(100) UNIQUE NOT NULL,
  genre_game_count INTEGER NOT NULL,
  genre_image VARCHAR(255),
  CONSTRAINT check_genre_uri_format CHECK (genre_image REGEXP '^https?://.*')
);



CREATE TABLE Games (
  game_id INTEGER PRIMARY KEY,
  game_name VARCHAR(100) NOT NULL,
  game_rating DECIMAL(3, 1) CHECK (game_rating BETWEEN 0 AND 10), -- Assuming rating is a decimal value
  game_image VARCHAR(255),
  CONSTRAINT check_game_uri_format CHECK (game_image REGEXP '^https?://.*')
);



CREATE TABLE Users (
  user_id INTEGER AUTO_INCREMENT PRIMARY KEY,
  user_name VARCHAR(100) UNIQUE NOT NULL ,
  user_mail VARCHAR(255) UNIQUE NOT NULL CHECK (user_mail LIKE '%@gmail.com'),
  user_password VARCHAR(255) NOT NULL , -- Storing hashed passwords for security
  CONSTRAINT check_password_length CHECK (LENGTH(user_password) >= 8)
);


CREATE TABLE Reviews (
  review_id INTEGER AUTO_INCREMENT PRIMARY KEY,
  game_id INTEGER, 
  user_id INTEGER,
  comment TEXT NOT NULL,
  date_posted DATETIME DEFAULT CURRENT_TIMESTAMP,
  review_rating DECIMAL(3, 1) CHECK( review_rating BETWEEN 0 AND 10), -- Allow users to rate the game
  FOREIGN KEY (game_id) REFERENCES Games(game_id) ON DELETE CASCADE ON UPDATE NO ACTION,
  FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE NO ACTION
);

SELECT * FROM `Reviews`;



CREATE TABLE Following_Genre(
  user_id INTEGER,
  genre_id INTEGER,
  genre_name VARCHAR(100) UNIQUE NOT NULL,
  date_followed DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id,genre_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE NO ACTION,
  FOREIGN KEY (genre_id) REFERENCES Genres (genre_id)  ON DELETE CASCADE ON UPDATE NO ACTION,
  FOREIGN KEY (genre_name) REFERENCES Genres (genre_name) ON DELETE CASCADE ON UPDATE NO ACTION
);



CREATE TABLE Following_Platform(
  user_id INTEGER,
  platform_id INTEGER,
  date_followed DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(user_id,platform_id),
  FOREIGN KEY(user_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE NO ACTION,
  FOREIGN KEY (platform_id) REFERENCES Platforms(platform_id) ON DELETE CASCADE ON UPDATE NO ACTION
);
  





CREATE TABLE Library (
  user_id INTEGER,
  game_id INTEGER,
  date_added DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, game_id), -- Composite primary key
  FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE ON UPDATE NO ACTION,
  FOREIGN KEY (game_id) REFERENCES Games(game_id) ON DELETE CASCADE ON UPDATE NO ACTION
);

--Indexation
CREATE UNIQUE INDEX idx_reviews_user_game ON Reviews (game_id, user_id, comment(255)) USING BTREE;--index pour trouver facilement la review d'un user 
CREATE UNIQUE INDEX idx_users ON Users(user_id,user_name) USING BTREE; --index pour trouver rapidement l'user à supprimer 
CREATE UNIQUE INDEX idx_users_game_library ON Library(user_id,game_id) USING BTREE; --Index pour trouver rapidement  le jeux à retirer de la library
CREATE UNIQUE INDEX idx_users_genre_follow ON Following_Genre(user_id,genre_id) USING BTREE; --index pour trouver rapidement le genre à unfollow 
CREATE UNIQUE INDEX idx_users_platform_follow On Following_Platform(user_id,platform_id) USING BTREE; --index pour trouver rapidement la platforme à unfollow




    

-- Creer des Routines pour les fonctionnalités suivante : 
la création d’un compte pour l’utilisateur ou supprimer l’utilisateur 
Ajout/Supprimer un  jeux à notre wishlist 
Suivre un genre ou une platforme ( Ajout à la liste de following )
Ajout/Modifier/Supprimer une review 
Mettre une note à un jeu 


--Un conseil moi perso j'aurai utilisé des procédures ou fonctions pour tout ce qui est ajouter
-- pour le rester supprimer/modifier j'aurai utilisé des triggers 
--Exemple avec un trigger pour supprimer la review d'un user  supprimé

DELIMITER //

CREATE TRIGGER delete_review_old_user
AFTER DELETE ON Users 
FOR EACH ROW
BEGIN
    UPDATE Reviews 
    SET comment = NULL, 
        review_rating = NULL
    WHERE user_id = OLD.user_id;
END;
//

DELIMITER ;


--Procédure pour ajouter un utilisateur 
DELIMITER //

CREATE PROCEDURE add_user(IN p_username VARCHAR(255), IN p_usermail VARCHAR(255) , p_userpassword VARCHAR(255))
BEGIN
      IF EXISTS (SELECT * FROM Users WHERE user_mail = p_usermail) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Le mail existe déjà ';
      ELSE
        INSERT INTO Users (user_name , user_mail , user_password) VALUES(p_username,p_usermail,p_userpassword);
      END IF;
END//

DELIMITER;



--Procedure pour retirer un jeu 
DELIMITER//
CREATE PROCEDURE remove_game(IN p_user_id INTEGER,IN p_game_id INTEGER)
BEGIN
      DELETE FROM Library WHERE user_id = p_user_id AND game_id = p_game_id;
END//

DELIMITER;
      


--Fonction pour supprimer un utilisateur 
DELIMITER//

CREATE FUNCTION delete_user(userID INT)
RETURNS INT DETERMINISTIC
BEGIN
    DECLARE rows_affected INT;
    
    DELETE FROM Users WHERE user_id = userID;
    SET rows_affected = ROW_COUNT();
    
    RETURN rows_affected;
END//

DELIMITER;

--Procedure pour Retirer un genre 
CREATE PROCEDURE remove_genre(IN p_user_id INTEGER , IN p_genre_id INTEGER)
BEGIN
      DELETE FROM `Following_Genre` WHERE user_id = p_user_id AND genre_id = p_genre_id;
END//

DELIMITER;

--Procedure pour retirer une plateforme

DELIMITER//
CREATE PROCEDURE remove_platform(IN p_user_id INTEGER, IN p_platform_id INTEGER)
BEGIN
      DELETE FROM `Following_Platform` WHERE user_id = p_user_id AND platform_id = p_platform_id;
END//


DELIMITER;

DELIMITER//

CREATE PROCEDURE remove_review(IN p_user_id INTEGER , IN p_game_id INTEGER)
BEGIN
    DELETE FROM `Reviews` WHERE user_id = p_user_id AND game_id = p_game_id;
END//

DELIMITER;

-- Nous n'avons donc pas besoin de trigger pour supprimer ou mettre à NULL les éléments
-- d'une library/following list ou encore une review  si l'utilisateur est supprimé grâce
-- à la présence des contraintes de référence.


SELECT * FROM `Users`;

SELECT * FROM `Library`;

SELECT * FROM `Following_Genre`;
SELECT * FROM `Following_Platform`;

SELECT * FROM `Reviews`;

SELECT * FROM `Genres`;