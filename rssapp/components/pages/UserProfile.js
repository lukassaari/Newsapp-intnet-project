import React, { Component } from 'react';
import { Text, View, StyleSheet, Image } from "react-native";
import { Icon } from 'react-native-elements';

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
        <View style={styles.topPart}>
          <Image source={require('../images/Dark_blue_background_squares.png')} style={styles.backgroundImage} />
        </View>
        <Text style={styles.contentText}>
          {"\n\n"}Email: {email}
          {"\n\n"}Upvotes mottagna: {upvoteReceivedCount}
          {"\n\n"}Upvotes givna: {upvoteGivenCount}
          {"\n\n"}Kommentarer: {commentCount}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container:{
    backgroundColor: '#2c3e50',
    flex: 1
  },
  topPart:{
    backgroundColor: '#2980b6',
    paddingVertical: 20,
    height: 100
    //marginTop: 20
  },
  backgroundImage:{
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  },
  titleText:{
    fontSize: 28,
    color: "white",
    //padding: 10,
    textAlign: "center",
    fontWeight: "bold"
  },
  contentText:{
    fontSize: 16,
    color: "white",
    padding: 10,
    textAlign: "center"
  }
});

export default UserProfile;
