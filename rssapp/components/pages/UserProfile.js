import React, { Component } from 'react';
import { Text, View, StyleSheet } from "react-native";

class UserProfile extends Component {

  static navigationOptions = {
    // This gets added at the top of the page
    title: 'Profile'
  };

  render(){
    console.log(this.props.navigation.state.params)
    username = this.props.navigation.state.params.username
    email = this.props.navigation.state.params.email
    upvoteCount = this.props.navigation.state.params.upvoteCount
    commentCount = this.props.navigation.state.params.commentCount

    return(
      <View style={styles.container}>
        <Text style={styles.titleText}>
          {username}
          <Text style={styles.contentText}>
            {"\n\n"}Email: {email}
            {"\n\n"}Kommentarer: {commentCount}
            {"\n\n"}Upvotes: {upvoteCount}
          </Text>
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  titleText:{
    fontSize: 24,
    color: "white",
    padding: 10,
    textAlign: "center",
    fontWeight: "bold"
  },
  contentText:{
    fontSize: 16,
    color: "white",
    padding: 10,
    textAlign: "center"
  },
  container:{
    paddingVertical: 20,
    backgroundColor: '#2c3e50',
    flex: 1
  }
});

export default UserProfile;
