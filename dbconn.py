import sqlalchemy
import pymysql #DBAPI connector
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session

conn_string = "mysql+pymysql://test:pass@localhost:3306/emilmar"
engine = sqlalchemy.create_engine(conn_string)

Base = automap_base()
Base.prepare(engine, reflect=True)
Users = Base.classes.users
Sources = Base.classes.sources
Comments = Base.classes.comments
Articles = Base.classes.articles
session = Session(engine)  # Used for db-queries

name = 'e'
password = 'pass'
# password = 'm'

query = session.query(Users).filter(Users.username == name, Users.passw == password)
res = query.all() # query db
print(res)
if isinstance(res, list):
	print("is list")
try:
	res.__table__
except AttributeError:
	print('oops')
query = session.query(Users).filter(Users.username == 'e', Users.passw == 'm')
res = query.all()
print(res)
print(res.username)