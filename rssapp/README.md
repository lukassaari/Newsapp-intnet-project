This project was bootstrapped with [Create React Native App](https://github.com/react-community/create-react-native-app).

Backend:
  - RssReaderCision.py: Fetches news from Cision's RSS
  - RssReaderDI.py: Fetches news from DI's RSS
  - Controller.py: Handles all routing and socket events
  - Model.py: Creates instances of the RSS Readers, establishes the database connection, and supplies logic for the Controller
  - dbTables.sql: Creates the tables of the database and inserts two initial users as well as the used news sources


Frontend - Images used are stored in components/images and pages to be rendered are stored in components/pages. Description of the pages:
  - Login.js: Gives the user the options to either create a new account or login using an existing account
  - CreateAccount.js: For creating a new account, checks to make sure the username is unique
  - News.js: Displays a list of news titles that are clickable to move to a page displaying the whole story, presents options to go to the profile page and the source statistics page, and options to sort news stories by time, number of upvotes, or number of comments
  - Article.js: Displays the whole news article, gives options to comment and upvote it, and to read and upvote comments other users have made
  - UserProfile.js: Displays the username and statistics about their usage of the app
  - SourcesInfo.js: Displays the news sources that news are fetched from, and statistics about their frequency and popularity in the app
