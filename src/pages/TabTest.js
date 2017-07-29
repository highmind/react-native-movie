import React,{Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import { TabNavigator } from 'react-navigation';
import { Toast, Icon } from 'antd-mobile';
import { layoutStyles } from './layout';
import * as utils from '../utils';
import {List} from '../components/';

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff'
  },
  
});

class PlayingList extends Component {
  render(){
    return (
      <List type="playing" {...this.props} />
    )
  }
  
 }

 class ComingList extends Component {
  render(){
    return (
      <List type="Coming" {...this.props} />
    )
  }
 }

// const ComingList = () => {
//   return (
//     <List type="coming" />
//   )
//  }


// 注册tabs
const Tabs = TabNavigator({
    Playing: {
        screen: PlayingList,

    },
    Coming: {
        screen: ComingList,
      
    },

  }, {
      animationEnabled: false, // 切换页面时是否有动画效果
      tabBarPosition: 'top', // 显示在底端，android 默认是显示在页面顶端的
      swipeEnabled: true, // 是否可以左右滑动切换tab
      backBehavior: 'none', // 按 back 键是否跳转到第一个Tab(首页)， none 为不跳转
      tabBarOptions: {
          activeTintColor: '#ff8500', // 文字和图片选中颜色
          inactiveTintColor: '#999', // 文字和图片未选中颜色
          showIcon: false, // android 默认不显示 icon, 需要设置为 true 才会显示
          indicatorStyle: {
              height: 0  // 如TabBar下面显示有一条线，可以设高度为0后隐藏
          }, 
          style: {
              backgroundColor: '#fff', // TabBar 背景色
              // height: 44
          },
          labelStyle: {
              fontSize: 10, // 文字大小
          },
      },
});


class TabTest extends Component{
  constructor(props){
    super(props);
    this.state = {
      title:'',
      data: [],
      isOpen : false
    }
  }

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
  });

  componentDidMount(){
    console.log('....TabTest componentDidMount...');
    
  }

  componentWillUnmount(){
  
  }





  render(){
   
    return (
      <View style={styles.container}>
        <Tabs />
      </View>
    )

  }
}

export default TabTest;
