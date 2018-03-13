import React, { Component } from 'react';
import { Text, View, StyleSheet } from "react-native";

class UserProfile extends Component {

  static navigationOptions = {
    // This gets added at the top of the page
    title: 'Profile'
  };

  render(){
    username = this.props.navigation.state.params.username
    email = this.props.navigation.state.params.email
    upvoteGivenCount = this.props.navigation.state.params.upvoteGivenCount
    upvoteReceivedCount = this.props.navigation.state.params.upvoteReceivedCount
    commentCount = this.props.navigation.state.params.commentCount

    return(
      <View style={styles.container}>
        <Text style={styles.titleText}>
          {username}
          <Text style={styles.contentText}>
            {"\n\n"}Email: {email}
            {"\n\n"}Upvotes mottagna: {upvoteReceivedCount}
            {"\n\n"}Upvotes givna: {upvoteGivenCount}
            {"\n\n"}Kommentarer: {commentCount}
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
