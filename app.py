from flask import Flask , render_template , session , jsonify 
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



if __name__ == '__main__':
    app.run(debug=True,host='127.0.0.1',port=5000)