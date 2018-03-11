import React, { Component } from 'react';
import { Text, View, StyleSheet } from "react-native";

class UserProfile extends Component {

  static navigationOptions = {
    // This gets added at the top of the page
    title: 'Profile'
  };

  render(){
    return(
      <View style={styles.container}>
        <Text style={styles.titleText}>
          Lukas Saari
          <Text style={styles.contentText}>
            {"\n\n"}Email: lsaari@kth.se
            {"\n"}Upvotes: 10
            {"\n"}Kommentarer: 2
          </Text>
        </Text>
      </View>
    )
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
  }
});

export default UserProfile;
