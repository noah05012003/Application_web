from flask import Blueprint , render_template , request , flash
from static.server import create_account
import mysql.connector
from flask_bcrypt import  check_password_hash



cnx = mysql.connector.connect(
    user = "root", password="raoul123", host="localhost", database="video_game")

cursor = cnx.cursor()

auth = Blueprint('auth',__name__)
ProfileUser = {}

@auth.route('/login')
def login_page():
    return render_template("login.html")

@auth.route('/login/users', methods = ['GET','POST']) #route vers la page html et fonction login
def login_user():
    if request.method == 'POST':
        Email = request.form.get("Email") #Obtenir les données du form 
        Password = request.form.get("Password")
        cursor.execute("SELECT user_password FROM Users WHERE user_mail = %s;",(Email,))
        password_hashed = cursor.fetchone() #Récupération du mot de passe chiffré 
        if (password_hashed != None) and check_password_hash(password_hashed[0],Password): 
            cursor.execute("SELECT * FROM Users WHERE user_mail = %s;",(Email,))
            info_user = cursor.fetchall()
        
            global ProfileUser 
            ProfileUser["Username"] = info_user[1]
            ProfileUser["Email"] = Email
            return render_template ("home.html" , profile = ProfileUser) #Rajouter profile dans home.html 
        else :
            flash("L'Email ou le mot de passe sont incorrects",category='error')
            return render_template("login.html") #Rajouter message dans login.html comme dans signUp.html
    
    

@auth.route('/signUp',methods = ['GET','POST']) #route vers la page sign Up et fonction sign Up
def signUp():
    if request.method == 'POST':
        Email = request.form.get("Email")
        Username = request.form.get("Username")
        Password = request.form.get("Password")
        Password_confirm = request.form.get("Password_confirm")
        
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
            flash("Votre à été crée avec succes ",category='success')
            #add to database avec fonction create_account() dans server.py
            #Ajouter les messages flash dans le fichier signUp.html
        return render_template ("login.html")
        
    return render_template("signUp.html")

@auth.route('/logout')
def logout():
    return render_template ("home.html",profile = None)


