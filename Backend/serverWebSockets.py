from flask import Flask, render_template
from flask_socketio import SocketIO # pip install flask-socketio
from flask_socketio import send, emit # pip install eventlet
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
import sqlalchemy
import json

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
session = Session(engine)  # Used for db-queries

# Handle a connect
@socketio.on('connect')
def handle_connect():
    print('Client connected to server')

# Handle disconnect
@socketio.on('disconnect')
def handle_disconnect():
	print('Client disconnected')

# Check if user is in database
# Returns true if user exists
@socketio.on('check_db')
def handle_my_custom_event(message):
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

# Check if a username already exists in the database
def check_db(user):
	query = session.query(Users).filter(Users.username == user)
	if not query.all(): # If list is empty, return false because no user was found
		return False
	return True

if __name__ == '__main__':
    socketio.run(app, port=5001)