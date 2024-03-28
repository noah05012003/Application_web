from flask import Blueprint , jsonify, request 
import mysql.connector


cnx = mysql.connector.connect(
    user = "root", password="raoul123", host="localhost", database="video_game")

cursor = cnx.cursor()

server = Blueprint('server',__name__)

@server.route("/signUp/create_account", methods = ['POST'])
def create_account():
    pass