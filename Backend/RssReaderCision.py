import feedparser
from time import mktime
from datetime import datetime

# Reading and returning a dict of all new articles from: http://news.cision.com/se/ListItems?format=rss
class RssReaderCision:

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
                id = article["id"]
                if id == self.latestNewsId:  # Reached a news article that's already in the database
                    break
                articles[id] = {}
                articles[id]["title"] = article["title"]
                articles[id]["content"] = article["summary"]
                articles[id]["published"] = datetime.fromtimestamp(mktime(article["published_parsed"]))  # Converts to datetime
                articles[id]["link"] = article["link"]
            self.latestNewsId = self.feed.entries[0]["id"]  # Updates the latest read article
            #print(articles)
            return articles
        except Exception as e:
            print("Fel vid hämtning av nyheter: ", e)
            #print(articles)
            return articles

#reader = RssReader("Cision", "http://news.cision.com/se/ListItems?format=rss", "cision2843086")
#reader.getNews()
