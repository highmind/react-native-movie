import React,{Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import { Toast } from 'antd-mobile';
import { layoutStyles } from '../styles/layout';
import { ListItem } from './';

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 10,
   backgroundColor:'#fff'
  },
});


class List extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: true,    //底部loading
      refreshing: false,  //顶部loading
      filmListData : [],
      filmListTotal : 0,
      start : 0,
      count : 8,
      page : 1
    }
  }

  componentDidMount(){
    console.log('... componentDidMount ...');
    this.getData();
  }

  getApiUrl = () => {
      let { type } = this.props;
      let api = '';
      if(type == 'playing'){
        api = 'http://api.douban.com/v2/movie/in_theaters?apikey=0b2bdeda43b5688921839c8ecb20399b&city=%E5%8C%97%E4%BA%AC';
      }else{
        api = 'http://api.douban.com/v2/movie/coming_soon?apikey=0b2bdeda43b5688921839c8ecb20399b&city=%E5%8C%97%E4%BA%AC';
      }

      return api;
  }

  getData(){
      let api = this.getApiUrl();
      let url = `${api}&start=${this.state.start}&count=${this.state.count}`;
      fetch(url, {method: 'GET'})
      .then((res) => { return res.json();})
      .then((resTxt) =>{
        if (!this.ignoreLastFetch){
          this.setState({
            loading : false,
            filmListData :resTxt.subjects,
            filmListTotal: resTxt.total
          })
        }
      }).catch((error) => {
        Toast.info('网络错误', 1);
      }).done();
  }

  onRefresh = () => {
     console.log('... onRefresh ...');
      this.setState({
        refreshing: true
      });

      let api = this.getApiUrl();
      let url = `${api}&start=0&count=${this.state.count}`;
      fetch(url, {
         method: 'GET'
      }).then((res) => {
        return res.json(); //转换为json格式
      }).then((resTxt) =>{
        if (!this.ignoreLastFetch){
          this.setState({
            refreshing : false,
            filmListData :resTxt.subjects,
            filmListTotal: resTxt.total,
            start : 0,
            count : 8,
            page : 1
          })
        }
      }).catch((error) => {
        Toast.info('网络错误', 1);
      }).done();

  }

  componentWillUnmount(){
    console.log('... componentWillUnmount ...');
    this.ignoreLastFetch = true;
    Toast.hide();
  }

  loadMore = () => {
    let {loading, filmListData, filmListTotal} = this.state;
    if(!loading && filmListData.length < filmListTotal){ //上拉时，判断是否在请求数据，如果上次未完成，则不发起请求
      this.setState({
        loading : true
      });
      let {start, page, count} = this.state;
      let tStart = (start + page * count);
      let tPage = page++;

      let api = this.getApiUrl();
      let url = `${api}&start=${tStart}&count=${this.state.count}`;
      fetch(url, {method: 'GET'})
      .then((res) => {return res.json();})
      .then((resTxt) =>{
        if (!this.ignoreLastFetch){
          this.setState({
            loading: false,
            start : tStart,
            page :tPage,
            filmListData :[...this.state.filmListData,...resTxt.subjects]
          })
        }
      }).catch((error) => {
        Toast.info('网络错误', 1);
      }).done();
    }


  }

  getListBottom = () => {
    let {loading, filmListData, filmListTotal} = this.state;

    if(loading){
      return (
        <ActivityIndicator style={{paddingVertical:10}}
        size="large" color="#e54847" animating={this.state.loading} />
      )
    }

    if(filmListData.length >= filmListTotal){
      return (
        <View style={{alignItems:'center', paddingVertical:20}}>
          <Text style={{fontSize:12,color:'#999999'}}>
            底线在此,不能更低了
          </Text>
        </View>
      )
    }
  }

  render() {

    return (
      <View style={styles.container}>
          <FlatList
           data={this.state.filmListData}
           keyExtractor={(item, index) => item.id}
           onEndReached={this.loadMore}
           onEndReachedThreshold={0.5}
           onRefresh={this.onRefresh}
           refreshing={this.state.refreshing}
           ListFooterComponent={this.getListBottom()}
           renderItem={
             ({item}) => {
               return (
                 <ListItem data={item} {...this.props} />
               )
             }
           } />
      </View>
    );
  }
}


export default List;
