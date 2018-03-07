from flask import Flask, request, render_template
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
import pymysql #DBAPI connector
import requests

app = Flask(__name__)

# Connects to database
conn_string = "mysql+pymysql://test:pass@localhost:3306/emilmar"
engine = sqlalchemy.create_engine(conn_string)
#conn = engine.connect()

# Creates models from the database
Base = automap_base()
Base.prepare(engine, reflect=True)
Users = Base.classes.users
Sources = Base.classes.sources
Comments = Base.classes.comments
Articles = Base.classes.articles
session = Session(engine)  # Used for db-queries

# Adds users for testing
#session.add(Users("emil", "emilmar@kth.se", 0, 0, "test"))
#session.commit()

#res = conn.execute("select * from kallor")
#for row in res:
#    print(row)

# Routes to start page
@app.route("/")
def index():
    return "Hello world!"
    #return render_template("../rssapp/components/pages/Login.js")
    #r = requests.post("http://localhost:5000/login", data={"name": "emil", "password": "test"})
    #print(r)

# Attemps to perform a login
@app.route("/login", methods=["POST"])
def login():
    print(request.form)
    name = request.form["name"]
    password = request.form["password"]
    query = session.query(Users).filter(Users.username == name, Users.passw == password)
    print(query)
    print("Något händer i login()")
    return "login screen"

# Routes to the news page
@app.route("/news", methods=["GET"])
def news():
    return render_template("News.js")

if __name__ == "__main__":
    app.run(debug=True)
    #r = requests.post("http://localhost:5000/login", data = {"name": "emil", "password": "test"})

