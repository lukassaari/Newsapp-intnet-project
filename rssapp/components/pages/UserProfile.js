import React, { Component } from 'react';
import { Text, View, StyleSheet, ImageBackground } from "react-native";
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
          <ImageBackground source={require('../images/Dark_blue_background_squares.png')} style={styles.backgroundImage}>
            <View style={styles.topContainer}>
              <Icon
                style={{textAlign: "center"}}  // NOT CENTERED!!!!!!!!
                type={"font-awesome"}
                name={"user-secret"}
                size={80}
                color={'white'}
                underlayColor={"green"}  // No effect!!!!
              />
              <Text style={styles.titleText}>
                {username}
              </Text>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.contentText}>
            {"\n\n"}Email: {email}
            {"\n\n"}Upvotes mottagna: {upvoteReceivedCount}
            {"\n\n"}Upvotes givna: {upvoteGivenCount}
            {"\n\n"}Kommentarer: {commentCount}
          </Text>
        </View>
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
    height: 150,
  },
  topContainer:{
    paddingVertical: 20
  },
  backgroundImage:{
    flex: 1,
    width: null,
    height: null,
  },
  titleText:{
    fontSize: 28,
    color: "white",
    textAlign: "center",
    fontWeight: "bold"
  },
  contentContainer:{
    marginTop: -20
  },
  contentText:{
    fontSize: 16,
    color: "white",
    padding: 10,
    textAlign: "center"
  }
});

export default UserProfile;
