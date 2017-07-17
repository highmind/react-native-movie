import React,{Component} from 'react';

import {StackNavigator} from 'react-navigation';  //路由导航

import {Home, Detail} from '../pages';
import {Provider} from 'react-redux';
import configureStore from '../store/store';
const store = configureStore();

// 路由配置
const Route = StackNavigator({
  Home: {screen: Home},
  Detail: {screen: Detail},
});


class App extends Component {
  render(){
    return (
      <Provider store={store}>
        <Route />
      </Provider>
    )
  }
}

export default App;
