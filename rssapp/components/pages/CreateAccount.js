import React, { Component } from 'react';
import { View, Text, Image, StyleSheet,KeyboardAvoidingView, StatusBar, TouchableOpacity, Button, TextInput } from 'react-native';
import { NavigationActions } from 'react-navigation';
import io from 'socket.io-client';

/*
* 	The create account class shows a UI with text fields to add relevant userinformation
*	It keeps a socket session with the server to dynamically give feedback on username
*	Whenever a username letter is changed, it fires a legibility check event to the server
*	To piggybank on the connection, the create user command is also on the Websocket traffic.
*/
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
 			email: '',
 			passready: false, // Bool for password equality
 			userready: false // Bool for username originality
  		};

    	this.socket = io('http://10.0.3.2:5000/create-account', { // According to some SO thread.
  			transports: ['websocket'],
  			pingTimeout: 30000,
  			pingInterval: 10000
		});

		// Message if user is in database or not, true => user is in database
		// Changes the colour of the username field depending on the result
		this.socket.on('message', (response) => {
			let status = response['status']; // Extract response payload
			if (status == true) { // User exists in database
				// Add warning label
				this.state.userready = false;
			} else { // User does not exist in database
				// Add nice label
				this.state.userready = true;
			}
		})

		// Server response after trying to add user to database
		// Displays a temporary label to the user with information about the outcome
		this.socket.on('add_user', (response) => {
			if (response['status']) { // Success
				// Add nice label
				alert('User successfully added');
			} else { // Fail
				// Add evil label
				alert('Failed to add user');
			}
		})

		// On connect error
	    this.socket.on('connect_error', (err) => {
	      	console.log(err)
	    })

	    // Disconnect socket when leaving screen
		const didBlurSubscription = this.props.navigation.addListener(
			'didBlur', payload => {
				this.socket.disconnect()
			}
		);
	}

	// Add a user
	addUser = () => {
		const {user} = this.state;
		const {pass} = this.state;
		const {email} = this.state;

		if (!this.state.passready || pass.length === 0) {
			alert('Passwords dont match or is empty');
			return;
		}
		if (!this.state.userready || user.length === 0) {
			alert('Username is taken or unvalid');
			return;
		}

		payload = {
			user: user,
			pass: pass,
			email: email
		}
		this.socket.emit('create_account', payload);
	}

	// Validate if passwords are equal
	validatePasswordInput(pass_one) {
		const pass_two = this.state.pass;
		if (pass_one.length === pass_two.length) {
			if (pass_one === pass_two) {
				// Green
				this.state.passready = true;
			} else {
				// Warning
				this.state.passready = false;
			}
		}
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
	                       secureTextEntry
	                       id='pass1'/>
	            <TextInput style = {styles.input}
	                       onChangeText={(pass) => this.validatePasswordInput(pass)}
	                       placeholder='Retype password'
	                       secureTextEntry
	                       id='pass2'/>
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
