from flask import Flask
import sqlalchemy
import pymysql #DBAPI connector

app = Flask(__name__)

conn_string = "mysql+pymysql://test:pass@localhost:3306/emilmar"
engine = sqlalchemy.create_engine(conn_string)
conn = engine.connect()

#res = conn.execute("select * from bostader")
#for row in res:
#	print(row)

@app.route("/")
def hello():
    return "Hello World!"

if __name__ == "__main__":
    app.run(debug=True)