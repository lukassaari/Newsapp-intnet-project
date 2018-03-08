// Template from http://stacktips.com/tutorials/react-native/creating-login-screen-in-react-native
//import libraries
import React, { Component } from 'react';
import { View, Text, Image, StyleSheet,KeyboardAvoidingView, StatusBar, TouchableOpacity, Button, TextInput } from 'react-native';
import { NavigationActions } from 'react-navigation';

// create a component
class Login extends Component {

  static navigationOptions = {
    // This gets added at the top of the page
    title: 'Login'
  };

  // Jump to target route without ability to go back (resets navigation stack)
  resetNavigation(targetRoute) {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({routeName: targetRoute }),
      ],
    });
    this.props.navigation.dispatch(resetAction);
  }

  fetchUser = () => {
    const {user} = this.state;
    const {pass} = this.state;

    fetch("http://10.0.3.2:5000/login", { // This should work if you just set the correct https address
        method: "post",
        headers:{
          'Accept': 'text/html, application/json',
          'Content-Type': 'application/json',
        },
        // Serialize the body
        body: JSON.stringify({
            user: user,
            pass: pass
        })
    })
    .then((response) => console.log(response)) // Notice we try to parse the input to JSON
      .then((responseJson) => {
        // alert(responseJson);
        // console.log(responseJson);
      })
      .catch((error) => {
        console.error(error)
      });
  }

  constructor(props) {
    super(props);
    this.state = {user: '', pass: ''}; // State that gets updated on user input
  }

    render() {
      return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>

              <View style={styles.loginContainer}>
                  <Image resizeMode="contain" style={styles.logo} source={require('../images/logo-dark-bg.png')} />
              </View>
             <View style={styles.formContainer}>
              <View style={styles.containerInner}>
              <StatusBar barStyle="light-content"/>
              <TextInput style = {styles.input}
                          autoCapitalize="none"
                          onSubmitEditing={() => this.passwordInput.focus()}
                          onChangeText={(user) => this.setState({user})}
                          autoCorrect={false}
                          keyboardType='email-address'
                          returnKeyType="next"
                          placeholder='Email or Mobile Num'
                          placeholderTextColor='rgba(225,225,225,0.7)'/>
              <TextInput style = {styles.input}
                         returnKeyType="go" ref={(input)=> this.passwordInput = input}
                         onChangeText={(pass) => this.setState({pass})}
                         placeholder='Password'
                         placeholderTextColor='rgba(225,225,225,0.7)'
                         secureTextEntry/>
            <TouchableOpacity style={styles.buttonContainer} onPress = {this.fetchUser} >
            <Text  style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>
            </View>

             </View>
          </KeyboardAvoidingView>
      );
    }
}
// onPress = {() => this.props.navigation.navigate('News')}
// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2c3e50',
    },
    containerInner: {
     padding: 20
    },
    loginContainer:{
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center'
    },
    logo: {
        position: 'absolute',
        width: 300,
        height: 100
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
    title:{
        color: "#FFF",
        marginTop: 120,
        width: 180,
        textAlign: 'center',
        opacity: 0.9
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
export default Login;
