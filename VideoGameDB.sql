-- Active: 1706643717890@@127.0.0.1@3306@VideoGame
CREATE DATABASE video_game;
USE video_game;
   DEFAULT CHARACTER SET = 'utf8mb4';


CREATE TABLE Platforms (
  platform_id INTEGER PRIMARY KEY,
  platform_slug VARCHAR(50) UNIQUE NOT NULL,
  platform_name VARCHAR(100) NOT NULL,
  description TEXT,
  platform_year INTEGER,
  platform_image VARCHAR(255)
);


CREATE TABLE Genres (
  genre_id INTEGER PRIMARY KEY,
  genre_slug VARCHAR(50) UNIQUE NOT NULL,
  genre_name VARCHAR(100) NOT NULL,
  description TEXT,
  genre_image VARCHAR(255)
);


CREATE TABLE Games (
  game_id INTEGER PRIMARY KEY,
  game_slug VARCHAR(50) UNIQUE NOT NULL,
  game_name VARCHAR(100) NOT NULL,
  description TEXT,
  game_rating DECIMAL(3, 1),
  game_image VARCHAR(255),
  prix DECIMAL(10, 2), -- Assuming price is stored as decimal
  platform_id INTEGER REFERENCES Platforms(platform_id),
  genre_id INTEGER,
  CONSTRAINT fk_games_genre FOREIGN KEY (genre_id) REFERENCES Genres(genre_id)
);


CREATE TABLE Users (
  user_id INTEGER PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  user_email VARCHAR(255) UNIQUE NOT NULL CHECK (user_email LIKE '%@gmail.com'),
  user_password VARCHAR(255) NOT NULL 
);


CREATE TABLE Reviews (
  review_id INTEGER PRIMARY KEY,
  game_id INTEGER, 
  user_id INTEGER,
  comment TEXT,
  date_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  game_rating DECIMAL(3, 1), 
  CONSTRAINT fk_review_game FOREIGN KEY (game_id) REFERENCES Games(game_id),
  CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES Users(user_id)
);


CREATE INDEX idx_reviews_user_game ON Reviews(user_id, game_id);


CREATE TABLE Following (
  follower_id INTEGER,
  user_id INTEGER,
  game_id INTEGER,
  date_followed DATE,
  PRIMARY KEY (follower_id),
  FOREIGN KEY (follower_id) REFERENCES Users(user_id)
);


CREATE TABLE Library (
  user_id INTEGER,
  game_id INTEGER,
  platform_id INTEGER,
  date_added DATE,
  PRIMARY KEY (user_id, game_id), 
  CONSTRAINT fk_library_user FOREIGN KEY (user_id) REFERENCES Users(user_id),
  CONSTRAINT fk_library_game FOREIGN KEY (game_id) REFERENCES Games(game_id),
  CONSTRAINT fk_library_platform FOREIGN KEY (platform_id) REFERENCES Platforms(platform_id),
  CONSTRAINT fk_library_reviews FOREIGN KEY (user_id, game_id) REFERENCES Reviews(user_id, game_id)
);
    
