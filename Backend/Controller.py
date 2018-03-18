from flask import Flask, request, render_template, abort, jsonify
import json
import datetime
import Model
import bcrypt
import sys
from flask_socketio import SocketIO # pip install flask-socketio
from flask_socketio import send, emit # pip install eventlet

# Creates the Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
#app.config['DEBUG'] = True # same function as argument in run

# Creates the model that contains RSS readers to update news articles as well as the database connection and database models
model = Model.Model()

# Creates the socket connection
socketio = SocketIO(app, ping_timeout=30, ping_interval=10) # modify ping to not upset RN

# Routes to start page
@app.route("/", methods = ['GET', 'POST'])
def index():
    response = {}
    response["ok"] = "no"
    json_response = json.dumps(response)
    return json_response

# Attemps to perform a login
# Password is retrieved from the database and then compared using a built in bcrypt function
@app.route("/login", methods=['GET', 'POST'])
def login():
    payload = request.get_json() # convert to JSON (only works with application/json header set)
    name = payload["user"]
    password = payload["pass"]
    query = model.session.query(model.Users).filter(model.Users.username == name)
    try:
        results = query.one() # Make call to DB
        stored_password_hash = results.passw
        if bcrypt.checkpw(password.encode("utf-8"), stored_password_hash.encode("utf-8")):
            model.setUser(results.id, name)  # Raises AttributeError if not found. Updates user id
            return "ok"
        else:
            abort(401)
    except AttributeError as e:
        print("AttributeError i /login: ", e)
        abort(401) # Unauthorized if user data was not found
    except Exception as e: # Unable to import correct exception, so catch all is used for sqlalchemy errors
        print("Fel i /login: ", e)
        abort(401) # Unauthorized

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
    model.session.commit() # Make sure it is up to date
    return newsListJson

# LEGACY:: Fetches historical comments for a specific article
@app.route("/getComments", methods=["GET"])
def getComments():
    payload = request.get_json()
    articleId = payload["articleId"]
    query = model.session.query(model.Comments).filter(model.Comments.article == articleId) # .order_by(Comments.pubTime.desc())
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
                    "commentCount": userInfo.commentCount, "upvoteGivenCount": userInfo.upvoteGivenCount,
                    "upvoteReceivedCount": userInfo.upvoteReceivedCount}
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

# Update read count for given article and its source
@app.route("/articles/<articleID>/read-count", methods=["PATCH"])
def updateReadCount(articleID):
    try:
        model.session.query(model.Articles).filter(model.Articles.id == articleID).update({"readCount" : model.Articles.readCount + 1}) # Increase readcount
        sourceID = model.session.query(model.Articles).filter(model.Articles.id == articleID).one().sourcee
        model.session.query(model.Sources).filter(model.Sources.title == sourceID).update({"readCount" : model.Sources.readCount + 1}) # Increase readcount for source
        model.session.commit()
        return "Ok"
    except Exception as e: # In unable to find ID; return 404 not found
        print("Error when increasing read count: ", e)
        abort(404)

# Upvotes a specified article
@app.route("/articles/<articleID>/upvote", methods=["PATCH"])
def upvote(articleID):
    try:
        payload = request.get_json()  # convert to JSON (only works with application/json header set)
        source = payload["source"]

        # Increments the upvote count of the source, article, and user by 1
        model.session.query(model.Sources).filter(model.Sources.title == source).update({"upvoteCount": model.Sources.upvoteCount + 1})
        model.session.query(model.Articles).filter(model.Articles.id == articleID).update({"upvoteCount": model.Articles.upvoteCount + 1})
        model.session.query(model.Users).filter(model.Users.id == model.currUserId).update({"upvoteGivenCount": model.Users.upvoteGivenCount + 1})
        model.session.commit()

        return "ok"
    except Exception as e:
        print("Fel i /upvote: ", e)
        abort(401)

# Handle a connect to websocket
@socketio.on('connect')
def handle_connect():
    print('Client connected to server')

# Handle disconnect
@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

# Client requests comments for a specific id
@socketio.on('get_comments', namespace='/article')
def handle_get_comments(message):
    article_id = message # The message is simply an ID
    commentList = model.retrievComments(article_id) # Call subroutine to fetch comments
    emit('all_comments', commentList)

