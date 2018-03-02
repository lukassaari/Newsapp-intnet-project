import sqlalchemy
import pymysql #DBAPI connector

conn_string = "mysql+pymysql://test:pass@localhost:3306/emilmar"
engine = sqlalchemy.create_engine(conn_string)
conn = engine.connect()

res = conn.execute("select * from bostader")
for row in res:
	print(row)
