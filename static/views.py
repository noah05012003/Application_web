from flask import Blueprint , render_template , session

views = Blueprint('views',__name__)

@views.route('/following')
def following():
    return render_template("following.html")

@views.route('/library')
def library():
    return render_template("library.html")

@views.route('/genre')
def genre():
    return render_template("genre.html")

@views.route('/platforms')
def platforms():
    return render_template("platforms.html")

@views.route('/signUp')
def signUp():
    return render_template("signUp.html")

@views.route('/home')
def home():
    return render_template("home.html", profile = session)


    
