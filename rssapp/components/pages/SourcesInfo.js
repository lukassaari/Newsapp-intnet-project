import React, { Component } from 'react';
import { ScrollView, StyleSheet } from "react-native";
import { List, ListItem } from 'react-native-elements';

class SourcesInfo extends Component {

  static navigationOptions = {
    // This gets added at the top of the page
    title: 'Källstatistik'
  };

  render(){
    sourcesInfo = this.props.navigation.state.params["sources"]
    console.log(sourcesInfo)

    return(
      //<Text>Test</Text>

      <ScrollView style={styles.scrollContainer}>
        <List style={styles.listContainer}>
        {
          sourcesInfo.map((source, i) => (
            <ListItem
              key={i}
              title={source.title}
              subtitle={"Upvotes: " + source.upvoteCount + "\nKommentarer: " + source.commentCount + "\nLäsningar: " + source.publicizedCount}
              subtitleNumberOfLines = {3}  // Subtitle is given three lines of space
              titleStyle={{color: 'white'}}
              subtitleStyle={{color: 'white'}}
              containerStyle={{backgroundColor: '#2c3e50'}}
              hideChevron={true}  // Removes the chevron
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
  }
});

export default SourcesInfo;
