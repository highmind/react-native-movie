import React,{Component} from 'react';
import {bindActionCreators} from 'redux';
import * as actionCreators from '../actions/actions';
import {connect} from 'react-redux';
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
    fontSize:18,
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


class Home extends Component {

  constructor(props){
    super(props);
    this.state = {
      text:'芝麻电影',
      filmListData : [],
      start : 0,
      count : 8,
      page : 1
    }
  }

  static navigationOptions = {
    title: '芝麻电影',
  };

  componentDidMount(){
    let api = 'http://api.douban.com/v2/movie/in_theaters?apikey=0b2bdeda43b5688921839c8ecb20399b&city=%E5%8C%97%E4%BA%AC';

    Toast.loading('Loading...', 0);
    let url = `${api}&start=${this.state.start}&count=${this.state.count}`;

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

  loadMore = () => {
    console.log('...loadMore...');
    let {start, page, count} = this.state;
    let tStart = (start + page * count);
    let tPage = page++;

    let api = 'http://api.douban.com/v2/movie/in_theaters?apikey=0b2bdeda43b5688921839c8ecb20399b&city=%E5%8C%97%E4%BA%AC';


    let url = `${api}&start=${tStart}&count=${this.state.count}`;

    fetch(url, {
       method: 'GET'
    }).then((res) => {
      return res.json(); //转换为json格式
    }).then((resTxt) =>{
      console.log(resTxt)
      if (!this.ignoreLastFetch){
        this.setState({
          start : tStart,
          page :tPage,
          text : resTxt.title,
          filmListData :[...this.state.filmListData,...resTxt.subjects]
        })
      }
    }).catch((error) => {
      Toast.info('网络错误', 1);
    }).done();

  }

  render() {
    const { navigate } = this.props.navigation;
    console.log(this.props)
    return (

      <View style={styles.container}>
          <FlatList
           data={this.state.filmListData}
           keyExtractor={(item, index) => item.id}
           onEndReached={this.loadMore}
           onEndReachedThreshold={0.5}
           onRefresh={()=>{console.log('...top refresh...')}}
           refreshing={false}
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

function mapStateToProps(state){
    return {
      testTxt : state.testReducer
    }
}

function mapDispatchToProps(dispatch){
    return {actions:bindActionCreators(actionCreators, dispatch)};
}

export default  connect(mapStateToProps, mapDispatchToProps)(Home)
