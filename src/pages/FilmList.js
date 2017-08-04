import React, {Component} from 'react';
import {TabNavigator} from 'react-navigation';
import {List} from '../components/';

//正在上映组件，由List组件和react-navigation的props构成
class PlayingList extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "正在上映",
  });
  render(){
    return (
      <List type="playing" {...this.props} />
    )
  }
 }

//即将上映组件，由List组件和react-navigation的props构成
 class ComingList extends Component {
   static navigationOptions = ({ navigation }) => ({
     title: "即将上映",
   });
  render(){
    return (
      <List type="coming" {...this.props} />
    )
  }
 }


// FilmList 的 TabNavigator配置
const FilmList = TabNavigator({
    Playing: { screen: PlayingList },
    Coming: { screen: ComingList },
  }, {
      animationEnabled: false, // 切换页面时是否有动画效果
      tabBarPosition: 'top', // 显示在底端，android 默认是显示在页面顶端的
      swipeEnabled: true, // 是否可以左右滑动切换tab
      backBehavior: 'none', // 按 back 键是否跳转到第一个Tab(首页)， none 为不跳转
      tabBarOptions: {
          activeTintColor: '#e54847', // 文字和图片选中颜色
          inactiveTintColor: '#1f1f1f', // 文字和图片未选中颜色
          showIcon: false, // android 默认不显示 icon, 需要设置为 true 才会显示
          indicatorStyle: {
              height: 2,  // 如TabBar下面显示有一条线，可以设高度为0后隐藏
              backgroundColor:"#e54847"
          },
          style: {
              backgroundColor: '#fff', // TabBar 背景色

          },
          labelStyle: {
              fontSize: 16, // 文字大小
          },
      },
});

export default FilmList;
