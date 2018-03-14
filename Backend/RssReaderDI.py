import feedparser
from hashlib import md5
from time import mktime
from datetime import datetime

# Reading and returning a dict of all new articles from: http://news.cision.com/se/ListItems?format=rss
class RssReaderDI:

    # source: Name of the news source
    # url: The RSS-feed to read
    # latestId: The id of the latest news article currently in the database
    def __init__(self, source, url, latestId):
        self.source = source
        self.url = url
        self.feed = feedparser.parse(url)  # Parser of the RSS
        self.latestNewsId = latestId

    # Fetches all new articles on startup
    def getNews(self):
        articles = {}  # Return dict containing all new articles
        try:
            self.feed = feedparser.parse(self.url)
            for article in self.feed.entries:
                id = md5(article["id"].encode("utf-8")).hexdigest() # Create a hex digest which is URL safe of the article URL.
                if id == self.latestNewsId:  # Reached a news article that's already in the database
                    break
                articles[id] = {}
                try:
                    articles[id]["imgUrl"] = article["media_thumbnail"][0]["url"]
                except:  # If no picture attached
                    articles[id]["imgUrl"] = ""
                articles[id]["title"] = article["title"]
                articles[id]["link"] = article["links"][0]["href"]
                articles[id]["content"] = article["summary"]
                articles[id]["published"] = article["published_parsed"]
            self.latestNewsId = self.feed.entries[0]["id"]  # Updates the latest read article
            return articles
        except Exception as e:
            print("Fel vid hämtning av nyheter: ", e)
            return articles

#reader = RssReaderDI("DI", "https://www.di.se/rss", "")
#reader.getNews()
