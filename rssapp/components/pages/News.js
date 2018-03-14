// Template from https://react-native-training.github.io/react-native-elements/docs/0.19.0/lists.html#listitem-implemented-with-custom-view-for-subtitle
import React, { Component } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, Text, View, RefreshControl, FlatList } from "react-native";
import { List, ListItem, Icon } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';

class News extends Component {

  static navigationOptions = {
    // This gets added at the top of the page
    title: 'Newsfeed'
  };

  componentDidMount() {
    // Add listener to willFocus to refresh data when user navigates here
    // Fetches new article data from the server and updates view
    const didBlurSubscription = this.props.navigation.addListener(
      'willFocus', payload => {
        // Fetch new data
        fetch("http://10.0.3.2:5000/news", {
            method: "get",
            headers:{
                'Accept': 'text/html, application/json',
                'Content-Type': 'application/json',
            },
        })
        .then((response) => {
          newData = JSON.parse(response._bodyText)['articles']; // Parse response body to JSON then extract articles key
          this.setState({
            dataSource: newData
          });
        })
      }
    );
  }


  componentWillUnmount() {
    didBlurSubscription.remove();
  }

  // Fetches user profile data and goes to the user profile page
  profile = () => {

    // Calls the backend to get user profile data
    fetch("http://10.0.3.2:5000/getUserInfo", {
        method: "get",
        headers:{
            'Accept': 'text/html, application/json',
            'Content-Type': 'application/json',
        }
    })
    .then((response) => { // Parse the response and then move to next page
        userInfo = JSON.parse(response._bodyText)["userInfo"]
        username = userInfo.username
        email = userInfo.email
        commentCount = userInfo.commentCount
        upvoteGivenCount = userInfo.upvoteGivenCount
        upvoteReceivedCount = userInfo.upvoteReceivedCount

        // Navigates with the data as payload
        this.props.navigation.navigate("UserProfile", {"username": username,
          "email": email, "upvoteGivenCount": upvoteGivenCount,
          "upvoteReceivedCount": upvoteReceivedCount, "commentCount": commentCount}
        )
    })
  }

  // Fetches source info and goes to the source info page
  sources = () => {

    // Calls the backend to get source info
    fetch("http://10.0.3.2:5000/getSourcesInfo", {
        method: "get",
        headers:{
            'Accept': 'text/html, application/json',
            'Content-Type': 'application/json',
        }
    })
    .then((response) => { // Parse the response and then move to next page
        sources = JSON.parse(response._bodyText)["sourcesInfo"]
        this.props.navigation.navigate("SourcesInfo", {"sources": sources})
    })
  }

  // Tells the server the user selected an article so its viewcount gets updated
  updateReadCount = (id) => {
    // Calls the backend with article id in its route
    fetch("http://10.0.3.2:5000/articles/" + id + "/read-count", {
        method: "put",
        headers:{
            'Accept': 'text/html, application/json',
            'Content-Type': 'application/json',
        }
    })
  }

  // Sorts the newsfeed by the specified parameter "type"
  sortNews(articles, type){
    sorted = articles.sort(function(a,b){  // Sorting the array
      if (type === "upvote"){  // Sorting by upvotes
        return b.upvoteCount < a.upvoteCount ? -1
             : b.upvoteCount > a.upvoteCount ? 1
             : 0
      } else if (type === "comment") {  // Sorting by comments
        return b.commentCount < a.commentCount ? -1
             : b.commentCount > a.commentCount ? 1
             : 0
      } else if (type === "time"){  // Sorting by publication time
        return b.pubTime < a.pubTime ? -1
             : b.pubTime > a.pubTime ? 1
             : 0
      } else {
        console.log("Fel i sortNews(), ingen giltig typ hittades")
      }
    })
    this.setState({  // Updats data source with the sorted array
      dataSource: sorted
    })
  }

  constructor(props){
    super(props);
    articles = JSON.parse(this.props.navigation.state.params.news._bodyInit)["articles"];  // Array of articles stored in dicts
    this.state = {
      dataSource: articles,
      refreshing: false,
    };
  }

  render(){
    const{navigate} = this.props.navigation;
    return(
      <View style={styles.menu}>
      <View style={styles.topMenuView}>
        <View style={styles.buttonView}>
          <TouchableOpacity style={styles.iconButton} onPress = {this.profile}>
            <Icon
              name={"user"}
              type={"entypo"}
              size={37}
              color={'white'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress = {this.sources}>
            <Icon
              name={"bar-graph"}
              type={"entypo"}
              size={40}
              color={'white'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.sortView}>
          <Text style={styles.buttonText}>   Sortera efter:</Text>
          <View style={styles.sortAltView}>
            <TouchableOpacity style={styles.sortButton} onPress = {() => {this.sortNews(articles, "time")}}>
              <Text style={styles.buttonText}>Senast</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sortButton} onPress = {() => {this.sortNews(articles, "upvote")}}>
              <Text style={styles.buttonText}>Upvotes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.largerSortButton} onPress = {() => {this.sortNews(articles, "comment")}}>
              <Text style={styles.buttonText}>Kommentarer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ScrollView>
        <View style={styles.scrollContainer}>
          <List style={styles.listContainer}>
            <FlatList
              extraData={this.state.dataSource} // This is the object it watches, if it is recognized as changed the listview will update
              data={this.state.dataSource}
              keyExtractor={item => item.pubTime}
              renderItem={({item }) => (
                <ListItem
                  title={item.title}
                  subtitle={"Publicerad: " + item.pubTime + "\nUpvotes: " + item.upvoteCount
                            + " || Kommentarer: " + item.commentCount + " || Källa: " + item.source}
                  subtitleNumberOfLines = {2}  // Subtitle is given two lines of space
                  titleStyle={{color: 'white'}}
                  subtitleStyle={{color: 'white'}}
                  containerStyle={{backgroundColor: '#2c3e50'}}

                  // When the article is pressed, move the user to the article specific page and display the article
                  onPress={() => {
                    {this.updateReadCount(item.id)};
                    this.props.navigation.navigate("Article", {title: item.title, content: item.content, id: item.id, source: item.source})}}
                />
              )}
            />
          </List>
        </View>
      </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  menu:{
    backgroundColor: '#19334d',
  },
  scrollContainer:{
    backgroundColor: '#2c3e50',
    marginTop: -20,  // Removes whitespace above the top article
    marginBottom: 50  // Just enough to ensure bottom article is showed
  },
  listContainer:{
    marginTop: 5,
    paddingVertical: 5,
  },
  buttonText:{
      color: '#fff',
      textAlign: 'center',
      fontWeight: '700'
  },
  profileButton:{
      backgroundColor: '#2980b6',
      marginRight: 5,
      width: 40,
      marginBottom: 5,
      height: 40
  },
  iconButton:{
      backgroundColor: 'transparent',
      marginLeft: 5,
      width: 40,
      marginBottom: 5,
      height: 40,
      marginTop: 5
  },
  sortButton:{
      backgroundColor: '#2980b6',
      marginLeft: 5,
      width: 80,
      marginBottom: 5,
      height: 20
  },
  largerSortButton:{
      backgroundColor: '#2980b6',
      marginLeft: 5,
      width: 90,
      marginBottom: 5,
      height: 20
  },
  topMenuView:{
    flexDirection: "row",
  },
  buttonView:{
    flexDirection: "row",
  },
  sortView:{
    flexDirection: "column",
    width: 255,
    marginTop: 5
  },
  sortAltView:{
    flexDirection: "row",
  }
});

export default News;
