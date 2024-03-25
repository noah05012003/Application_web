from flask import Blueprint , render_template

auth = Blueprint('auth',__name__)

@auth.route('/login') #route vers la page html et fonction login
def login():
    return render_template("login.html")

@auth.route('/signUp') #route vers la page sign Up et fonction sign Up
def signUp():
    return render_template("signUp.html")


