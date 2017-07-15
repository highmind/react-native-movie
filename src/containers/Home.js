import React,{Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  Alert,
  Image
} from 'react-native';

import {TabBar, Icon, Toast} from 'antd-mobile';
import * as utils from '../utils';

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 10,
   backgroundColor:'#fff'
  },
  itemTitle:{
    fontSize:18
  },
  itemWrap:{
    flexDirection: 'row',
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:10,
    paddingRight:10
  },

  item3: {
   flex:3
 },

 item1:{
   flex:1
 }
});


export default class Home extends Component {

  constructor(props){
    super(props);
    this.state = {
      text:'芝麻电影',
      filmListData : []
    }
  }

  static navigationOptions = {
    title: '芝麻电影',
  };

  componentDidMount(){
    Toast.loading('Loading...', 0);
    let url = 'http://api.douban.com/v2/movie/in_theaters?apikey=0b2bdeda43b5688921839c8ecb20399b&city=%E5%8C%97%E4%BA%AC&start=0&count=100&client=somemessage&udid=dddddddddddddddddddddd';

    fetch(url, {
       method: 'GET'
    }).then((res) => {
      return res.json(); //转换为json格式
    }).then((resTxt) =>{
      Toast.hide();
      if (!this.ignoreLastFetch){
        this.setState({
          text : resTxt.title,
          filmListData :resTxt.subjects
        })
      }
    }).catch((error) => {
      Toast.info('网络错误', 1);
    }).done();

  }

  componentWillUnmount(){
    this.ignoreLastFetch = true;
    Toast.hide();
  }

  render() {
    const { navigate } = this.props.navigation;

    return (

      <View style={styles.container}>
          <FlatList
           data={this.state.filmListData}
           keyExtractor={(item, index) => item.id}
           renderItem={
             ({item}) => {
               return (
                 <View style={styles.itemWrap}>

                   <View style={styles.item1}>
                     <Image source={{uri:item.images.medium}} style={{width:65, height: 100}} />
                   </View>

                   <View style={styles.item3}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <Text>{item.genres.join('/')}</Text>
                      <Text>导演:{item.directors[0].name}</Text>
                      <Text>{utils.getActor(item.casts)}</Text>
                      <Text>{item.pubdates[item.pubdates.length - 1]}</Text>
                   </View>

                   <View style={styles.item1}>
                     <Button
                       onPress={()=> {
                         navigate('Detail', { id: item.id, title: item.title });
                       }}
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
