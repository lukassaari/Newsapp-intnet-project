import React, { Component } from 'react';
import { Text, ScrollView, StyleSheet, TouchableOpacity, View, TextInput, FlatList } from "react-native";
import { NavigationActions } from 'react-navigation';
import io from 'socket.io-client';
import { List, ListItem, Icon } from 'react-native-elements';
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

    // Calls to the backend (USING SOCKETS) to comment to database
    commentSocket = () => {
      const {id} = this.props.navigation.state.params  // The id of the article
      const {source} = this.props.navigation.state.params  // Source of the article
      const {commentText} = this.state;  // The text of the comment
      this.socket.emit('add_comment', {articleId: id, commentText: commentText, source: source});
      this._textInput.setNativeProps({text: ""});  // Clears the textInput field
    }

    // Upvotes a comment through sockets
    upvoteComment(commentId, uid, articleId){
      this.socket.emit("upvoteComment", {commentId: commentId, uid: uid, articleId: articleId})
    }

    // Calls the backend to perform the logic associated with upvoting an article
    upvoteArticle = () => {
      const {id} = this.props.navigation.state.params  // The id of the article
      const {source} = this.props.navigation.state.params  // The source of the article

      fetch("http://10.0.3.2:5000/upvote", {
          method: "post",
          headers:{
              'Accept': 'text/html, application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            articleId: id,
            source: source
          })
      })
    }

  // Function call to get comments for article from server
  refreshComments = () => {
    this.socket.emit('get_comments', this.id);
  }

  // Routine to update state property with latest comments (this also updates the listview)
  refreshView = (response) => {
    let comments = response;
    this.setState({comments}); // Add comments to the state
  }

  constructor(props) {
    super(props);
    this.state = {
      commentText: '', // New comment text box
      comments: [{username: 'placeholder', commentText: 'pass', pubTime: '33', upvoteCount: '5'}] // Will hold all comments on this article
    };
    this.id = this.props.navigation.state.params.id;  // The id of the article

    // Create a new persistant socket connection with the server
    this.socket = io('http://10.0.3.2:5000', {
        transports: ['websocket'],
        pingTimeout: 30000,
        pingInterval: 10000
    });

      // Listener that fires on connect
    this.socket.on('connect', () => {
      console.log("Connected to socket");
      {this.refreshComments()};
    })

    // Server sends a list of comments
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
  }

  render(){
    // Gets the title and content that are sent as parameters
    titleText = this.props.navigation.state.params.title
    contentText = this.props.navigation.state.params.content
    upvoteIcon = require('../images/upvote_icon.png')

    return(
      <ScrollView style={styles.container}>
        <Text style={styles.titleText}>
          {titleText}
          <Text style={styles.contentText}>
            {"\n\n"}{contentText}
          </Text>
        </Text>
        <View style={styles.buttonView}>
          <TouchableOpacity style={styles.commentButton} onPress = {this.commentSocket}>
            <Text style={styles.buttonText}>Submit Comment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.upvoteButton} onPress = {this.upvoteArticle}>
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
       <List style={styles.listContainer}>{
          <FlatList
            extraData={this.state.comments} // This is the object it watches, if it is recognized as changed the listview will update
            data={this.state.comments}
            keyExtractor={item => item.pubTime}
            renderItem={({item }) => (
              <ListItem
                title={item.username + ":\n" + item.commentText}
                titleNumberOfLines = {10}
                subtitle={"Tid: " + item.pubTime + "\nUpvotes: " + item.upvoteCount}
                subtitleNumberOfLines = {2}  // Subtitle is given two lines of space
                titleStyle={{color: 'white'}}
                subtitleStyle={{color: 'white'}}
                containerStyle={{backgroundColor: '#2c3e50'}}
                rightIcon={
                  <TouchableOpacity style={styles.iconButton} onPress={() => {this.upvoteComment(item.id, item.uid, item.article)}}>
                    <Icon
                      // Icon library: https://oblador.github.io/react-native-vector-icons/
                      name={"thumbs-up"}
                      type={"entypo"}
                      size={40}
                      color={'white'}
                    />
                  </TouchableOpacity>
                }
              />
            )}
          />
        }
        </List>
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
    //paddingVertical: 20,
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
  },
  iconButton:{
      backgroundColor: 'transparent',
      marginLeft: 5,
      width: 40,
      marginBottom: 5,
      height: 40,
      marginTop: 5
  }
});

export default Article;
