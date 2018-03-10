from flask import Flask, render_template
from flask_socketio import SocketIO # pip install flask-socketio
from flask_socketio import send, emit # pip install eventlet

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
app.config['DEBUG'] = True
socketio = SocketIO(app, ping_timeout=30, ping_interval=10) # modify ping to not upset RN 

# Handle a general message
@socketio.on('connect')
def handle_message():
    print('Client connected to server')

@socketio.on('YOUR EVENT TO SERVER')
def handle_my_custom_event(message):
	print('recieved: ')
	print(message)
	emit('EVENT YOU WANNA LISTEN', 'payload')

if __name__ == '__main__':
    socketio.run(app, port=5001)