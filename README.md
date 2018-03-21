# intnet18-projekt
A news app that reads the RSS feeds of different news sources and displays the fetched news stories to the user. The user is able to upvote articles, comment articles, and read the comments other users have made. News stories can be sorted according to time, number of upvotes, or number of comments. Statistics over the frequency and popularity of the used news sources is also tracked and can be displayed in the app.

| Login screen  | Newsfeed screen | Article Screen |
| ------------- | ------------- | -------------- |
| <img src="https://github.com/lukassaari/Newsapp-intnet-project/blob/master/ProjectScreenshots/Login.PNG" width="300"> | <img src="https://github.com/lukassaari/Newsapp-intnet-project/blob/master/ProjectScreenshots/Newsfeed.PNG" width="300">  | <img src="https://github.com/lukassaari/Newsapp-intnet-project/blob/master/ProjectScreenshots/Article.PNG" width="300">|


## Backend (Python with Flask):
  - RssReaderCision.py: Fetches news from Cision's RSS
  - RssReaderDI.py: Fetches news from DI's RSS
  - Controller.py: Handles all routing and socket events
  - Model.py: Creates instances of the RSS Readers, establishes the database connection, and supplies logic for the Controller
  - dbTables.sql: Creates the tables of the database and inserts two initial users as well as the used news sources


## Frontend (React Native)
#### Images used are stored in components/images and pages to be rendered are stored in components/pages. Description of the pages:
  - Login.js: Gives the user the options to either create a new account or login using an existing account
  - CreateAccount.js: For creating a new account, checks to make sure the username is unique
  - News.js: Displays a list of news titles that are clickable to move to a page displaying the whole story, presents options to go to the profile page and the source statistics page, and options to sort news stories by time, number of upvotes, or number of comments
  - Article.js: Displays the whole news article, gives options to comment and upvote it, and to read and upvote comments other users have made
  - UserProfile.js: Displays the username and statistics about their usage of the app
  - SourcesInfo.js: Displays the news sources that news are fetched from, and statistics about their frequency and popularity in the app

## Installation

Software has only been tested on a Windows 10 installation. Clone the repo.

#### 1. npm version downgrade and installing dependancies for npm

npm is assumed to be installed, otherwise go to [npm](https://www.npmjs.com/get-npm) to install it.

React-native requires npm version 4, so run the following command to install the required version.

```bash
$ npm install -g npm@4
```

With the correct npm version, navigate to `/rssapp`.

In the terminal, run the following command to install all dependancies

```bash
$ npm install
```


#### 2. Setting up the mobile phone / emulator

To run the react-native project, you first need to set up a device that can run it. Because of limititations by Apple not allowing `http` an android phone or android emulator is needed. If an Android phone is available, download the Expo app to it.

If an emulator is to be used instead, download e.g. [genymotion](https://www.genymotion.com/fun-zone/), install it and then add a new virtual device (we suggest Google Nexus 5, Android 5.1.0, 1920x1080). Start the virtual device.

#### 3. Prepare the database

*A MySQL installation is assumed*. Navigate to `\Backend` and execute `dbTables.sql` in either MySQL-cli or workbench to load the neccessary tables.

#### 4. Starting the server

Navigate to `/Backend` and run

```bash
$ pip install -r requirements
```

```bash
$ py Controller.py
```

The server will start by loading in the articles to the database and then listen to port 5000 for incoming connections.

#### 5. Running the software

Ensure you have a running emulator of an Android phone. Navigate to `/rssapp`.

```bash
$ npm start
```

Wait for a barcode to be displayed. Then do one of 5.1 or 5.2.

##### 5.1 Using a phone

Start the expo app and scan the barcode that is displayed in the terminal running the application

##### 5.2 Using an emulator

Press `a` in the terminal and the emulator will load the react-native app.

#### 6. Play around

Create your own account details or use the pre-existing username: 'e', password: 'e' to enter the app and start playing around.
