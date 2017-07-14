import React,{Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity
} from 'react-native';

import { Toast, Icon } from 'antd-mobile';
import { layoutStyles } from './layout';
import * as utils from '../utils';
const styles = StyleSheet.create({
  container:{
    flex:1
  },
  open:{
    height:100
  },
  close:{
    height:30
  },
  head:{
    paddingTop:20,
    paddingLeft:20,
    paddingBottom:20,
    paddingRight:20,
    backgroundColor:'rgba(0,0,0,0.8)'
  },
  movieName:{
    fontSize:18
  },
  whiteTxt:{
    color:'#fff'
  },
  score:{
    color: '#ffc600',
    fontWeight: 'bold',
    fontSize:17
  },
  main:{
    paddingTop:10,
    paddingLeft:16,
    paddingBottom:10,
    paddingRight:16,

  },
  btn : {
    borderRadius:4,
    width:80,
    height:30,
    borderWidth:1,
    borderColor:'orange',
    borderStyle:'solid',
  },
  btnText : {
    fontSize:16,
    width:80,
    height:30,
    textAlign:'center',
    lineHeight:30,
  }
});

class Detail extends Component{
  constructor(props){
    super(props);
    this.state = {
      title:'',
      data: [],
      isOpen : false
    }
  }

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
  });

  componentDidMount(){
    console.log('....Detail...');
    Toast.loading('Loading...', 0);
    const { params } = this.props.navigation.state;
    let url = `http://api.douban.com/v2/movie/subject/${params.id}?apikey=0b2bdeda43b5688921839c8ecb20399b&city=%E5%8C%97%E4%BA%AC`;
    fetch(url)
    .then((res) => {return res.json()})
    .then((resTxt) => {
      Toast.hide();
      if (!this.ignoreLastFetch){
        this.setState({
          title:resTxt.title,
          data:resTxt
        })
      }
    })
  }

  componentWillUnmount(){
    this.ignoreLastFetch = true;
    Toast.hide();
  }

  changeSummary(){
    console.log('changeSummary')
    let {isOpen} = this.state;
    console.log(isOpen)
    this.setState({
      isOpen : !isOpen
    });
  }

  render(){

    let {
      images = [],
      title,
      alt,
      aka=[],
      durations=[],
      pubdate,
      wish_count,
      rating={average:'暂无'},
      countries=[],
      summary,
      popular_reviews=[],
      genres = [],
      casts = []
    } = this.state.data;

    return (
      <View style={styles.container}>
      <ImageBackground source={{uri:images.medium}}>
        <View style={[layoutStyles.flexRow, styles.head]}>

          <View style={layoutStyles.flex1}>
              <Image source={{uri:images.medium}} style={{width:100, height: 139}} />
          </View>

          <View style={layoutStyles.flex2}>
            <Text style={styles.whiteTxt}>
              <Text style={styles.movieName}>{title}{'\n'}</Text>
              <Text>{aka[0]}{'\n'}</Text>
              <Text style={styles.score}>{rating.average==0?'暂无评分':`${rating.average}分`}{'\n'}</Text>
              <Text>{utils.getGenres(genres)}{'\n'}</Text>
              <Text>{countries[0]} {durations[durations.length-1]}{'\n'}</Text>
              <Text>{pubdate} 大陆上映 </Text>
            </Text>
          </View>

        </View>
      </ImageBackground>

        <View style={styles.main}>
          <Text>演员 {utils.getActor(casts)}</Text>
          <Text>剧情简介</Text>
          <View style={{alignItems: 'center'}}>
            <Text>千百年来，地球上一直住着一种外星生物，名叫喵星人。它们从遥远的喵星来到地球，化身为猫科动物，分散在世界每个角落。萌萌的外表，加上机智聪明的头脑，轻易就得到人类的宠爱。不愁吃喝的它们桀骜不驯，活像饱经沧桑的江湖大佬。犀犀利就是他们中的一员，作为一名正牌的喵星来客，它肩负使命长途跋涉来到地球，却意外遇到了吴守龙（古天乐饰演）一家，上演了一幕相运相生，喵趣横生的人猫奇遇记。</Text>
            <TouchableOpacity onPress={this.changeSummary.bind(this)}>
              <Icon type="down" size="md" color="black" />
            </TouchableOpacity>
          </View>
        </View>


      </View>
    )

  }
}

export default Detail;
