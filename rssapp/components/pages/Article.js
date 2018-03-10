import React, { Component } from 'react';
import { Text, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { NavigationActions } from 'react-navigation';

class Article extends Component {

  static navigationOptions = {
    // This gets added at the top of the page
    title: 'Article'
  };

  // Calls the backend to perform the logic associated with upvoting an article
  upvote = () => {
    const {id} = this.props.navigation.state.params  // The id of the article

    fetch("http://10.0.3.2:5000/upvote", {
        method: "post",
        headers:{ //
            'Accept': 'text/html, application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          test: "test",
          articleId: id
        })
    })
  }

  render(){
    // Gets the title and content that are sent as parameters
    titleText = this.props.navigation.state.params.title
    contentText = this.props.navigation.state.params.content
    //articleId = this.props.navigation.state.params.id
    //console.log(articleId)
    //console.log(this.props.navigation.state.params)

    return(
      <ScrollView style={styles.container}>
        <Text style={styles.titleText}>
          {titleText}
          <Text style={styles.contentText}>
            {"\n\n"}{contentText}
          </Text>
        </Text>
        <View style={styles.buttonView}>
          <TouchableOpacity style={styles.commentButton}>
            <Text style={styles.buttonText}>Comment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.upvoteButton} onPress = {this.upvote}>
            <Text style={styles.buttonText}>Upvote</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  titleText:{
    fontSize: 22,
    color: "white",
    padding: 10
  },
  contentText:{
    fontSize: 14,
    color: "white",
    padding: 10
  },
  container:{
    paddingVertical: 20,
    backgroundColor: '#2c3e50'
  },
  buttonView:{
    flexDirection: "row",
    padding: 20,
    width: 400
  },
  commentButton:{
      backgroundColor: '#2980b6',
      padding: 20,
      paddingVertical: 15,
      marginRight: 5,
      width: 160
  },
  upvoteButton:{
      backgroundColor: '#00b300',
      padding: 20,
      paddingVertical: 15,
      marginLeft: 5,
      width: 160
  },
  buttonText:{
      color: '#fff',
      textAlign: 'center',
      fontWeight: '700'
  }
});

export default Article;
