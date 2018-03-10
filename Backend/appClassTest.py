from flask import Flask, request, render_template, abort, jsonify
import sqlalchemy
import json
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
import pymysql #DBAPI connector
import requests
from werkzeug.security import generate_password_hash
import RssReader

class appPy:
    def __init__(self):
        self.app = Flask(__name__)

        # Connects to database
        conn_string = "mysql+pymysql://test:pass@localhost:3306/emilmar?charset=utf8"
        self.engine = sqlalchemy.create_engine(conn_string)

        # Creates models from the database
        Base = automap_base()
        Base.prepare(self.engine, reflect=True)
        self.Users = Base.classes.users
        self.Sources = Base.classes.sources
        self.Comments = Base.classes.comments
        self.Articles = Base.classes.articles
        self.session = Session(self.engine)  # Used for db-queries

        # Variables for keeping track
        self.currUserId = 9999
        #self.lastArticle = 9999  # Id of the last read article

        # Creates the RSS-reader
        self.rssReader = self.readRss()

    # Creates the RSS-reader
    def readRss(self):
        # lastId = session.query(Articles())
        lastArticle = self.session.query(self.Articles).order_by(self.Articles.pubTime.desc()).first()  # Gets the last published article in the database
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
                self.session.add(self.Articles(id=id, commentCount=0, upvoteCount=0, readCount=0, title=news[id]["title"],
                                     content=news[id]["content"], sourcee=rssReader.source,
                                     pubTime=news[id]["published"]))
            self.session.commit()  # Commit adds to the database
        return rssReader

    # Sets the user id
    def setUserId(self, userId):
        self.currUserId = userId

    # Routes to start page
    @app.route("/", methods = ['GET', 'POST'])
    def index(self):
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
        currUserId = results.id # Raises AttributeError if not found
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
    payload = request.get_json()  # convert to JSON (only works with application/json header set)
    articleId = payload["articleId"]
    #userId = payload["userId"]


if __name__ == "__main__":
    #context = ('localhost.crt', 'rssapp.key')
    #app.run(debug=True, ssl_context=context)
    app.run(debug=True)
