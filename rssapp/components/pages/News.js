// Template from https://react-native-training.github.io/react-native-elements/docs/0.19.0/lists.html#listitem-implemented-with-custom-view-for-subtitle
import React, { Component } from 'react';
import { ScrollView, StyleSheet } from "react-native";
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

  /*
  newsNavigation() {
    console.log(this.article)
    const{test} = this.props;
    console.log(test)
    console.log(article)
    NavigationActions.navigate({routeName: "Article", params: {title: article.title, content: article.content, id: article.id}})
  }
  */

  render(){
    const{navigate} = this.props.navigation;
    articles = JSON.parse(this.props.navigation.state.params.news._bodyInit)["articles"]  // Array of articles stored in dicts
    return(
      <ScrollView style={styles.scrollContainer}>
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
  }
});

export default News;
