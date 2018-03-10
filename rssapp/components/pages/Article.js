import React, { Component } from 'react';
import { Text, ScrollView } from "react-native";
import { NavigationActions } from 'react-navigation';

class Article extends Component {

  static navigationOptions = {
    // This gets added at the top of the page
    title: 'Article'
  };

  render(){
    // Gets the title and content that are sent as parameters
    titleText = this.props.navigation.state.params.title
    contentText = this.props.navigation.state.params.content

    return(
      <ScrollView contentContainerStyle={{paddingVertical: 20}}>
        <Text style={{fontSize: 22}}>
          {titleText}
          <Text style={{fontSize: 14}}>
            {"\n\n"}{contentText}
          </Text>
        </Text>
      </ScrollView>
    );
  }
}

export default Article;
