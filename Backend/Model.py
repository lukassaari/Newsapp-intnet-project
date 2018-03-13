import sqlalchemy
import RssReaderCision
import RssReaderDI
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
import threading
import time

class Model:

    def __init__(self):

        # Connects to database
        conn_string = "mysql+pymysql://test:pass@localhost:3306/emilmar?charset=utf8"
        self.engine = sqlalchemy.create_engine(conn_string)

        # Creates models from the database
        Base = automap_base()
        Base.prepare(self.engine, reflect=True)
        self.Users = Base.classes.users
        self.Sources = Base.classes.sources
        self.Comments = Base.classes.comments
        self.Articles = Base.classes.articles
        self.session = Session(self.engine)  # Used for db-queries

        # Variables for keeping track of user
        self.currUserId = 1
        self.username = "l"

        # Creates RSS readers
        self.rssReaderCision = self.createRssReader("Cision", "http://news.cision.com/se/ListItems?format=rss")
        self.rssReaderDI = self.createRssReader("DI", "https://www.di.se/rss")

        # Creates a thread that fetches news once every five minutes
        self.updateNewsThread = threading.Thread(target=self.addNewsAll)
        self.updateNewsThread.start()

    # Creates a RSS reader for the specified source and url
    def createRssReader(self, source, url):
        lastArticle = self.session.query(self.Articles).filter(self.Articles.sourcee == source).order_by(self.Articles.pubTime.desc()).first()
        if lastArticle != None:
            lastId = lastArticle.id  # The id of the latest article
        else:  # If database is empty a value needs to be assigned to prevent errors
            lastId = 0
        if source == "Cision":  # Cision RSS reader
            rssReader = RssReaderCision.RssReaderCision(source, url, lastId)
        else:  # DI RSS reader
            rssReader = RssReaderDI.RssReaderDI(source, url, lastId)
        return rssReader

    # Adds news from all RSS readers
    def addNewsAll(self):
        while True:  # Loops once every five minutes
            print("Kör addNewsAll()")
            try:
                self.addNewsSpecific(self.rssReaderCision, "Cision")  # Fetches news from Cision
                self.addNewsSpecific(self.rssReaderDI, "DI")  # Fetches news from DI
                self.session.commit()  # Commits to database
            except Exception as e:
                print("Fel i addNewsAll(): ", e)
            time.sleep(300)

    # Fetches news from a specific RSS reader and source
    def addNewsSpecific(self, rssReader, source):
        counter = 0  # How many new articles that are found
        news = rssReader.getNews()  # Fetches news from Cision
        if news:  # If not empty
            for id in news:  # Adds news to the database
                print("Adding ", id)
                print(news[id])
                counter += 1
                self.session.add(self.Articles(id=id, commentCount=0, upvoteCount=0, readCount=0, title=news[id]["title"],
                                     content=news[id]["content"], sourcee=rssReader.source, pubTime=news[id]["published"]))
        self.session.query(self.Sources).filter(self.Sources.title == source).update({"publicizedCount": self.Sources.publicizedCount + counter})

    # Sets the curr user id
    def setUser(self, userId, username):
        self.currUserId = userId
        self.username = username

    # Check if a username already exists in the database
    def checkUsernameValidity(self, user):
        query = self.session.query(self.Users).filter(self.Users.username == user)
        if not query.all():  # If list is empty, return false because no user was found
            return False
        return True

    # Retrieves comments for a specified article
    def retrievComments(self,article_id):
        query = self.session.query(self.Comments).filter(self.Comments.article == article_id).order_by(self.Comments.pubTime.desc())
        comments = query.all()
        commentList = []
        if comments != None:  # Only wants to do this if any comments exist
            for comment in comments:
                commentList.append({"commentText": comment.content, "upvoteCount": comment.upvoteCount, "pubTime": comment.pubTime.__str__(),
                                    "username": comment.username, "id": comment.id, "uid": comment.uid, "article": comment.article})
        self.session.commit() # Commit to get the latest
        return commentList