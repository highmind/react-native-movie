/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  Alert,
  Image
} from 'react-native';

// import {Button} from './src/components';
import {TabBar, Icon, Toast} from 'antd-mobile';
import Axios from 'axios';

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22
  },

  itemWrap:{
    flexDirection: 'row',
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:10,
    paddingRight:10
  },

  item2: {
   flex:1
 },

 item1:{
   flex:1
 }
});

export default class movie extends Component {

  constructor(props){
    super(props);
    this.state = {
      text:'芝麻电影',
      filmListData : []
    }
  }


  componentDidMount(){
    Toast.loading('Loading...', 0);
    let url = 'http://api.douban.com/v2/movie/in_theaters?apikey=0b2bdeda43b5688921839c8ecb20399b&city=%E5%8C%97%E4%BA%AC&start=0&count=100&client=somemessage&udid=dddddddddddddddddddddd';
    // Axios.get('https://api.douban.com/v2/movie/in_theaters?apikey=0b2bdeda43b5688921839c8ecb20399b&city=%E5%8C%97%E4%BA%AC&start=0&count=100&client=somemessage&udid=dddddddddddddddddddddd')
    // .then((res)=>{
    //   Toast.hide();
    //   console.log(res);
    //    this.setState({
    //      text : res.data.title
    //    });
    // })
    fetch(url, {
       method: 'GET'
    }).then((res) => {
      return res.json(); //转换为json格式
    }).then((resTxt) =>{
      Toast.hide();
      this.setState({
        text : resTxt.title,
        filmListData :resTxt.subjects
      })
    }).catch((error) => {
      Toast.info('网络错误', 1);
    }).done();

  }

  render() {
    return (

      <View style={styles.container}>

        <Text>{this.state.text}</Text>

          <FlatList
           data={this.state.filmListData}
           keyExtractor={(item, index) => item.id}
           renderItem={
             ({item}) => {
               return (
                 <View style={styles.itemWrap}>

                   <View style={styles.item1}>
                     <Image source={{uri:item.images.small}} style={{width:65, height: 100}} />
                   </View>

                   <View style={styles.item2}>
                      <Text>{item.title}</Text>
                   </View>

                   <View style={styles.item1}>
                     <Button
                       onPress={()=> {Alert.alert(`${item.title}`)}}
                       title="查看更多"
                       accessibilityLabel="Learn more about this purple button"
                     />
                   </View>

                 </View>
               )
             }
         }
         />


      </View>
    );
  }
}

AppRegistry.registerComponent('movie', () => movie);
