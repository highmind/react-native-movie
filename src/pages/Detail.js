import React,{Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView
} from 'react-native';

import { Toast, Icon } from 'antd-mobile';
import { layoutStyles } from './layout';
import * as utils from '../utils';
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff'
  },
  test:{
    width:100,
    height:100,
    marginLeft:10,
    backgroundColor:'blue'
  },
  head:{
    padding:20,
    backgroundColor:'rgba(0,0,0,0.6)'
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
   horizontalScrollView: {
    height: 200,
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
  //设置 顶栏标题
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
        console.log(resTxt);
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

  getActorImg(data){
      let {navigate} = this.props.navigation;
      console.log('...getActorImg...');
      let nodes = <Text>暂无数据</Text>;
      if(data.length != 0){
        nodes = data.map((dData, index) => {
          let imgData = require('../assets/actor.png');

          if(dData.avatars != null){  //接口数据avatars为null
            imgData = {uri:dData.avatars.medium};
          }

          return(
              <View style={{padding:6,width:110}} key={index}>
                <TouchableOpacity onPress={()=>{
                    navigate('Celebrity', { id:dData.id, title: dData.name});
                  }}>
                  <Image source={imgData} style={{width:100, height: 139}} />
                  <Text numberOfLines={1} style={{textAlign:'center'}}>{dData.name}</Text>
                </TouchableOpacity>
              </View>
          )
       });
     }

      return(
        <View>
          <ScrollView horizontal={true}
           style={styles.horizontalScrollView}
          showsHorizontalScrollIndicator={false}>
            {nodes}
          </ScrollView>
        </View>
      )

    }

    getVideo(data){
      console.log('...getActorImg...');
      let {navigate} = this.props.navigation;
      let nodes = <Text>暂无数据</Text>;
      if(data.length != 0){
        nodes = data.map((dData, index) => {
          let imgData = require('../assets/actor.png');

          if(dData.medium != ''){ //接口数据avatars为null
            imgData = {uri:dData.medium};
          }

          return(
              <View style={{marginLeft:6,width:180}} key={index}>
                <TouchableOpacity onPress={()=>{
                    navigate('Video', { id: dData.id, title: dData.title});
                  }}>
                  <Image source={imgData} style={{width:180, height: 101}} />
                  <Text numberOfLines={1} style={{textAlign:'center'}}>{dData.title}</Text>
                </TouchableOpacity>
              </View>
          )
       });
     }
      return(
            <View>
              <ScrollView horizontal={true}
                style={styles.horizontalScrollView}
                showsHorizontalScrollIndicator={false}>
                  {nodes}
                </ScrollView>
            </View>

            )

    }


  render(){
    let summaryStyle = this.state.isOpen ? 8 : 4;
    let IconNode = this.state.isOpen ? <Icon type="up" size="md" color="black" /> :
    <Icon type="down" size="md" color="black" />;
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
      casts = [],
      directors = [],
      trailers = [],
      bloopers = [],
      clips = []

    } = this.state.data;

    let actorImgNode = this.getActorImg([...casts,...directors]);
    let videoNode = this.getVideo([...trailers,...bloopers,...clips])
    return (
      <View style={styles.container}>
      <ScrollView>
        <ImageBackground source={{uri:images.medium}}>
          <View style={[layoutStyles.flexRow, styles.head]}>

            <View style={layoutStyles.flex1}>
                <Image source={{uri:images.large}} style={{width:100, height: 139}} />
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
            <View style={[{alignItems: 'center'}]}>
              <Text numberOfLines={summaryStyle}>{summary}</Text>
              <TouchableOpacity onPress={this.changeSummary.bind(this)}>
                  {IconNode}
              </TouchableOpacity>
            </View>

            <Text>演职人员</Text>
            {actorImgNode}
            <Text>预告花絮</Text>
            {videoNode}


          </View>
        </ScrollView>
      </View>
    )

  }
}

export default Detail;
