# intnet18-projekt
A news app that reads the RSS feeds of different news sources and displays the fetched news stories to the user. The user is able to upvote articles, comment articles, and read the comments other users have made. News stories can be sorted according to time, number of upvotes, or number of comments. Statistics over the frequency and popularity of the used news sources is also tracked and can be displayed in the app.

Login screen:               Newsfeed screen:              Article screen:           Statistics screen:
INSERT SCREENSHOTS AFTER DESIGN IS DONE

Backend (Python with Flask):
  - RssReaderCision.py: Fetches news from Cision's RSS
  - RssReaderDI.py: Fetches news from DI's RSS
  - Controller.py: Handles all routing and socket events
  - Model.py: Creates instances of the RSS Readers, establishes the database connection, and supplies logic for the Controller
  - dbTables.sql: Creates the tables of the database and inserts two initial users as well as the used news sources


Frontend (React Native) - Images used are stored in components/images and pages to be rendered are stored in components/pages. Description of the pages:
  - Login.js: Gives the user the options to either create a new account or login using an existing account
  - CreateAccount.js: For creating a new account, checks to make sure the username is unique
  - News.js: Displays a list of news titles that are clickable to move to a page displaying the whole story, presents options to go to the profile page and the source statistics page, and options to sort news stories by time, number of upvotes, or number of comments
  - Article.js: Displays the whole news article, gives options to comment and upvote it, and to read and upvote comments other users have made
  - UserProfile.js: Displays the username and statistics about their usage of the app
  - SourcesInfo.js: Displays the news sources that news are fetched from, and statistics about their frequency and popularity in the app
