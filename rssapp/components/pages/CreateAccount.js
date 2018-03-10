import React, { Component } from 'react';
import { View, Text, Image, StyleSheet,KeyboardAvoidingView, StatusBar, TouchableOpacity, Button, TextInput } from 'react-native';
import { NavigationActions } from 'react-navigation';
import io from 'socket.io-client';

// create a component
class CreateAccount extends Component {

  	static navigationOptions = {
   		title: 'Create Account'
  	};



	constructor(props) {
		super(props);
		// State that gets updated on user input		
 		this.state = {
 			user: '',
 			pass: '',
 			email: ''
    	};

    const socket = io('http://10.0.3.2:5001', { // According to some SO thread.
      transports: ['websocket'],
      pingTimeout: 30000,
      pingInterval: 10000,
    })		


	    socket.on('connect', () => {
	      console.log("socket connected")
	      socket.emit('YOUR EVENT TO SERVER', {stuff: 'is on'})
	      socket.on('EVENT YOU WANNA LISTEN', (r) => {
	      	console.log("event:", r);
	      })
	    })

    socket.on('connect_error', (err) => {
      console.log(err)
    })

	}





  render() {
    return (
    	<KeyboardAvoidingView behavior="padding" style={styles.container}>
	    	<View style={styles.containerInner}>
		        <TextInput style = {styles.input}
	                       onChangeText={(user) => this.setState({user})}
	                       autoCorrect={false}
	                       placeholder='Username'/>
		        <TextInput style = {styles.input}
	                       onChangeText={(email) => this.setState({email})}
	                       keyboardType='email-address'
	                       placeholder='Email address'/>
	         	<TextInput style = {styles.input}
	                       onChangeText={(pass) => this.setState({pass})}
	                       placeholder='Password'/>
	            <TextInput style = {styles.input}
	                       onChangeText={(pass) => this.setState({pass})}
	                       placeholder='Retype password'/>
		        <TouchableOpacity style={styles.buttonContainer} onPress = {this.fetchUser} >
		          <Text  style={styles.buttonText}>LOGIN</Text>
		        </TouchableOpacity>
		    </View>
    	</KeyboardAvoidingView>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2c3e50',
    },
    containerInner: {
        padding: 20
    },
    input:{
        height: 40,
        backgroundColor: 'rgba(225,225,225,0.2)',
        marginBottom: 10,
        padding: 10,
        color: '#fff'
    },
    buttonText:{
        color: '#fff',
        textAlign: 'center',
        fontWeight: '700'
    },
    buttonContainer:{
        backgroundColor: '#2980b6',
        paddingVertical: 15
    },
});

//make this component available to the app
export default CreateAccount;