import mysql.connector
import httpx #Performe mieux que requests...
import json
import numpy as np
import scipy.stats as scs
import pandas as pd
#import matplotlib.pyplot as plt
# Importation pour la base de données
import mysql.connector

import names
from mysql.connector import Error
from faker import Faker
# pip install imdbpy

#from imdb import *

from datetime import date
#%%  Connection creation function

def create_connection(host_name, user_name, user_password, db_name, db_port):
   
    connection = None
    try:
       
        connection = mysql.connector.connect(
            host = host_name,
            user = user_name,
            passwd = user_password,
            database = db_name,
            port = db_port
        )
        print("Connection to DB successful")
    except Error as e:
        print(f"Database error: {e}")

    return connection

create_connection("localhost", "root", "", "video_game", 3306)
# No result query function

def execute_query(connection, query):
    cursor = connection.cursor()
    try:
        cursor.execute(query)
        connection.commit()
        print("Query executed successfully")
    except Error as e:
        print(f"Database error: {e}")
       
# Reading query function

def execute_read_query(connection, query):
    cursor = connection.cursor()
    result = None
    try:
        cursor.execute(query)
        result = cursor.fetchall()
        return result
    except Error as e:
        print(f"Database error: {e}")

#%% Connect

#port = 3306 # Port par défaut pour BdD : MariaDB en salle de TP, MySQL à la maison (probablement)
port = 3307 # Port pour la deuxième BdD si vous utilisez WampServer (MariaDB à la maison, rien en salle de TP)

connection = create_connection("localhost", "root", "", "video_game", 3306)
#%% Nous avons la taille de chaque table
#taille_table_film=100
taille_table_utilisateur=1000
#taille_table_visionnage=10000
#taille_table_preference=taille_table_visionnage

#%% Utilisation de la librairie faker pour générer des Noms et Prénoms
# Les usernames générées sont le prénom et l'année de naissance collés
fake=Faker()
fake.name()

# Simulation des année de naissance à l'aide la loi beta (age compris entre 10 et 90 ans)
list_Annee_naissance=2024-scs.beta.rvs(2.2,6,loc=10,scale=100,size=taille_table_utilisateur).astype(int)


Usermail_list=[]
Username_list=[]
for i in range(taille_table_utilisateur):
    rand_name = names.get_last_name()
    rand_name1 = names.get_first_name()
    Usermail_list.append(rand_name+"."+rand_name1+"@gmail.com")
    Username_list.append(rand_name1+str(list_Annee_naissance[i]))

#%%

# pour générer un mot de passe
from random import choice, randint
alphabet_min = [ chr(i) for i in range(97,123) ]
alphabet_maj = [ chr(i) for i in range(65,91) ]
chiffres = [ chr(i) for i in range(48,58) ]
caracteres_speciaux = [ '%' , '_' , '-' , '!' , '$' , '^' , '&' , '#' , '(' , ')' , '[' , ']' , '=' , '@']
def pwd(n , min = True, maj = True, chif = True, cs = True):
    alphabets = dict()
    key = 0
    if min:
        alphabets[key] = alphabet_min
        key += 1
    if maj:
        alphabets[key] = alphabet_maj
        key += 1
    if chif:
        alphabets[key] = chiffres
        key += 1
    if cs:
        alphabets[key] = caracteres_speciaux
        key += 1
   
    mdp = ''
    for i in range(n):
            s = randint(0,key-1)
            mdp += choice( alphabets[s] )
           
    return mdp

Password_list=[pwd(8) for i in range(taille_table_utilisateur)]
user_id=list(range(1,1001))

#%%Fonction permettant d'ajouter les données dans la table utilisateur

def insert_utilisateur(Id_utilisateur,Username,Usermail,Password):
    insert_query = """
    INSERT INTO `users`(id,Username,Usermail,Password)

    VALUES
      (%s,%s,%s,%s);
    """
    var = (Id_utilisateur,Username,Usermail,Password)
    try :
        curseur=connection.cursor()
        curseur.execute(insert_query,var)
        connection.commit()
        print("Ligne ajoutée avec succés")
    except Error as e:
        print(f"Erreur d'ajout : {e}")

#%% La fonction pour vider la table Utilisatuer
clear_query = """SET FOREIGN_KEY_CHECKS = 0 """
execute_query(connection, clear_query)  
clear_query = """TRUNCATE table utilisateur """
execute_query(connection, clear_query)  
clear_query = """SET FOREIGN_KEY_CHECKS = 1"""
execute_query(connection, clear_query)  

#%% Pour remplir la table
for i in range(taille_table_utilisateur):
    insert_utilisateur(int(user_id[i]),Username_list[i],Usermail_list[i],Password_list[i])
#Connexion à la base de donnée
