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
import {debounce} from 'lodash';
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
      loading: false,    //底部loading
      refreshing: false,  //顶部刷新loading
      filmListData : [],
      filmListTotal : -1,
      ended: false,
      searchTxt : '', //搜索词
      start : 0,
      count : 12,
      page : 1
    }
    this.lastFetchId = 0;  //请求时序控制
    this.getData = debounce(this.getData, 300); //节流控制
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

        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;

        let {searchTxt} = this.state;
        // if(utils.trim(searchTxt) == ''){//搜索词
        //   console.log('请输入关键词')
        //   this.setState({
        //     loading: false,    //底部loading
        //     refreshing: false,  //顶部loading
        //     filmListData : [],
        //     filmListTotal : -1,
        //     ended: false,
        //     searchTxt : '', //搜索词
        //     start : 0,
        //     count : 8,
        //     page : 1
        //   });
        //   return;
        // }


        // 搜索词变化时，getData在不断触发，需要清除 数据
            fetch(url, {method: 'GET'})
            .then((res) => {return res.json();})
            .then((resTxt) =>{
              if (fetchId !== this.lastFetchId) { // for fetch callback order
                return;
              }

              let {searchTxt} = this.state;
              this.setState({
                loading : false,
                filmListData :resTxt.subjects,
                filmListTotal: resTxt.total,
                start : 0,
                page : 1
              });
            }).catch((error) => {
              Toast.info('网络错误', 1);
            }).done();

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
            this.setState({
              refreshing : false,
              filmListData :resTxt.subjects,
              filmListTotal: resTxt.total,
              start : 0,
              page : 1
            })
        }).catch((error) => {
          Toast.info('网络错误', 1);
        }).done();

    }


    componentWillUnmount(){
      console.log('... componentWillUnmount ...');
      Toast.hide();
    }

    loadMore = () => {  //在数据为空，且不足一屏高度时，会出现默认执行loadmore的情况
      console.log('loadMore')
      let {loading, ended, searchTxt} = this.state;

      if(utils.trim(searchTxt) == ''){  //搜索词为空时，不执行，默认指向loadmore情况
        return;
      }

      //上拉时，判断是否在请求数据，如果上次未完成 且 数据已到底 ，则不发起请求
      if(!loading && !ended){
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
           if(resTxt.subjects.length != 0){ //如果下一页数据不为空，
             this.setState({
               loading: false,
               start : tStart,
               page :tPage,
               filmListTotal: resTxt.total,
               filmListData :[...this.state.filmListData,...resTxt.subjects]
             })
           }else{ //下一页数据为空，设置 ended为 true，标识列表数据到底
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


    _separator = () => {
      return (
        <View style={
              {marginHorizontal:10, height: 1, backgroundColor: '#E6E6E6' }
            }></View>
      )
    }

    render() {
      const { navigate, goBack } = this.props.navigation;
      return (
        <View style={styles.container}>
            <View style={[layoutStyles.flexRow,styles.searchTop]}>
              <View style={layoutStyles.flex6}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="请输入搜索内容"
                  underlineColorAndroid="transparent"
                  onEndEditing={()=>{console.log('编辑结束')}}
                  onChangeText={(text) => {
                    this.setState({
                      searchTxt:text,
                      filmListData :[],
                      filmListTotal: -1,
                      start : 0,
                      page : 1,
                      loading : true,
                    }, this.getData);
                  }}
                  value={this.state.searchTxt}
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
             getItemLayout={(item, index) => ({length: 140, offset: 142 * index, index})}
             ListFooterComponent={this.getListBottom()}
             ItemSeparatorComponent={this._separator}
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
