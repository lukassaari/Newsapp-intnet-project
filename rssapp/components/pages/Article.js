import React, { Component } from 'react';
import { Text, ScrollView, StyleSheet, TouchableOpacity, View, TextInput, List, ListItem } from "react-native";
import { NavigationActions } from 'react-navigation';

/*
*   Describes the view for a single article
*   An article has a text and comments that can be read
*   Comments may be added and are dynamically updated via Sockets
*/
class Article extends Component {

  static navigationOptions = {
    // This gets added at the top of the page
    title: 'Article'
  };

  // Submits comment to database and updates page through websocket
  comment = () => {
    const {id} = this.props.navigation.state.params  // The id of the article
    const {commentText} = this.state;  // The text of the comment

    // Calls the backend to submit comment to database
    fetch("http://10.0.3.2:5000/comment", {
        method: "post",
        headers:{
            'Accept': 'text/html, application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleId: id,
          commentText: commentText
        })
    })
    this._textInput.setNativeProps({text: ""});  // Clears the textInput field
  }

  // Calls the backend to perform the logic associated with upvoting an article
  upvote = () => {
    const {id} = this.props.navigation.state.params  // The id of the article

    fetch("http://10.0.3.2:5000/upvote", {
        method: "post",
        headers:{
            'Accept': 'text/html, application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleId: id
        })
    })
  }

  refreshComments = () => {
    // Fetch comments for this article id. 
    // Update the view

  }

  constructor(props) {
    super(props);
    this.state = {commentText: ''};  // State that gets updated on user input
    this.id = this.props.navigation.state.params.id  // The id of the article

    this.socket = io('http://10.0.3.2:5001', { // According to some SO thread.
        transports: ['websocket'],
        pingTimeout: 30000,
        pingInterval: 10000
    });

      // Listener that fires on connect
    this.socket.on('connect', () => {
      console.log("Connected to socket");
    })

    // // Listener if new comments for this article id are discovered for this article
    let commentEvent = "new_comments_" + this.id;
    this.socket.on(commentEvent, () => {
    //   // Refresh comments
    })

    // On connect error
    this.socket.on('connect_error', (err) => {
        console.log(err)
    })

      // Disconnect socket when leaving screen
    const didBlurSubscription = this.props.navigation.addListener(
      'didBlur', payload => {
        this.socket.disconnect()
      }
    );    
  }

  render(){
    // Gets the title and content that are sent as parameters
    titleText = this.props.navigation.state.params.title
    contentText = this.props.navigation.state.params.content

    return(
      <ScrollView style={styles.container}>
        <Text style={styles.titleText}>
          {titleText}
          <Text style={styles.contentText}>
            {"\n\n"}{contentText}
          </Text>
        </Text>
        <View style={styles.buttonView}>
          <TouchableOpacity style={styles.commentButton} onPress = {this.comment}>
            <Text style={styles.buttonText}>Submit Comment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.upvoteButton} onPress = {this.upvote}>
            <Text style={styles.buttonText}>Upvote</Text>
          </TouchableOpacity>
        </View>
        <TextInput style = {styles.textInput}
          ref = {component => this._textInput = component}  // Reference to this component
          editable = {true}
          maxLength = {200}
          multiline = {true}
          numberOfLines = {4}
          underlineColorAndroid = {"transparent"}
          onChangeText={(commentText) => this.setState({commentText})}  // Updates the commentText variable
          placeholder = "Write your comment here..."
        />
      </ScrollView>

        // <List style={styles.listContainer}>
        // {
        //   // Iterates over the comments and displays them
        //   comments.map((comment, i) => (
        //     <ListItem
        //       key={i}
        //       title={comment.username + ": " + comment.content}
        //       subtitle={"Vid" + comment.pubTime + "\nUpvotes: " + comment.upvoteCount}
        //       subtitleNumberOfLines = {2}  // Subtitle is given two lines of space
        //       titleStyle={{color: 'white'}}
        //       subtitleStyle={{color: 'white'}}
        //       containerStyle={{backgroundColor: '#2c3e50'}}
        //     />
        //   ))
        // }
        // </List>
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
  },
  textInput:{
      backgroundColor: 'white',
      borderRadius: 10,
      margin: 10,
      padding: 10
  },
  listContainer:{
    //backgroundColor: '#2c3e50',
    marginBottom: 20
  }
});

export default Article;
