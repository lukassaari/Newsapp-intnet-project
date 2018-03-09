import React, { Component } from 'react';
import { Text } from "react-native";
import { NavigationActions } from 'react-navigation';

class Article extends Component {

  static navigationOptions = {
    // This gets added at the top of the page
    title: 'Article'
  };
  /*
  constructor(props) {
    super(props);
    this.state = {
      titleText: "Title",
      contentText: 'Conent'
    };
  }
  */

  render(){
    //console.log(JSON.parse(this.props.navigation.state.params))
    titleText = this.props.navigation.state.params.title
    contentText = this.props.navigation.state.params.content
    console.log(titleText)

    return(
      <Text style={{fontSize: 30}}>
        {titleText}
        <Text style={{fontSize: 18}}>
          {"\n"}{contentText}
        </Text>
      </Text>

    );
  }
}

export default Article;
