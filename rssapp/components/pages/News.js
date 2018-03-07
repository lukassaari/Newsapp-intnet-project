// Template from https://react-native-training.github.io/react-native-elements/docs/0.19.0/lists.html#listitem-implemented-with-custom-view-for-subtitle
import React, { Component } from 'react';
import { List, ListItem } from 'react-native-elements';

class News extends Component {
  render(){
    return(
      <List containerStyle={{marginBottom: 20}}>
      {
        list.map((l, i) => (
          <ListItem
            //roundAvatar
            //avatar={{uri:l.avatar_url}}
            key={i}
            title={l.name}
            subtitle={l.subtitle}
          />
        ))
      }
      </List>
    );
  }
}

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

export default News;