# Client wants to add a comment
@socketio.on('add_comment', namespace='/article')
def handle_add_comment(message):
    commentText = message["commentText"]
    articleId = message["articleId"]
    source = message["source"]

    # Inserts the comment into the database
    time_added = datetime.datetime.now() # will be unique per user
    model.session.add(model.Comments(uid=model.currUserId, pubTime=time_added, upvoteCount=0,
                                     content=commentText, username=model.username, article=articleId))

    # Increments the comment count of the article and the user
    model.session.query(model.Sources).filter(model.Sources.title == source).update({"commentCount" : model.Sources.commentCount + 1})
    model.session.query(model.Articles).filter(model.Articles.id == articleId).update({"commentCount" : model.Articles.commentCount + 1})
    model.session.query(model.Users).filter(model.Users.id == model.currUserId).update({"commentCount" : model.Users.commentCount + 1})
    model.session.commit()
    latest_comment = model.session.query(model.Comments).filter(
        model.Comments.article == articleId,
        model.Comments.username == model.username).order_by(model.Comments.pubTime.desc()).first()

    new_comment = {"commentText": latest_comment.content, "upvoteCount": latest_comment.upvoteCount, "pubTime": latest_comment.pubTime.__str__(),
                                    "username": latest_comment.username, "id": latest_comment.id, "uid": latest_comment.uid, "article": latest_comment.article}
    emit('new_comment', new_comment, broadcast=True) # Tell all users to update their commentview (in current namespace)

# Upvotes a comment
@socketio.on("upvote_comment", namespace='/article')
def handleUpvoteComment(message):
    commentId = message["commentId"]
    commentUid = message["uid"]
    articleId = message["articleId"]

    # Increments upvoteGivenCount for the user performing the upvote, upvoteReceivedCount for the user that submitted the comment,
    #   and the upvoteCount for the comment
    model.session.query(model.Users).filter(model.Users.id == model.currUserId).update({"upvoteGivenCount" : model.Users.upvoteGivenCount + 1})
    model.session.query(model.Users).filter(model.Users.id == commentUid).update({"upvoteReceivedCount" : model.Users.upvoteReceivedCount + 1})
    model.session.query(model.Comments).filter(model.Comments.id == commentId).update({"upvoteCount" : model.Comments.upvoteCount + 1})
    model.session.commit()

    upvoted_comment = model.session.query(model.Comments).filter(model.Comments.id == commentId).one()
    upvoted_comment_dict = {"commentText": upvoted_comment.content, "upvoteCount": upvoted_comment.upvoteCount, "pubTime": upvoted_comment.pubTime.__str__(),
                                    "username": upvoted_comment.username, "id": upvoted_comment.id, "uid": upvoted_comment.uid, "article": upvoted_comment.article}
    emit('comment_changed', upvoted_comment_dict, broadcast=True) # Tell all users to update their commentview

# Check if user is in database
# Returns true if user exists
@socketio.on('check_db', namespace='/create-account')
def handle_check_db(message):
    if model.checkUsernameValidity(message['user']):
        send({'status': True})
    else:
        send({'status': False})

# Add a new account to the database
# Account passwords are secured using the bcrypt hashing algorithm with salt added.
# The salt is incorporated into the hash and thus need not be stored separately
@socketio.on('create_account', namespace='/create-account')
def handle_create_account(message):
    username = message['user']
    password = message['pass']
    password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()) # SHA256 hashing
    email = message['email']
    if model.checkUsernameValidity(username): # In case client checks have not been properly done and user is in db
        emit('add_user', {'status': False}) 
        return
    model.session.add(model.Users(id=None, username=username, email=email, commentCount=0, upvoteGivenCount=0,
                                  upvoteReceivedCount=0, passw=password))
    try:
        model.session.commit() # Add user to database and update the engine view
        emit('add_user', {'status': True})
    except Exception:
        emit('add_user', {'status': False})

# Handle general messages
@socketio.on('message')
def handle_message(message):
    print("This is a general message")
    print(message)

if __name__ == "__main__":
    socketio.run(app, port=5000)