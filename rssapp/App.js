/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Login from './components/pages/Login';
import News from './components/pages/News';
import Article from './components/pages/Article';
import CreateAccount from './components/pages/CreateAccount';

const App = StackNavigator({
  Login: {screen: Login},
  News: {screen: News},
  Article: {screen: Article},
  CreateAccount: {screen: CreateAccount}
})

export default App;
