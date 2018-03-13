from flask import Flask, request, render_template, abort, jsonify
import json
from werkzeug.security import generate_password_hash
import datetime
import Model
from flask_socketio import SocketIO # pip install flask-socketio
from flask_socketio import send, emit # pip install eventlet

# Creates the Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
app.config['DEBUG'] = True # same function as argument in run

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
        source = payload["source"]

        # Increments the upvote count of the source, article, and user by 1
        model.session.query(model.Sources).filter(model.Sources.title == source).update({"upvoteCount": model.Sources.upvoteCount + 1})
        model.session.query(model.Articles).filter(model.Articles.id == articleId).update({"upvoteCount": model.Articles.upvoteCount + 1})
        model.session.query(model.Users).filter(model.Users.id == model.currUserId).update({"upvoteGivenCount": model.Users.upvoteGivenCount + 1})
        model.session.commit()

        return "ok"
    except Exception as e:
        print("Fel i /upvote: ", e)
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

# Handle a connect
@socketio.on('connect')
def handle_connect():
    print('Client connected to server')

# Handle disconnect
@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

# Client requests comments for a specific id
@socketio.on('get_comments')
def handle_get_comments(message):
    article_id = message # The message is simply an ID
    commentList = model.retrievComments(article_id) # Call subroutine to fetch comments
    emit('comments', commentList)

# Client wants to add a comment
@socketio.on('add_comment')
def handle_add_comment(message):
    commentText = message["commentText"]
    articleId = message["articleId"]
    source = message["source"]

    # Inserts the comment into the database
    model.session.add(model.Comments(uid=model.currUserId, pubTime=datetime.datetime.now(), upvoteCount=0,
                                     content=commentText, username=model.username, article=articleId))

    # Increments the comment count of the article and the user
    model.session.query(model.Sources).filter(model.Sources.title == source).update({"commentCount" : model.Sources.commentCount + 1})
    model.session.query(model.Articles).filter(model.Articles.id == articleId).update({"commentCount" : model.Articles.commentCount + 1})
    model.session.query(model.Users).filter(model.Users.id == model.currUserId).update({"commentCount" : model.Users.commentCount + 1})
    model.session.commit()
    commentList = model.retrievComments(articleId)
    emit('comments', commentList, broadcast=True) # Tell all users to update their commentview

# Upvotes a comment
@socketio.on("upvoteComment")
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

    commentList = model.retrievComments(articleId)
    emit('comments', commentList, broadcast=True) # Tell all users to update their commentview

# Check if user is in database
# Returns true if user exists
@socketio.on('check_db')
def handle_check_db(message):
    if model.checkUsernameValidity(message['user']):
        send({'status': True})
    else:
        send({'status': False})

# Add a new account to the database
@socketio.on('create_account')
def handle_create_account(message):
    username = message['user']
    password = message['pass']
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
    print("this is a general message")
    print(message)

if __name__ == "__main__":
    socketio.run(app, port=5000)
    #app.run(debug=True)
    #socketio.run(app, port=5000)