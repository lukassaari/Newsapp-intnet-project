// Template from https://react-native-training.github.io/react-native-elements/docs/0.19.0/lists.html#listitem-implemented-with-custom-view-for-subtitle
import React, { Component } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { List, ListItem } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';

class News extends Component {

  static navigationOptions = {
    // This gets added at the top of the page
    title: 'Newsfeed'
  };

  /*
  constructor(props){
    super(props);
    //this.state = {articleId: 9999};
    //this.newsNavigation = this.newsNavigation.bind(this);
  }*/

  /*
  // Fetches comments for the article
  getComments = () => {
    fetch("http://10.0.3.2:5000/getComments", {
        method: "get",
        headers:{
            'Accept': 'text/html, application/json',
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({
          articleId: "artikel id test"
        })
    })
    .then((response) => {
      console.log(response)
      //return response
    })
  }*/

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
        upvoteCount = userInfo.upvoteCount

        this.props.navigation.navigate("UserProfile", {"username": username,
          "email": email, "upvoteCount": upvoteCount, "commentCount": commentCount}
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
        console.log(sources)
        this.props.navigation.navigate("SourcesInfo", {"sources": sources})
    })
  }

  render(){
    const{navigate} = this.props.navigation;
    articles = JSON.parse(this.props.navigation.state.params.news._bodyInit)["articles"]  // Array of articles stored in dicts
    return(
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.buttonView}>
          <TouchableOpacity style={styles.profileButton} onPress = {this.profile}>
            <Text style={styles.buttonText}>Profil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton} onPress = {this.sources}>
            <Text style={styles.buttonText}>Källstatistik</Text>
          </TouchableOpacity>
        </View>
        <List style={styles.listContainer}>
        {
          // Iterates over the articles and displays them
          articles.map((article, i) => (
            <ListItem
              key={i}
              title={article.title}
              subtitle={"Publicerad: " + article.pubTime + "\nUpvotes: " + article.upvoteCount
                        + " Kommentarer: " + article.commentCount}
              subtitleNumberOfLines = {2}  // Subtitle is given two lines of space
              titleStyle={{color: 'white'}}
              subtitleStyle={{color: 'white'}}
              containerStyle={{backgroundColor: '#2c3e50'}}

              // When the article is pressed, move the user to the article specific page and display the article
              onPress={() => navigate("Article", {title: article.title, content: article.content, id: article.id})}
              //onPress = {
                //article.id => this.setState(articleId)
              //  this.getComments
              //}
            />
          ))
        }
        </List>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollContainer:{
    paddingVertical: 20,
    backgroundColor: '#2c3e50'
  },
  listContainer:{
    //backgroundColor: '#2c3e50',
    marginBottom: 20
  },
  buttonText:{
      color: '#fff',
      textAlign: 'center',
      fontWeight: '700'
  },
  profileButton:{
      backgroundColor: '#2980b6',
      //padding: 5,
      //paddingVertical: 15,
      marginLeft: 5,
      marginRight: 5,
      width: 100
      //height: 60,

  },
  buttonView:{
    flexDirection: "row",
    width: 150
  }
});

export default News;
