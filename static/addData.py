import mysql.connector
import httpx
import json


api_key = "86a34209259b4dd496f0989055c1711b"

cnx = mysql.connector.connect(
    user = "root", password="raoul123", host="localhost", database="video_game")

cursor = cnx.cursor()

#Ajouter les jeux 
games = []
for num_page in range(1,2):
    api_url = f"https://api.rawg.io/api/games?key={api_key}&page={num_page}"
    response = httpx.get(api_url)
    if response.status_code == 200:
        data_game = response.json()["results"]
        for game in data_game:
            game_id = game["id"]
            api_url = f"https://api.rawg.io/api/games/{game_id}?key={api_key}"
            response = httpx.get(api_url)
            
            if response.status_code == 200:
                data_game = response.json()
                games.append(data_game)
                print("Les données ont été inseré avec succes ")
            else:
                print(f"Erreur {response.status_code} lors de la récupération des données")
    else:
        print(f"Erreur {response.status_code} lors de la récupération des données") 
        
for game in games:
    sql_command = "INSERT INTO Games(game_id,game_slug,game_name,game_rating,game_image) VALUES(%s,%s,%s,%s,%s);"
    data_game = (
        game["id"],
        game["slug"],
        game["name"],
        game["rating"],
        game["background_image"],
    )
cursor.execute(sql_command,data_game)
cnx.commit()



#Ajouter les genres
genres = []
api_url = f"https://api.rawg.io/api/genres?key={api_key}"
response = httpx.get(api_url)
if response.status_code == 200:
    data_genre = response.json()["results"]
    for genre in data_genre:
        genre_id = genre["id"]
        api_url = f"https://api.rawg.io/api/genres/{genre_id}?key={api_key}"
        response = httpx.get(api_url)
        
        if response.status_code == 200:
            data_genre = response.json()
            genres.append(data_genre)
            print("Les données ont été inseré avec succes")
        else:
            print(f"Erreur {response.status_code} lors de la récupération des données")
else:
    print(f"Erreur {response.status_code} lors de la récupération des données")

for genre in genres:
    sql_command = "INSERT INTO Genres(genre_id,genre_slug,genre_name,genre_game_count,description,genre_image) VALUES(%s,%s,%s,%s,%s,%s);"
    data_genre = (
        genre["id"],
        genre["slug"],
        genre["name"],
        genre["game_count"],
        genre["description"],
        genre["image_background"],
    )
cursor.execute(sql_command,data_genre)
cnx.commit()



#Ajouter les platformes 
platformes = []
for num_page in range(1,2):
    api_url = f"https://api.rawg.io/api/platforms?key={api_key}&page={num_page}"
    response = httpx.get(api_url)
    if response.status_code == 200:
        data_platform = response.json()["results"]
        for platform in data_platform:
            platform_id = platform["id"]
            api_url = f"https://api.rawg.io/api/platforms/{platform_id}?key={api_key}"
            response = httpx.get(api_url)
            
            if response.status_code == 200:
                data_platform = response.json()
                platformes.append(data_platform)
                print("Les données ont été inseré avec succes ")
            else:
                print(f"Erreur {response.status_code} lors de la récupération des données")
    else:
        print(f"Erreur {response.status_code} lors de la récupération des données")

for platform in platformes:
    
    sql_command = "INSERT INTO Platforms(platform_id,platform_slug,platform_name,platform_game_count,description,platform_year,platform_image) VALUES(%s,%s,%s,%s,%s,%s);"
    data_platform = (
        platform["id"],
        platform["slug"],
        platform["name"],
        platform["game_count"],
        platform["description"],
        platform["year_start"],
        platform["image_background"],
    )
cursor.execute(sql_command,data_platform)
cnx.commit()


cursor.close()
cnx.commit()
cnx.close()

     
        
