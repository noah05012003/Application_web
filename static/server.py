from flask import Blueprint , jsonify, request , render_template , session
import mysql.connector
from flask_bcrypt import generate_password_hash


cnx = mysql.connector.connect(
    user = "root", password="raoul123", host="localhost", database="video_game")

cursor = cnx.cursor()

server = Blueprint('server',__name__)

@server.route("/signUp/create_account", methods = ['POST'])
def create_account():
    data = request.get_json()
    user_data = (data["Username"],data["Email"],generate_password_hash(data["Password"])) #chiffrage du mot de passe 
    
    try:
        
        sql_command = "CALL add_user(%s,%s,%s);"
        cursor.execute(sql_command,user_data)
        cnx.commit()
        
        if cursor.rowcount > 0:
           return  jsonify({"message":"L'utilisateur à bien  été ajouté"}) , 201
        else:
            return jsonify({"message":"L'Utilisateur n'a pas été ajouté "}), 500
        
    except mysql.connector.Error as err:
        
        print("Erreur MySQL:", err)
        return jsonify({"message":"Erreur lors de l'insertion de l'utilisateur"}), 500
       
    
    finally :
        
        if 'cursor' in locals():
            cursor.close()
        if 'cnx' in locals():
            cnx.close()




@server.route("/user/delete/",methods=['POST'])
def delete_user():

    try:
        
        user_id = session.get("user_id") #Récupère l'id de l'user dans la session 
        sql_command = "CALL delete_user(%s);"
        cursor.execute(sql_command,(user_id,))
        result = cursor.fetchone()[0]
        cnx.commit()
        
        if result == 1:
            return jsonify({"message":"L'utilisateur à été bien été supprimé"}) , 201
        else:
            return jsonify({"message":"L'Utilisateur n'a pas été supprimé ou n'existe pas "}), 404 
        
    except  mysql.connector.Error as err:
        
        cnx.rollback()
        print("Erreur MySQL:",err)
        return jsonify({"message":"Erreur lors de la suppression de l'utilisateur"}), 500
        
    finally:
        cursor.close()
        cnx.close()
        session.clear()       
        return render_template("login.html")
    
        
            

@server.route("/user/add/game/gameID=<int:game_id>", methods = ['POST'])
def add_game_to_library(game_id):
    
    try:
        user_id = session.get("user_id")
        sql_command = "INSERT INTO Library(user_id,game_id) VALUES(%s,%s);"
        cursor.execute(sql_command,(user_id,game_id))
        result = cursor.fetchone()
        cnx.commit()
        if result == 0:
            return jsonify({"message":"Le jeu est déjà présent dans votre library"}),200
        else:
            return jsonify({"message":"Le jeu à bien été ajouté dans votre library"}),201
        
        
    except mysql.connector.Error as err:
        print("Erreur MYSQL:",err)
        return jsonify({"message":"Erreur lors de l'ajout du jeu"}),500
    finally:
        
        if 'cursor' in locals():
            cursor.close()
        if 'cnx' in locals():
            cnx.close()
        
        
    