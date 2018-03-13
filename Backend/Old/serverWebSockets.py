from flask import Flask, render_template, jsonify
from flask_socketio import SocketIO # pip install flask-socketio
from flask_socketio import send, emit # pip install eventlet
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
import sqlalchemy
import json
import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
app.config['DEBUG'] = True # same function as argument in run
socketio = SocketIO(app, ping_timeout=30, ping_interval=10) # modify ping to not upset RN

# Connects to database
conn_string = "mysql+pymysql://test:pass@localhost:3306/emilmar?charset=utf8"
engine = sqlalchemy.create_engine(conn_string)

# Creates neccessary models for the database queries
Base = automap_base()
Base.prepare(engine, reflect=True)
Users = Base.classes.users
Sources = Base.classes.sources
Comments = Base.classes.comments
Articles = Base.classes.articles
session = Session(engine)  # Used for db-queries

# Variables for keeping track of user
app.currUserId = 1  # UPPDATERAS ALDRIG BEHÖVER LÖSAS
app.username = "l"

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
	commentList = retrieve_comments(article_id) # Call subroutine to fetch comments
	emit('comments', commentList)

# Client wants to add a comment
@socketio.on('add_comment')
def handle_add_comment(message):
	commentText = message["commentText"]
	articleId = message["articleId"]
	source = message["source"]

	# Inserts the comment into the database
	session.add(Comments(uid=app.currUserId, pubTime=datetime.datetime.now(), upvoteCount=0, content=commentText, username=app.currUserId,
                         article=articleId))

	# Increments the comment count of the article and the user
	session.query(Sources).filter(Sources.title == source).update({"commentCount" : Sources.commentCount + 1})
	session.query(Articles).filter(Articles.id == articleId).update({"commentCount" : Articles.commentCount + 1})
	session.query(Users).filter(Users.id == app.currUserId).update({"commentCount" : Users.commentCount + 1})
	session.commit()
	commentList = retrieve_comments(articleId)
	emit('comments', commentList, broadcast=True) # Tell all users to update their commentview


# Check if user is in database
# Returns true if user exists
@socketio.on('check_db')
def handle_check_db(message):
	if check_db(message['user']):
		send({'status': True})
	else:
		send({'status': False})

# Add a new account to the database
@socketio.on('create_account')
def handle_create_account(message):
	print("Creating account")
	username = message['user']
	password = message['pass']
	email = message['email']
	session.add(Users(id=None, username=username, email=email, commentCount=0, upvoteCount=0, passw=password))
	try:
		session.commit()
		emit('add_user', "success")
	except Exception:
		emit('add_user', "error occurred")

# Handle general messages
@socketio.on('message')
def handle_message(message):
	print("this is a general message")
	print(message)

# Check if a username already exists in the database
def check_db(user):
	query = session.query(Users).filter(Users.username == user)
	if not query.all(): # If list is empty, return false because no user was found
		return False
	return True

# Retrieve comments for a specific article in the database
def retrieve_comments(article_id):
	query = session.query(Comments).filter(Comments.article == article_id).order_by(Comments.pubTime.desc())
	comments = query.all()
	commentList = []
	if comments != None:  # Only wants to do this if any comments exist
		for comment in comments:
			commentList.append({"commentText": comment.content, "upvoteCount": comment.upvoteCount, "pubTime": comment.pubTime.__str__(),
                                "username": comment.username, "id": comment.id})
	session.commit() # Commit to get the latest
	return commentList

if __name__ == '__main__':
    socketio.run(app, port=5001)