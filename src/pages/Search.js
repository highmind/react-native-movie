import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  TextInput
} from 'react-native';

import {Toast} from 'antd-mobile';
import * as utils from '../utils';
import { layoutStyles } from '../styles/layout';
import { Button, ListItem } from '../components/';

const styles = StyleSheet.create({
  container: {
   flex: 1,
   backgroundColor:'#fff'
  },
  searchTop:{paddingHorizontal:10,paddingVertical:14,backgroundColor:'#fafafa'},
  searchInput:{
    height: 32,
    borderRadius:20,
    margin:0,
    padding:0,
    paddingLeft:14,
    backgroundColor:'#ebebeb'
  },
  searchGoBack:{width:60,alignItems:'center',paddingVertical:6,}
});

class Search extends Component {

  constructor(props){
    super(props);
    this.state = {
      topLoading: false,
      loading: false,    //底部loading
      refreshing: false,  //顶部loading
      filmListData : [],
      filmListTotal : -1,
      ended: false,
      searchTxt : '', //搜索词
      start : 0,
      count : 8,
      page : 1
    }

    this.isFetch = false;
  }

    static navigationOptions = ({ navigation }) => ({
      header:null, //设置为null,则隐藏header
    });

    componentDidMount(){}

    getApiUrl = () => {
        let api = 'http://api.douban.com/v2/movie/search?apikey=0b2bdeda43b5688921839c8ecb20399b&city=%E5%8C%97%E4%BA%AC';
        return api;
    }

    getData = () => {
        let api = this.getApiUrl();
        let url = `${api}&q=${this.state.searchTxt}&start=0&count=${this.state.count}`;
        console.log(url);

        let {searchTxt} = this.state;
        if(utils.trim(searchTxt) == ''){//搜索词
          console.log('请输入关键词')
          // Toast.info('请输入搜索词', 1);
          return;
        }

        this.setState({
          loading : true,
          filmListData :[],
          filmListTotal: -1,
        }, () => {
          if(!this.isFetch){  //如果fetch没有正在请求
            this.isFetch = true;
            fetch(url, {method: 'GET'})
            .then((res) => { return res.json();})
            .then((resTxt) =>{
                this.setState({
                  loading : false,
                  filmListData :resTxt.subjects,
                  filmListTotal: resTxt.total,
                  start : 0,
                  count : 8,
                  page : 1
                });
                this.isFetch = false
            }).catch((error) => {
              Toast.info('网络错误', 1);
            }).done();
          }

        });


    }

    onRefresh = () => {
       console.log('... onRefresh ...');
        this.setState({
          refreshing: true
        });
        let {searchTxt} = this.state;
        let api = this.getApiUrl();
        let url = `${api}&q=${searchTxt}&start=0&count=${this.state.count}`;
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
      this.isFetch = false;
      Toast.hide();
    }

    loadMore = () => {
      console.log('loadMore')
      let {loading, ended} = this.state;
      console.log(this.state);
      if(!loading && !ended){ //上拉时，判断是否在请求数据，如果上次未完成，则不发起请求
        this.setState({
          loading : true
        });
        let {start, page, count, searchTxt} = this.state;
        let tStart = (start + page * count);
        let tPage = page++;

        let api = this.getApiUrl();
        let url = `${api}&q=${searchTxt}&start=${tStart}&count=${this.state.count}`;

        fetch(url, {method: 'GET'})
        .then((res) => {return res.json();})
        .then((resTxt) =>{
           if(resTxt.subjects.length != 0){
             this.setState({
               loading: false,
               start : tStart,
               page :tPage,
               filmListData :[...this.state.filmListData,...resTxt.subjects]
             })
           }else{
             this.setState({
               loading: false,
               ended: true
             })
           }

        }).catch((error) => {
          Toast.info('网络错误', 1);
        }).done();
      }
    }

    getListBottom = () => {
      let {loading, ended, filmListData, filmListTotal} = this.state;

      if(loading){  //如果正在加载中，FlatList底部使用 loading组件
        return (
          <ActivityIndicator style={{paddingVertical:10}}
          size="large" color="#e54847" animating={this.state.loading} />
        )
      }
      // 当state中列表数据长度 和 接口中数据总长度相同时，提示到底部了
      // -1 解决刚进入时，底线默认出现的问题
      if(ended && filmListTotal != -1){
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
      const { navigate, goBack } = this.props.navigation;
      // onSubmitEditing={()=>{this.getData()}}
      // ListEmptyComponent={<Text>空列表</Text>}
      // onEndEditing={()=>{this.getData();}}
      // onChange={()=>{this.getData();}}
      // <View style={layoutStyles.flex1}>
      //     <Button style={{width:60}} onPress={()=> {
      //       this.getData();
      //   }} title="搜索" color="#EF4238" />
      // </View>
      return (
        <View style={styles.container}>
            <View style={[layoutStyles.flexRow,styles.searchTop]}>
              <View style={layoutStyles.flex6}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="请输入搜索内容"
                  underlineColorAndroid="transparent"
                  onChange={()=>{this.getData();}}
                  onChangeText={(text) => {
                    this.setState({searchTxt:text});
                  }}
                  value={this.state.searchText}
                />
              </View>

              <TouchableOpacity
                style={[layoutStyles.flex1,styles.searchGoBack]}
                onPress={ ()=> { goBack();} }>
                  <Text style={{color:'#f2554f'}}>取消</Text>
              </TouchableOpacity>

            </View>

            <FlatList
             data={this.state.filmListData}
             keyExtractor={(item, index) => item.id}
             onEndReached={this.loadMore}
             onEndReachedThreshold={0.5}
             onRefresh={this.onRefresh}
             refreshing={this.state.refreshing}
             ListFooterComponent={this.getListBottom()}
             ListEmptyComponent={
               <View style={{alignItems:'center',marginTop:30}}>
                 <Text>搜索词可为电影名或影人</Text>
               </View>
             }
             renderItem={
               ({item}) => {
                 return(
                   <ListItem data={item} {...this.props} />
                 )}
             } />


        </View>
      );
    }

}

export default Search;
