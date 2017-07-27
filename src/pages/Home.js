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
  Image,
  TouchableOpacity
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
      loading: true,
      text:'芝麻电影',
      filmListData : [],
      filmListTotal : 0,
      start : 0,
      count : 8,
      page : 1
    }
  }

  static navigationOptions = {
    title: '芝麻电影',
  };

  componentDidMount(){
    this.getData();
  }

  getData(){
    console.log('... getData ...');
    this.setState({
      loading: true,
      text:'芝麻电影',
      filmListData : [],
      start : 0,
      count : 8,
      page : 1
    });
    let api = 'http://api.douban.com/v2/movie/in_theaters?apikey=0b2bdeda43b5688921839c8ecb20399b&city=%E5%8C%97%E4%BA%AC';

    // Toast.loading('Loading...', 0);
    let url = `${api}&start=${this.state.start}&count=${this.state.count}`;

    fetch(url, {
       method: 'GET'
    }).then((res) => {
      return res.json(); //转换为json格式
    }).then((resTxt) =>{
      // Toast.hide();
      console.log(this.state.filmListData.length);

      console.log(resTxt.total);
      if (!this.ignoreLastFetch){
        this.setState({
          loading : false,
          text : resTxt.title,
          filmListData :resTxt.subjects,
          filmListTotal: resTxt.total
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
    let {loading, filmListData, filmListTotal} = this.state;

    if(filmListData.length >= filmListTotal){
      console.log('... 所有列表数据加载完成 ...')
    }

    if(!loading && filmListData.length < filmListTotal){ //下拉时，判断是否在请求数据，如果上次未完成，则不发起请求
      console.log('...loadMore...');
      this.setState({
        loading : true
      });
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
            loading: false,
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
           onRefresh={this.getData.bind(this)}
           refreshing={this.state.loading}
           renderItem={
             ({item}) => {
               return (
                <TouchableOpacity onPress={()=> {
                  navigate('Detail', { id: item.id, title: item.title });
                }}>
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
                     <Button onPress={()=> {
                       navigate('Detail', { id: item.id, title: item.title });
                     }} title="查看更多" />
                   </View>

                 </View>
               </TouchableOpacity>
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
