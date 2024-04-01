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
    return render_template("home.html")

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
@app.route("/login_user", methods = ["POST"]) #route vers la page html et fonction login
def login_user():
        Email = request.form.get("Email") #Obtenir les données du form 
        Password = request.form.get("Password")
        cursor.execute("SELECT user_password FROM Users WHERE user_mail = %s;",(Email,))
        password_hashed = cursor.fetchone() #Récupération du mot de passe chiffré 
        if (password_hashed != None) and check_password_hash(password_hashed[0],Password): 
            cursor.execute("SELECT * FROM Users WHERE user_mail = %s;",(Email,))
            info_user = cursor.fetchall()
            if info_user != None:
                
                session['user_name'] = info_user[1]
                session['user_mail'] = Email
                session['user_id'] = info_user[0]
                return render_template ("home.html" , profile = session)
            else:
                flash("L'Utilisateur n'existe pas ",category='error')
                return render_template("login.html")
               
        else :
            flash("L'Email ou le mot de passe sont incorrects",category='error')
            return render_template("login.html") #Rajouter message dans login.html comme dans signUp.html
   
    

@app.route('/signUp_user',methods = ["POST"]) #route vers la page sign Up et fonction sign Up
def signUp():
        Email = request.form.get("Email")
        Username = request.form.get("Username")
        Password = request.form.get("Password")
        Password_confirm = request.form.get("Password Confirm")
        
        #Contraintes
        if len(Email) <= 10:
            flash("Votre email doit avoir plus de 10 caractères ",category='error')
        elif len(Username) < 2:
            flash("Votre nom d'utilisateur doit avoir plus de 2 caractères ",category='error')
        elif (Password != Password_confirm):
            flash("Les mots de passes ne sont pas similaires ",category='error')
        elif len(Password) < 8:
            flash("Votre mot de passe doit avoir plus de 8 caractères ",category='error')
        else:
            create_account()
            flash("Votre compte à été crée avec succes ",category='success')
            #add to database avec fonction create_account() dans server.py
            #Ajouter les messages flash dans le fichier signUp.html
            return render_template ("login.html")
        
#Fonction pour ajouter l'utilisateur à la base de donnée
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


    


if __name__ == '__main__':
    app.run(debug=True,host='127.0.0.1',port=5000)