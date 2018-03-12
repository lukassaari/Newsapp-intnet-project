import React, { Component } from 'react';
import { ScrollView, StyleSheet, Image } from "react-native";
import { List, ListItem } from 'react-native-elements';

class SourcesInfo extends Component {

  static navigationOptions = {
    // This gets added at the top of the page
    title: 'Källstatistik'
  };

  render(){
    sourcesInfo = this.props.navigation.state.params["sources"]
    images = [require('../images/cision_logo.png'), require('../images/DI_logo.png')]  // Logos for news sources
    return(
      <ScrollView style={styles.scrollContainer}>
        <List style={styles.listContainer}>
        {
          sourcesInfo.map((source, i) => (
            <ListItem
              key={i}
              title={source.title}
              subtitle={"Upvotes: " + source.upvoteCount + "\nKommentarer: " + source.commentCount + "\nLäsningar: " + source.publicizedCount}
              subtitleNumberOfLines = {3}  // Subtitle is given three lines of space
              titleStyle={{color: 'white', fontSize: 24}}
              subtitleStyle={{color: 'white', fontSize: 16}}
              containerStyle={{backgroundColor: '#2c3e50'}}
              hideChevron={true}  // Removes the chevronss
              roundAvatar
              avatar={images[i]}
              avatarStyle={{width: 100, height:100}}
              avatarContainerStyle={{width: 100, height:100}}
              avatarOverlayContainerStyle={{width: 100, height:100}}
            />
          ))
        }
        </List>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollContainer:{
    paddingVertical: 20,
    backgroundColor: '#2c3e50'
  },
  listContainer:{
    //backgroundColor: '#2c3e50',
    marginBottom: 20,
  },
  logo: {
      position: 'absolute',
      width: 100,
      height: 50
  }
});

export default SourcesInfo;
