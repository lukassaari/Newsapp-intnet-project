// Template from https://react-native-training.github.io/react-native-elements/docs/0.19.0/lists.html#listitem-implemented-with-custom-view-for-subtitle
import React, { Component } from 'react';
import { ScrollView } from "react-native";
import { List, ListItem } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';

class News extends Component {

  static navigationOptions = {
    // This gets added at the top of the page
    title: 'Newsfeed'
  };

  render(){
    const{navigate} = this.props.navigation;
    articles = JSON.parse(this.props.navigation.state.params.news._bodyInit)["articles"]  // Array of articles stored in dicts
    return(
      <ScrollView contentContainerStyle={{paddingVertical: 20}}>
        <List containerStyle={{marginBottom: 20}}>
        {
          // Iterates over the articles and displays them
          articles.map((article, i) => (
            <ListItem
              key={i}
              title={article.title}
              subtitle={"Publicerad: " + article.pubTime + "\nUpvotes: " + article.upvoteCount
                        + " Kommentarer: " + article.commentCount}
              subtitleNumberOfLines = {2}  // Subtitle is given two lines of space

              // When the article is pressed, move the user to the article specific page and display the article
              onPress={() => navigate("Article", {title: article.title, content: article.content})}
            />
          ))
        }
        </List>
      </ScrollView>
    );
  }
}

export default News;
