from flask import Flask, request, render_template, abort
import sqlalchemy
import json
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
import pymysql #DBAPI connector
import requests
from werkzeug.security import generate_password_hash


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
@app.route("/", methods = ['GET', 'POST'])
def index():
    response = {}
    response["ok"] = "no"
    json_response = json.dumps(response)
    return json_response

# Attemps to perform a login
@app.route("/login", methods=['GET', 'POST'])
def login():
    payload = request.get_json() # convert to JSON (only works with application/json header set)
    name = payload["user"]
    password = payload["pass"]
    hash_pass = generate_password_hash(password) # SHA256 hashing (not used)
    query = session.query(Users).filter(Users.username == name, Users.passw == password)
    try:
        results = query.one() # Make call to DB
        userID = results.id # Raises AttributeError if not found
        return "ok"
        """
        Till Lukas:
        När du kallar på resultatet till en query, kör query.all() för flera rader.
        För att accessa det: query.all returnerar en lista (om det är flera objekt ,annars bara 1 tror jag)
        Det returnerar varje element som en instans av det table man queriat, i.e. för att få all data
        måste du accessa attribut för varje kolumn. E.g. results.id ger dig id kolumnen, et c
        """
    except AttributeError:
        abort(401) # Unauthorized if user data was not found
    except Exception: # Unable to import correct exception, so catch all is used for sqlalchemy errors
        abort(401) # Unauthorized if 


# Routes to the news page
@app.route("/news", methods=["GET"])
def news():
    return render_template("News.js")

if __name__ == "__main__":
    #context = ('localhost.crt', 'rssapp.key')
    #app.run(debug=True, ssl_context=context)
    app.run(debug=True)
