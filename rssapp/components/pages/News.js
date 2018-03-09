// Template from https://react-native-training.github.io/react-native-elements/docs/0.19.0/lists.html#listitem-implemented-with-custom-view-for-subtitle
import React, { Component } from 'react';
import { List, ListItem } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';

class News extends Component {

  static navigationOptions = {
    // This gets added at the top of the page
    title: 'Newsfeed'
  };

  render(){
    //console.log(JSON.parse(this.props.navigation.state.params.news._bodyInit)["articles"])
    articles = JSON.parse(this.props.navigation.state.params.news._bodyInit)["articles"]  // Array of articles stored in dicts
    return(
      <List containerStyle={{marginBottom: 20}}>
      {
        articles.map((article, i) => (
          <ListItem
            key={i}
            title={article.title}
            subtitle={"Publicerad: " + article.pubTime + "\nUpvotes: " + article.upvoteCount
                      + " Kommentarer: " + article.commentCount}
            subtitleNumberOfLines = {2}  // Subtitle is given two lines of space
            onPress = {()=> {console.log(article.title)}}  // När man klickar på knappen skrivs titeln ut, FUNKAR!!!
            //onPress={()=>this._onPressSingleRequest(console.log(article.title))}
            // on press single request https://github.com/facebook/react-native/issues/3619
          />
        ))
        /*
        // GAMMAL KOD
        list.map((l, i) => (
          <ListItem
            //roundAvatar
            //avatar={{uri:l.avatar_url}}
            key={i}
            title={l.name}
            subtitle={l.subtitle}
          />
        ))*/
      }
      </List>
    );
  }
}
/*
// GAMMAL KOD
const list = [
  {
    name: 'Ericsson Kvartalsrapport Q1',
    //avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'Tillagd för 36min sedan || 18 upvotes || 4 kommentarer'
  },
  {
    name: 'Fingerprint vinstvarnar igen!',
    //avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'Tillagd för 2h sedan || 54 upvotes || 511 kommentarer'
  },
  {
    name: 'Bitcoin RAAASAR',
    //avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'Tillagd för 3h sedan || 32 upvotes || 312 kommentarer'
  },
]
*/

export default News;
