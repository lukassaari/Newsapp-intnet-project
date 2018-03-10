from flask import Flask, request, render_template, abort, jsonify
import sqlalchemy
import json
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
import pymysql #DBAPI connector
import requests
from werkzeug.security import generate_password_hash
import RssReader

app = Flask(__name__)

# Connects to database
conn_string = "mysql+pymysql://test:pass@localhost:3306/emilmar?charset=utf8"
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

# Variables for keeping track of user
app.currUserId = 9999

# Creates the RSS-reader
#lastId = session.query(Articles())
lastArticle = session.query(Articles).order_by(Articles.pubTime.desc()).first()  # Gets the last published article in the database
if lastArticle != None:
    lastId = lastArticle.id  # The id of the latest article
else:  # If database is empty a value needs to be assigned to prevent errors
    lastId = 0
rssReader = RssReader.RssReader("Cision", "http://news.cision.com/se/ListItems?format=rss", lastId)
news = rssReader.getNews()  # Fetches news
if news:  # If not empty
    for id in news:  # Adds news to the database
        print("Adding ", id)
        print(news[id])
        session.add(Articles(id=id, commentCount=0, upvoteCount=0, readCount=0, title=news[id]["title"],
                             content=news[id]["content"], sourcee=rssReader.source, pubTime=news[id]["published"]))
    session.commit()  # Commit adds to the database

# Sets the curr user id
def setUserId(userId):
    app.currUserId = userId

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
        setUserId(results.id)  # Raises AttributeError if not found. Updates user id
        return "ok"
    except AttributeError:
        abort(401) # Unauthorized if user data was not found
    except Exception: # Unable to import correct exception, so catch all is used for sqlalchemy errors
        abort(401) # Unauthorized if 

# Routes to the news page
@app.route("/news", methods=["GET"])
def news():
    newsList = []  # List of news articles to pass to the news page
    query = session.query(Articles).order_by(Articles.pubTime.desc()).limit(20)  # 20 latest news stories
    news = query.all()
    for article in news:  # Adds all news articles to the list
        newsList.append({"commentCount": article.commentCount, "upvoteCount": article.upvoteCount,
                         "readCount": article.readCount, "title": article.title, "content": article.content,
                         "source": article.sourcee, "pubTime": article.pubTime, "id": article.id})
    newsListJson = jsonify({'articles': newsList})
    return newsListJson

# Upvotes a specified article
@app.route("/upvote", methods=["POST"])
def upvote():
    try:
        payload = request.get_json()  # convert to JSON (only works with application/json header set)
        articleId = payload["articleId"]

        # Increments the upvote count of the article and the user by 1
        session.query(Articles).filter(Articles.id == articleId).update({"upvoteCount" : Articles.upvoteCount + 1})
        session.query(Users).filter(Users.id == app.currUserId).update({"upvoteCount" : Users.upvoteCount + 1})
        session.commit()

        return "ok"
    except Exception as e:
        print("Fel i /upvote: ", e)
        abort(401)


if __name__ == "__main__":
    app.run(debug=True)