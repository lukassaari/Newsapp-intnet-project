from flask import Flask, request, render_template, abort, jsonify
import json
from werkzeug.security import generate_password_hash
import datetime
import Model

# Creates the Flask app
app = Flask(__name__)

# Creates the model that contains RSS readers to update news articles as well as the database connection and database models
model = Model.Model()

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
    query = model.session.query(model.Users).filter(model.Users.username == name, model.Users.passw == password)
    try:
        results = query.one() # Make call to DB
        model.setUser(results.id, name)  # Raises AttributeError if not found. Updates user id
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
    # addNews()  # Adds new articles

    newsList = []  # List of news articles to pass to the news page
    query = model.session.query(model.Articles).order_by(model.Articles.pubTime.desc()).limit(20)  # 20 latest news stories
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
        model.session.query(model.Articles).filter(model.Articles.id == articleId).update({"upvoteCount": model.Articles.upvoteCount + 1})
        model.session.query(model.Users).filter(model.Users.id == model.currUserId).update({"upvoteCount": model.Users.upvoteCount + 1})
        model.session.commit()

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
        model.session.add(model.Comments(uid=model.currUserId, pubTime=datetime.datetime.now(), upvoteCount=0, content=commentText, username=model.currUserId,
                             article=articleId))

        # Increments the comment count of the article and the user
        model.session.query(model.Articles).filter(model.Articles.id == articleId).update({"commentCount" : model.Articles.commentCount + 1})
        model.session.query(model.Users).filter(model.Users.id == model.currUserId).update({"commentCount" : model.Users.commentCount + 1})
        model.session.commit()

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
    query = model.session.query(model.Comments).filter(model.Comments.article == articleId) # .order_by(Comments.pubTime.desc())
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
    query = model.session.query(model.Users).filter(model.Users.id == model.currUserId)
    userInfo = query.one()
    userInfoDict = {"id": userInfo.id, "username": userInfo.username, "email": userInfo.email,
                    "commentCount": userInfo.commentCount, "upvoteCount": userInfo.upvoteCount}
    userInfoJson = jsonify({"userInfo": userInfoDict})

    return userInfoJson

# Get info about all sources
@app.route("/getSourcesInfo", methods=["GET"])
def getSourcesInfo():
    query = model.session.query(model.Sources)
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
