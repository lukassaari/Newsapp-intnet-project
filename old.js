import React from 'react';
import { View, ListView, StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
});

class News extends React.Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(['row 1', 'row 2']),
    };
  }
  render() {
    return (
      <ListView
        style={styles.container}
        dataSource={this.state.dataSource}
        renderRow={(data) => <View><Text>{data}</Text></View>}
      />
    );
  }
}

export default News;


// Template from https://react-native-training.github.io/react-native-elements/docs/0.19.0/lists.html#listitem-implemented-with-custom-view-for-subtitle
/*import React, { Component } from 'react';
import { List, ListItem, ListView } from 'react-native'

class News extends Component {
  /*render(){
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
    )
  }*/
  /*constructor(props){
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(['row 1', 'row 2']),
    };
  }

  renderRow (rowData, sectionID) {
    return (
      <ListItem
        //roundAvatar
        key={sectionID}
        title={rowData.name}
        subtitle={rowData.subtitle}
        //avatar={{uri:rowData.avatar_url}}
      />
    )
  }

  render () {
    return (
      <List>
        <ListView
          renderRow={this.renderRow}
          dataSource={this.state.dataSource}
        />
      </List>
    )
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
*/
