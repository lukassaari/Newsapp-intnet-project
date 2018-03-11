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

    	this.socket = io('http://10.0.3.2:5001', { // According to some SO thread.
  			transports: ['websocket'],
  			pingTimeout: 30000,
  			pingInterval: 10000
    	})

    	// Listener that fires on connect
		this.socket.on('connect', () => {
			console.log("Connected to socket");
		})

		this.socket.on('message', (response) => {
			let status = response['status']; // Extract response payload
			if (status == true) {
				// Add warning label
			} else {
				// Add nice label
			}
		})

		this.socket.on('add_user', (response) => {
			// Handle response as positive or negative
			console.log(response);

		})

    this.socket.on('connect_error', (err) => {
      	console.log(err)
    })
	}

	// Add a user
	addUser = () => {
		const {user} = this.state;
		const {pass} = this.state;
		const {email} = this.state;
		payload = {
			user: user,
      pass: pass,
      email: email
		}
		this.socket.emit('create_account', payload);
	}

  render() {
    return (
    	<KeyboardAvoidingView behavior="padding" style={styles.container}>
	    	<View style={styles.containerInner}>
		        <TextInput style = {styles.input}
	                       onChangeText={(user) => {
	                       		this.setState({user});
	                       		this.socket.emit('check_db', {user});}
	                       	}
	                       autoCorrect={false}
	                       placeholder='Username'/>
		        <TextInput style = {styles.input}
	                       onChangeText={(email) => this.setState({email})}
	                       keyboardType='email-address'
	                       placeholder='Email address'/>
	         	<TextInput style = {styles.input}
	                       onChangeText={(pass) => this.setState({pass})}
	                       placeholder='Password'
	                       secureTextEntry/>
	            <TextInput style = {styles.input}
	                       onChangeText={(pass) => this.setState({pass})}
	                       placeholder='Retype password'
	                       // TODO: make sure same password is retyped
	                       secureTextEntry/>
		        <TouchableOpacity style={styles.buttonContainer} onPress = {this.addUser} >
		          <Text  style={styles.buttonText}>CREATE ACCOUNT</Text>
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
