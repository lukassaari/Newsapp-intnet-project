import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <Text>Changes you make will automatically reload.</Text>
        <Text>Shake your phone to open the developer menu.</Text>
        <Text>FUUUUUNKAR YEEEES</Text>
        <Button title="Logga in"/>
      </View>
    );
  }
}

class Button extends React.Component {
    render(){
        return (
            <Text style={styles.text}>
            {this.props.title}
            </Text>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: "black",
    fontSize: 20
  }
});
