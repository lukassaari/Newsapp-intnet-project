// Template from https://react-native-training.github.io/react-native-elements/docs/0.19.0/lists.html#listitem-implemented-with-custom-view-for-subtitle
import React, { Component } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, Text, View, ListView } from "react-native";
import { List, ListItem } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';

// Data source used for listing articles in the newsfeed
let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 } );

class News extends Component {

  static navigationOptions = {
    // This gets added at the top of the page
    title: 'Newsfeed'
  };

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
        this.props.navigation.navigate("SourcesInfo", {"sources": sources})
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
      dataSource: ds.cloneWithRows(sorted)
    })
  }

  // Renders all the news articles
  _renderRow(rowData){
    return (
      <ListItem
        title={rowData.title}
        subtitle={"Publicerad: " + rowData.pubTime + "\nUpvotes: " + rowData.upvoteCount
                  + " || Kommentarer: " + rowData.commentCount + " || Källa: " + rowData.source}
        subtitleNumberOfLines = {2}  // Subtitle is given two lines of space
        titleStyle={{color: 'white'}}
        subtitleStyle={{color: 'white'}}
        containerStyle={{backgroundColor: '#2c3e50'}}

        // When the article is pressed, move the user to the article specific page and display the article
        onPress={() => this.props.navigation.navigate("Article", {title: rowData.title, content: rowData.content, id: rowData.id, source: rowData.source})}
      />
    );
  }

  constructor(props){
    super(props);
    articles = JSON.parse(this.props.navigation.state.params.news._bodyInit)["articles"];  // Array of articles stored in dicts
    this.state = {dataSource: ds.cloneWithRows(articles)};
  }

  render(){
    const{navigate} = this.props.navigation;
    return(
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.topMenuView}>
          <View style={styles.buttonView}>
            <TouchableOpacity style={styles.profileButton} onPress = {this.profile}>
              <Text style={styles.buttonText}>Profil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileButton} onPress = {this.sources}>
              <Text style={styles.buttonText}>Källstatistik</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sortView}>
            <Text style={styles.buttonText}>Sortera efter:</Text>
            <View style={styles.sortAltView}>
              <TouchableOpacity style={styles.sortButton} onPress = {() => {this.sortNews(articles, "time")}}>
                <Text style={styles.buttonText}>Senast</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sortButton} onPress = {() => {this.sortNews(articles, "upvote")}}>
                <Text style={styles.buttonText}>Upvotes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.sortButton} onPress = {() => {this.sortNews(articles, "comment")}}>
                <Text style={styles.buttonText}>Kommentarer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <List style={styles.listContainer}>
          <ListView
            dataSource = {this.state.dataSource}  // Fills the data source with the articles
            renderRow={this._renderRow.bind(this)}  // Renders the articles
          />
        </List>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollContainer:{
    //paddingVertical: 20,
    backgroundColor: '#2c3e50'
  },
  listContainer:{
    //backgroundColor: '#2c3e50',
    //marginBottom: 100,
    //marginTop: 100
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
      //marginLeft: 5,
      marginRight: 5,
      width: 90,
      marginBottom: 5,
      height: 20
  },
  sortButton:{
      backgroundColor: '#2980b6',
      //padding: 5,
      //paddingVertical: 15,
      marginLeft: 5,
      //marginRight: 5,
      width: 80,
      marginBottom: 5,
      height: 20
  },
  topMenuView:{
    //flex: 1,
    flexDirection: "row",
    //width: 150
  },
  buttonView:{
    //flex: 1,
    flexDirection: "column",
    //width: 150
  },
  sortView:{
    //flex: 1,
    flexDirection: "column",
    width: 255
  },
  sortAltView:{
    //flex: 1,
    flexDirection: "row",
    //width: 150
  }
});

export default News;
