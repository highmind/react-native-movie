/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
} from 'react-native';

import {Home, Detail} from './src/containers';

import {StackNavigator} from 'react-navigation';  //路由导航


const App = StackNavigator({
  Home: {screen: Home},
  Detail: {screen: Detail},
});





AppRegistry.registerComponent('movie', () => App);
