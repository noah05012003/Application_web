from flask import Flask , render_template
app = Flask(__name__)

@app.route("/")
def home():
    return render_template("home.html")

from static.auth import auth
from static.views import views
from static.server import server
app.register_blueprint(auth , url_prefix='/')
app.register_blueprint(views , url_prefix='/')
app.register_blueprint(server , url_prefix='/')


if __name__ == '__main__':
    app.run(debug=True,host='127.0.0.1',port=5000)
    