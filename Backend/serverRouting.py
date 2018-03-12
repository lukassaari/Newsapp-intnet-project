from flask import Flask, request, render_template, abort, jsonify
import sqlalchemy
import json
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
import pymysql #DBAPI connector
import requests
from werkzeug.security import generate_password_hash
import RssReaderCision
import RssReaderDI
import datetime

# Fetches news from all RSS and adds them to the database
def addNews():
    newsCision = rssReaderCision.getNews()  # Fetches news from Cision
    if newsCision:  # If not empty
        for id in newsCision:  # Adds news to the database
            print("Adding ", id)
            print(newsCision[id])
            session.add(Articles(id=id, commentCount=0, upvoteCount=0, readCount=0, title=newsCision[id]["title"],
                                 content=newsCision[id]["content"], sourcee=rssReaderCision.source, pubTime=newsCision[id]["published"]))
        session.commit()  # Commit adds to the database

    newsDI = rssReaderDI.getNews()  # Fetches news from DI
    if newsDI:  # If not empty
        for id in newsDI:  # Adds news to the database
            print("Adding ", id)
            print(newsDI[id])
            session.add(Articles(id=id, commentCount=0, upvoteCount=0, readCount=0, title=newsDI[id]["title"],
                                 content=newsDI[id]["content"], sourcee=rssReaderDI.source, pubTime=newsDI[id]["published"]))
        session.commit()  # Commit adds to the database

# Sets the curr user id
def setUser(userId, username):
    app.currUserId = userId
    app.username = username

app = Flask(__name__)

# Connects to database
conn_string = "mysql+pymysql://test:pass@localhost:3306/emilmar?charset=utf8"
engine = sqlalchemy.create_engine(conn_string)

# Creates models from the database
Base = automap_base()
Base.prepare(engine, reflect=True)
Users = Base.classes.users
Sources = Base.classes.sources
Comments = Base.classes.comments
Articles = Base.classes.articles
session = Session(engine)  # Used for db-queries

# Variables for keeping track of user
app.currUserId = 1
app.username = "l"

# Creates the RSS-reader for Cision
# Gets the last published article in the database for Cision
lastArticleCision = session.query(Articles).filter(Articles.sourcee == "Cision").order_by(Articles.pubTime.desc()).first()
if lastArticleCision != None:
    lastIdCision = lastArticleCision.id  # The id of the latest article
else:  # If database is empty a value needs to be assigned to prevent errors
    lastIdCision = 0
rssReaderCision = RssReaderCision.RssReaderCision("Cision", "http://news.cision.com/se/ListItems?format=rss", lastIdCision)

# Creates the RSS-reader for DI
# Gets the last published article in the database for Cision
lastArticleDI = session.query(Articles).filter(Articles.sourcee == "DI").order_by(Articles.pubTime.desc()).first()
if lastArticleDI != None:
    lastIdDI = lastArticleDI.id  # The id of the latest article
else:  # If database is empty a value needs to be assigned to prevent errors
    lastIdDI = 0
rssReaderDI = RssReaderDI.RssReaderDI("DI", "https://www.di.se/rss", lastIdDI)

# Adds all new articles
addNews()

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
        setUser(results.id, name)  # Raises AttributeError if not found. Updates user id
        return "ok"
    except AttributeError as e:
        print("AttributeError i /login: ", e)
        abort(401) # Unauthorized if user data was not found
    except Exception as e: # Unable to import correct exception, so catch all is used for sqlalchemy errors
        print("Fel i /login: ", e)
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

# Submits a comment
@app.route("/comment", methods=["POST"])
def comment():
    try:
        payload = request.get_json()
        commentText = payload["commentText"]
        articleId = payload["articleId"]

        # Inserts the comment into the database
        session.add(Comments(uid=app.currUserId, pubTime=datetime.datetime.now(), upvoteCount=0, content=commentText, username=app.currUserId,
                             article=articleId))

        # Increments the comment count of the article and the user
        session.query(Articles).filter(Articles.id == articleId).update({"commentCount" : Articles.commentCount + 1})
        session.query(Users).filter(Users.id == app.currUserId).update({"commentCount" : Users.commentCount + 1})
        session.commit()

        return "ok"
    except Exception as e:
        print("Fel i /comment: ", e)
        abort(401)


# Fetches historical comments for a specific article
@app.route("/getComments", methods=["GET"])
def getComments():
    print("test")
    payload = request.get_json()
    print(payload)
    articleId = payload["articleId"]
    query = session.query(Comments).filter(Comments.article == articleId) # .order_by(Comments.pubTime.desc())
    print(query)
    comments = query.all()
    commentList = []
    if comments != None:  # Only wants to do this if any comments exist
        for comment in comments:
            commentList.append({"commentText": comment.content, "upvoteCount": comment.upvoteCount, "pubTime": comment.pubTime,
                                "username": comment.username, "id": comment.id})
    commentListJson = jsonify({"comments": commentList})
    return commentListJson

# Get user info for the user profile page
@app.route("/getUserInfo", methods=["GET"])
def getUserInfo():
    query = session.query(Users).filter(Users.id == app.currUserId)
    userInfo = query.one()
    userInfoDict = {"id": userInfo.id, "username": userInfo.username, "email": userInfo.email,
                    "commentCount": userInfo.commentCount, "upvoteCount": userInfo.upvoteCount}
    userInfoJson = jsonify({"userInfo": userInfoDict})

    return userInfoJson

# Get info about all sources
@app.route("/getSourcesInfo", methods=["GET"])
def getSourcesInfo():
    query = session.query(Sources)
    sourcesInfo = query.all()
    sourcesInfoList = []
    if sourcesInfo != None:
        for source in sourcesInfo:
            sourcesInfoList.append({"title": source.title, "readCount": source.readCount, "commentCount": source.commentCount,
                                    "upvoteCount": source.upvoteCount, "publicizedCount": source.publicizedCount})
    sourcesInfoJson = jsonify({"sourcesInfo": sourcesInfoList})

    return sourcesInfoJson

if __name__ == "__main__":
    app.run(debug=True)
