from flask import Flask , render_template , session , jsonify , flash , request
import mysql.connector
from flask_bcrypt import generate_password_hash , check_password_hash


app = Flask(__name__)
app.secret_key = 'Ujojo'
    
cnx = mysql.connector.connect(
    user = "root", password="raoul123", host="localhost", database="video_game")

cursor = cnx.cursor()


    
@app.route("/")
def login():
    return render_template("login.html")

@app.route("/signUp")
def signUp():
    return render_template("signUp.html")

@app.route("/following")
def following():
    return render_template("following.html")

@app.route("/library")
def library():
    return render_template("library.html")

@app.route("/genre")
def genre():
    return render_template("genres.html")

@app.route("/platforms")
def platforms():
    return render_template("platforms.html")
    
@app.route('/logout')
def logout():
    session.clear()
    return render_template ("login.html")

@app.route("/reviews")
def reviews():
    return render_template("reviews.html")

@app.route('/home')
def home():
    return render_template("home.html", profile = session)

#Authentification de l'utilisateur
profile = {}
@app.route("/login_user", methods = ["POST"]) #route vers la page html et fonction login
def login_user():
        Email = request.form.get("Email") #Obtenir les données du form 
        Password = request.form.get("Password")
        cursor.execute("SELECT * FROM Users WHERE user_mail = %s;", (Email,))
        info_user = cursor.fetchone()
        if info_user is not None:
            user_id , user_name , user_mail , user_password = info_user 
            if (check_password_hash(user_password,Password)):
                session['user_name'] = user_name
                session['user_mail'] = user_mail
                session['user_id'] = user_id
                flash(f"Bienvenue {user_name}")
                return render_template ("home.html" , profile = session),201
            else:
                flash("Le Mot de passe ou l'adresse mail est incorrect ",category='error')
                return render_template("login.html"),500
        else:
            flash("L'Utilisateur n'existe pas ",category='error')
            return render_template("login.html"),500
         
            
   
    

@app.route('/signUp_user', methods=["POST"])
def signUp_user():
    Email = request.form.get("Email")
    Username = request.form.get("Username")
    Password = request.form.get("Password")
    Password_confirm = request.form.get("Password Confirm")
    
    # Contraintes
    if len(Email) <= 10:
        flash("Votre email doit avoir plus de 10 caractères ", category='error')
        return render_template("signUp.html"),500
    elif len(Username) < 2:
        flash("Votre nom d'utilisateur doit avoir plus de 2 caractères ", category='error')
        return render_template("signUp.html"),500
    elif Password != Password_confirm:
        flash("Les mots de passe ne sont pas similaires ", category='error')
        return render_template("signUp.html"),500
    elif len(Password) < 8:
        flash("Votre mot de passe doit avoir plus de 8 caractères ", category='error')
        return render_template("signUp.html"),500
    
    else:
        # Ajouter l'utilisateur à la base de données
        user_data = (Username, Email, generate_password_hash(Password))
        try:
            sql_command = "CALL add_user(%s, %s, %s);"
            cursor.execute(sql_command, user_data)
            cnx.commit()
        
            if cursor.rowcount > 0:
                flash("Votre compte a été créé avec succès", category='success')
                return render_template("login.html") , 201
            else:
                flash("L'utilisateur n'a pas été ajouté ", category='error')
                return render_template("signUp.html") , 201
        
        except mysql.connector.Error as err:
            print("Erreur MySQL:", err)
            flash("Erreur lors de l'insertion de l'utilisateur", category='error')
            return render_template("signUp.html") , 500
           

@app.route("/user/delete/",methods=['POST'])
def delete_user():

    try:
        
        user_id = session.get("user_id") #Récupère l'id de l'user dans la session 
        sql_command = "CALL delete_user(%s);"
        cursor.execute(sql_command,(user_id,))
        result = cursor.fetchone()
        result_value = result[0]
        cnx.commit()
        
        
        
        if result_value == 1:
            return jsonify({"message": "L'utilisateur a été supprimé avec succès"}), 201
        else:
            return jsonify({"message": "L'utilisateur n'a pas été supprimé ou n'existe pas"}), 404
       
    except mysql.connector.Error as err:
        cnx.rollback()
        print("Erreur MySQL:", err)
        flash()
        return jsonify({"message": "Erreur lors de la suppression de l'utilisateur"}), 500
    finally:
        session.clear()
        flash("L'Utilisateur à bien été supprimé")
        return render_template("login.html")



    


if __name__ == '__main__':
    app.run(debug=True,host='127.0.0.1',port=5000)