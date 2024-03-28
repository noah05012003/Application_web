from flask import Blueprint , jsonify, request
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
           return  jsonify({"message":"L'utilisateur à été bie été ajouté"}) , 201
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
            

            
