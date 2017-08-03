import React,{Component} from 'react';
import {StackNavigator} from 'react-navigation';  //路由导航
import {Detail, Celebrity, Video, FilmList} from '../pages';
import {Provider} from 'react-redux';
import configureStore from '../store/store';
const store = configureStore();

// 路由配置
const Route = StackNavigator({
  Home: {screen: FilmList},
  Detail: {screen: Detail},
  Celebrity:{screen:Celebrity},
  Video:{screen:Video}
});

//设置首屏的 顶栏title
FilmList.navigationOptions = {
  title: '芝麻电影',
};

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
