import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import {layoutStyles} from '../styles/layout';
import {Toast} from 'antd-mobile';
import {Comment} from '../components';

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff'
  },
  main:{
    paddingVertical:10,
    paddingHorizontal:16,
  },
});

class Review extends Component {

  constructor(props){
    super(props);
    this.state = {
      loading: true,    //底部loading
      refreshing: false,  //顶部loading
      CommentListData : [],
      start : 0,
      count : 8,
      ended : false  //数据是否到底
    }
  }

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
  });

  componentDidMount(){
    console.log('... componentDidMount ...');
    this.getData();
  }

  getApiUrl = () => {
    let { id } = this.props.navigation.state.params;
    let api = `https://api.douban.com/v2/movie/subject/${id}/comments?apikey=0b2bdeda43b5688921839c8ecb20399b&city=%E5%8C%97%E4%BA%AC`;
    return api;
  }

  getData(){
      let api = this.getApiUrl();
      console.log(api);
      let url = `${api}&start=${this.state.start}&count=${this.state.count}`;
      fetch(url, {method: 'GET'})
      .then((res) => { return res.json();})
      .then((resTxt) =>{
        console.log(resTxt)
        if (!this.ignoreLastFetch){
          this.setState({
            loading : false,
            CommentListData :resTxt.comments,
            start : resTxt.next_start  //需要注意，短评接口会默认返回下次 开始位置，直接使用即可
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
            CommentListData :resTxt.comments,
            start : resTxt.next_start,
            count : 8,
            ended : true
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
    let {loading, ended, CommentListData} = this.state;
    if(!loading && !ended){ //上拉时，判断是否在请求数据，如果上次未完成，则不发起请求
      console.log('...loadMore');
      this.setState({
        loading : true
      });

      let {start, count} = this.state;
      let api = this.getApiUrl();
      let url = `${api}&start=${start}&count=${this.state.count}`;
      console.log(url)
      fetch(url, {method: 'GET'})
      .then((res) => {return res.json();})
      .then((resTxt) =>{
        console.log(resTxt)
        if(resTxt.comments.length != 0){ //如果返回数组不为空
          this.setState({
            loading: false,
            start : resTxt.next_start,
            CommentListData :[...this.state.CommentListData,...resTxt.comments]
          })
        }else{
          this.setState({
            loading : false,
            ended : true
          })
        }
      }).catch((error) => {
        Toast.info('网络错误', 1);
      }).done();
    }


  }

  getListBottom = () => {  //设置底部内容，数据没有结束时，使用loading，结束则使用提示语
    let {loading, ended} = this.state;
    if(loading){
      return (
        <ActivityIndicator style={{paddingVertical:10}}
        size="large" color="#e54847" animating={this.state.loading} />
      )
    }

    if(ended){
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
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
          <FlatList
           data={this.state.CommentListData}
           keyExtractor={(item, index) => item.id}
           onEndReached={this.loadMore}
           onEndReachedThreshold={0.5}
           onRefresh={this.onRefresh}
           refreshing={this.state.refreshing}
           ListFooterComponent={this.getListBottom()}
           renderItem={
             ({item}) => {
               return (
                 <View style={styles.main}>
                   <Comment key={item.id} data={item} />
                 </View>
               )
             }
           }
         />

      </View>
    );
  }
}


export default Review;
