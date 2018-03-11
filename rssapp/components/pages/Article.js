import React, { Component } from 'react';
import { Text, ScrollView, StyleSheet, TouchableOpacity, View, TextInput, List, ListItem, FlatList } from "react-native";
import { NavigationActions } from 'react-navigation';
import io from 'socket.io-client';
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
    this.socket.emit('get_comments', this.id);
  }

  refreshView = (response) => {
    this.state.comments = response; // Add comments to the state
  }

  constructor(props) {
    super(props);
    this.state = {
      commentText: '', // New comment text box
      comments: [{username: 'placeholder', content: 'pass', pubTime: '33', upvoteCount: 5}] // Will hold all comments on this article
    };  
    this.id = this.props.navigation.state.params.id;  // The id of the article
    console.log(this.state.comments);
    // Create a new persistant socket connection with the server
    this.socket = io('http://10.0.3.2:5001', {
        transports: ['websocket'],
        pingTimeout: 30000,
        pingInterval: 10000
    });

      // Listener that fires on connect
    this.socket.on('connect', () => {
      console.log("Connected to socket");
      {this.refreshComments()};
    })

    // Listener if new comments for this article id are discovered
    let commentEvent = "new_comments_" + this.id;
    this.socket.on(commentEvent, (response) => {
      // Update the view
      console.log("New comments have been outputted!");
      console.log(response);
    })

    // Server sends comments for the first time
    this.socket.on('comments', (response) => {
        {this.refreshView(response)};
    })

    // On connect error
    this.socket.on('connect_error', (err) => {
        console.log('Error happened');
        console.log(err);
    })

      // Disconnect socket when leaving screen
    const didBlurSubscription = this.props.navigation.addListener(
      'didBlur', payload => {
        this.socket.disconnect()
      }
    );

    // Eventhandler for focus
    const willFocusSubscription = this.props.navigation.addListener(
      'willFocus', payload => {
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
    );
  }
}

        // <List style={styles.listContainer}>{
          // Iterates over the comments and displays them
          //this.state.comments.map((comment, i) => (
            // <ListItem
              // key='1'
              // title={this.state.comments[0].username + ": " + this.state.comments[0].content}
              // subtitle={"Vid" + this.state.comments[0].pubTime + "\nUpvotes: " + this.state.comments[0].upvoteCount}
              // subtitleNumberOfLines = {2}  // Subtitle is given two lines of space
              // titleStyle={{color: 'white'}}
              // subtitleStyle={{color: 'white'}}
              // containerStyle={{backgroundColor: '#2c3e50'}}
            // />
          //))
        // }
        // </List>

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
