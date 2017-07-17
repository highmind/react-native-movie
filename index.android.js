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

import App from './src/containers/App'


//
// <Provider store={store}>
//
// </Provider>



AppRegistry.registerComponent('movie', () =>App);
