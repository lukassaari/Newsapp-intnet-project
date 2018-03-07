// Template from http://stacktips.com/tutorials/react-native/creating-login-screen-in-react-native
//import liraries
import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Button ,StyleSheet ,StatusBar} from 'react-native';

/*
const onButtonPress = () => {
  Alert.alert('Button has been pressed!');
};
*/

// create a component
class LoginForm extends Component {
  constructor(props){
    super(props);
    this.state = {username: "", password: ""};
  }
  //static navigationOptions = {
  //  title: 'Welcome',
  //};
  render() {
    //const { navigate } =this.props.navigation;
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content"/>
            <TextInput style = {styles.input}
                // Saves the user input
                ref= {(el) => { this.username = el; }}
                onChangeText={(username) => this.setState({username})}
                value={this.state.username}

                autoCapitalize="none"
                onSubmitEditing={() => this.passwordInput.focus()}
                autoCorrect={false}
                keyboardType='email-address'
                returnKeyType="next"
                placeholder='Email or Mobile Num'
                placeholderTextColor='rgba(225,225,225,0.7)'/>

            <TextInput style = {styles.input}
                // Saves the user input
                ref= {(el) => { this.password = el; }}
                onChangeText={(password) => this.setState({password})}
                value={this.state.password}

                returnKeyType="go" ref={(input)=> this.passwordInput = input}
                placeholder='Password'
                placeholderTextColor='rgba(225,225,225,0.7)'
                secureTextEntry/>
             //{/*   <Button onPress={onButtonPress} title = 'Login' style={styles.loginButton} /> */}
          /*<TouchableOpacity style={styles.buttonContainer} onPress={() async() => {
            res = await fetch("http://localhost:5000/login", {
              method: "POST",
              body: JSON.stringify({
                name: this.state.username,
                password: this.state.password,
              }),
            });
            if (res != NULL){
              fetch('http://localhost:5000/news', {
                method: "GET"
              })
            } else {
              Alert.alert('Wrong username/password');
            }
            //this.props.navigate('News', {screen: 'News'})}
          }>
                <Text  style={styles.buttonText}>LOGIN</Text>
            </TouchableOpacity>*/
        </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
    container: {
     padding: 20
    },
    input:{
        height: 40,
        backgroundColor: 'rgba(225,225,225,0.2)',
        marginBottom: 10,
        padding: 10,
        color: '#fff'
    },
    buttonContainer:{
        backgroundColor: '#2980b6',
        paddingVertical: 15
    },
    buttonText:{
        color: '#fff',
        textAlign: 'center',
        fontWeight: '700'
    },
    loginButton:{
      backgroundColor:  '#2980b6',
       color: '#fff'
    }

});

//make this component available to the app
export default LoginForm;
