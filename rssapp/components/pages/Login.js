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

    // Fetches news info from the backend to pass to the news-page
    fetch("http://10.0.3.2:5000/news", {
        method: "get",
        headers:{
            'Accept': 'text/html, application/json',
            'Content-Type': 'application/json',
        },
    })
    .then((response) => { // Parse the response and then move to next page
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({routeName: targetRoute, params: {news: response}}),
        ],
      });
      this.props.navigation.dispatch(resetAction);
    })
  }

  // Checks if the login information is valid, if it is the user is logged in and navigated to the newsfeed
  fetchUser = () => {
    const {user} = this.state;
    const {pass} = this.state;

    fetch("http://10.0.3.2:5000/login", {
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
    .then((response) => { // Parse the response and then move to next page
        if (response.status === 200) {
          this.resetNavigation('News')
        } else {
          alert("Wrong login details") // Better signal could be used
        }
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
        <Image resizeMode="contain" style={styles.logo} source={require('../images/company_logo.png')} />
      </View>
      <View>
        <View style={styles.containerInner}>
          <Text style={styles.regAccountText}> {'Welcome, please login or '}
          <Text style={styles.regAccountHyperlinkText}
                onPress={() => this.props.navigation.navigate('CreateAccount')}>
                 register a new account</Text>
          </Text>
          <StatusBar barStyle="light-content"/>
            <TextInput style = {styles.input}
                       autoCapitalize="none"
                       onSubmitEditing={() => this.passwordInput.focus()} // probably removable
                       onChangeText={(user) => this.setState({user})}
                       autoCorrect={false}
                       keyboardType='email-address'
                       returnKeyType="next"
                       placeholder='Email or Mobile Num'/>
            <TextInput style = {styles.input}
                       returnKeyType="go" ref={(input)=> this.passwordInput = input} // prolly removable
                       onChangeText={(pass) => this.setState({pass})}
                       placeholder='Password'
                       secureTextEntry/>
            <TouchableOpacity style={styles.buttonContainer} onPress = {this.fetchUser} >
              <Text style={styles.buttonText}>LOGIN</Text>
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
    },
    regAccountText:{
        paddingVertical: 10,
        color: "white"
    },
    regAccountHyperlinkText: {
        color: 'white',
        textDecorationLine: 'underline'
    }
});

//make this component available to the app
export default Login;
