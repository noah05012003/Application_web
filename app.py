from flask import Flask , render_template
from static.auth import auth
from static.views import views
from static.server import server

app = Flask(__name__)
app.secret_key = 'Ujojo'

@app.route("/")
def login():
    return render_template("login.html")


app.register_blueprint(auth , url_prefix='/')
app.register_blueprint(views , url_prefix='/')
app.register_blueprint(server , url_prefix='/')


if __name__ == '__main__':
    app.run(debug=True,host='127.0.0.1',port=5000)
    