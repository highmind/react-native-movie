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
   paddingTop: 10,
   backgroundColor:'#fff'
  },
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
      searchTxt : '', //搜索词
      start : 0,
      count : 8,
      page : 1
    }
  }

    static navigationOptions = ({ navigation }) => ({
      title: navigation.state.params.title,
      header:null, //设置为null,则隐藏header
    });

    componentDidMount(){
        const { params } = this.props.navigation.state; //从上个 screen 传过来的参数
        console.log(params);

    }

    getApiUrl = () => {
        let api = 'http://api.douban.com/v2/movie/search?apikey=0b2bdeda43b5688921839c8ecb20399b&city=%E5%8C%97%E4%BA%AC';
        return api;
    }

    getData = () => {
        let api = this.getApiUrl();
        let url = `${api}&q=${this.state.searchTxt}&start=0&count=${this.state.count}`;
        console.log(url);
        this.setState({
          loading : true,
          filmListData :[],
          filmListTotal: -1,
        });

        fetch(url, {method: 'GET'})
        .then((res) => { return res.json();})
        .then((resTxt) =>{
          if (!this.ignoreLastFetch){
            this.setState({
              loading : false,
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
      this.ignoreLastFetch = true;
      Toast.hide();
    }

    loadMore = () => {
      let {loading, filmListData, filmListTotal} = this.state;
      if(!loading && filmListData.length < filmListTotal){ //上拉时，判断是否在请求数据，如果上次未完成，则不发起请求
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
      // -1 解决刚进入时，底线出现问题
      if(filmListData.length >= filmListTotal && filmListTotal != -1){
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
            <View style={[layoutStyles.flexRow,{paddingHorizontal:16,marginTop:30,}]}>
              <View style={layoutStyles.flex5}>
                <TextInput
                  style={{height: 40}}
                  placeholder="请输入搜索内容"
                  onChangeText={(text) => this.setState({searchTxt:text})}
                  onSubmitEditing={()=>{this.getData()}}
                  value={this.state.searchText}
                />
              </View>
              <View style={layoutStyles.flex1}>
                  <Button style={{width:60}} onPress={()=> {
                    this.getData();
                }} title="搜索" color="#EF4238" />
              </View>

            </View>

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
                 return(
                   <ListItem data={item} {...this.props} />
                 )}
             } />


        </View>
      );
    }

}

export default Search;
