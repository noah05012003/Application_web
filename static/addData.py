import mysql.connector
import httpx
import json


api_key = "86a34209259b4dd496f0989055c1711b"

cnx = mysql.connector.connect(
    user = "root", password="raoul123", host="localhost", database="video_game")

cursor = cnx.cursor()

#Ajouter les jeux 
games = []
for num_page in range(1, 6):
    api_url = f"https://api.rawg.io/api/games?key={api_key}&page={num_page}"
    response = httpx.get(api_url)
    
    if response.status_code == 200:
        data_games = response.json()["results"]
        
        for game in data_games:
            game_id = game["id"]
            game_name = game["name"]
            game_rating = game["rating"]
            game_image = game["background_image"]
            
            games.append((game_id, game_name, game_rating, game_image))
            
        print("Les données ont été insérées avec succès"),200
    else:
        print(f"Erreur {response.status_code} lors de la récupération des données")

sql_command = "INSERT INTO Games(game_id, game_name, game_rating, game_image) VALUES(%s, %s, %s, %s);"
cursor.executemany(sql_command, games)
cnx.commit()


#Ajouter les genres
genres = []
api_url = f"https://api.rawg.io/api/genres?key={api_key}"
response = httpx.get(api_url)

if response.status_code == 200:
    data_genres = response.json()["results"]
    
    for genre in data_genres:
        genre_id = genre["id"]
        genre_name = genre["name"]
        genre_game_count = genre["games_count"]
        genre_image = genre["image_background"]
        
        genres.append((genre_id, genre_name, genre_game_count, genre_image))
        
    print("Les données ont été insérées avec succès"),200
else:
    print(f"Erreur {response.status_code} lors de la récupération des données")

sql_command = "INSERT INTO Genres(genre_id, genre_name, genre_game_count, genre_image) VALUES(%s, %s, %s, %s);"
cursor.executemany(sql_command, genres)
cnx.commit()



#Ajouter les platformes 
platforms = []
for num_page in range(1, 2):
    api_url = f"https://api.rawg.io/api/platforms?key={api_key}&page={num_page}"
    response = httpx.get(api_url)
    
    if response.status_code == 200:
        data_platforms = response.json()["results"]
        
        for platform in data_platforms:
            platform_id = platform["id"]
            platform_name = platform["name"]
            platform_game_count = platform["games_count"]
            platform_year_start = platform["year_start"]
            platform_image = platform["image_background"]
            
            platforms.append((platform_id, platform_name, platform_game_count,platform_year_start, platform_image))
            print("Les données ont été insérées avec succès")
    else:
        print(f"Erreur {response.status_code} lors de la récupération des données")

sql_command = "INSERT INTO Platforms(platform_id, platform_name, platform_game_count,platform_year, platform_image) VALUES(%s, %s, %s, %s, %s);"
cursor.executemany(sql_command, platforms)
cnx.commit()


cursor.close()
cnx.commit()
cnx.close()

print("Terminé!!!")


     
        
