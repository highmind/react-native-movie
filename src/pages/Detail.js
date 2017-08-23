import React,{Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  ImageBackground,
  TouchableOpacity,
  ScrollView
} from 'react-native';

import { Toast, Icon } from 'antd-mobile';
import { layoutStyles } from '../styles/layout';
import { CommentList } from '../components';
import * as utils from '../utils';
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff'
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
  btnText : {
    fontSize:16,
    width:80,
    height:30,
    textAlign:'center',
    lineHeight:30,
  },
  videoImg : {
    position:'relative',
    alignItems:'center',

  },
  videoBtn : {
    position:'absolute',
    top:26,
    width:50,
    height:50,
    alignItems:'center',
    justifyContent:'center'
  }
});

class Detail extends Component{
  constructor(props){
    super(props);
    this.state = {
      title:'',
      data: [],
      isOpen : false,
      loading : false,
      videoData:[], //视频数据 用于传给 视频界面
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
    this.setState({
      loading : true
    })

    let url = `http://api.douban.com/v2/movie/subject/${params.id}?apikey=0b2bdeda43b5688921839c8ecb20399b&city=%E5%8C%97%E4%BA%AC`;
    fetch(url)
    .then((res) => {return res.json()})
    .then((resTxt) => {
      Toast.hide();
      console.log(resTxt);

      let {trailers, bloopers, clips } = resTxt;//处理视频数据 用于传给 视频节目
      let videoData = [...trailers, ...bloopers, ...clips];
      this.setState({
        videoData : videoData,
        title:resTxt.title,
        data:resTxt,
        loading:false
      })
    })
  }

  componentWillUnmount(){
    Toast.hide();
  }

  changeSummary = () => {
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
                {<TouchableOpacity activeOpacity={0.8} onPress={()=>{
                    if(dData.id != null){
                      navigate('Celebrity', { id:dData.id, title: dData.name});
                    }else{
                      Toast.info('暂无数据', 1)
                    }

                  }}>
                  <Image resizeMode="contain" source={imgData} style={{width:100, height: 139}} />
                  <Text numberOfLines={1} style={[layoutStyles.txtCenter,layoutStyles.paragraph]}>{dData.name}</Text>
                </TouchableOpacity>}
              </View>
          )
       });
     }

      return(
        <View>
          <ScrollView horizontal={true}
          showsHorizontalScrollIndicator={false}>
            {nodes}
          </ScrollView>
        </View>
      )

    }

    getVideo(data){
      console.log('...getActorImg...');
      let {navigate} = this.props.navigation;
      let {videoData} = this.state;
      let nodes = <Text>暂无数据</Text>;
      if(data.length != 0){
        nodes = data.map((dData, index) => {
          let imgData = require('../assets/actor.png');

          if(dData.medium != ''){ //接口数据avatars为null
            imgData = {uri:dData.medium};
          }

          return(
              <View style={{marginLeft:6,width:180}} key={index}>

                <TouchableOpacity
                  style={styles.videoImg}
                  activeOpacity={0.8}
                  onPress={()=>{
                    navigate('Trailer', {
                      id : dData.id,
                      title : dData.title,
                      videoData : videoData
                    });
                  }}>

                  <Image
                    resizeMode="contain"
                    source={imgData}
                    style={{width:180, height: 101}} />

                  <Text numberOfLines={1}
                    style={[layoutStyles.txtCenter,layoutStyles.paragraph]}>
                    {dData.title}
                  </Text>

                  <View style={styles.videoBtn}>
                    <Icon type={'\ue6D0'} size={26} color="#fff" />
                  </View>


                </TouchableOpacity>
              </View>
          )
       });
     }
      return(
            <View>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
               >
                {nodes}
              </ScrollView>
            </View>

            )

    }

  getBottom(){  //没有短评时，不显示查看更多按钮
    let {navigate} = this.props.navigation;
    let {popular_comments=[], id, title} = this.state.data;
    if(popular_comments.length != 0){
      return (
        <Button onPress={()=>{
            navigate('Review', { id: id, title: title });
          }} title="查看更多短评" color="#EF4238" />
      )
    }
  }

  render(){
    let {loading} = this.state;
    if(!loading){
      let summaryStyle = this.state.isOpen ? 8 : 4;
      let IconNode = this.state.isOpen ? <Icon type="up" size="md" color="black" /> :
      <Icon type="down" size="md" color="black" />;
      let {
        id,
        images = [],
        title,
        alt,
        aka=[],
        durations=[],
        pubdates=[],
        wish_count,
        rating={average:0},
        countries=[],
        summary,
        popular_reviews=[],
        popular_comments=[],
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
          <ImageBackground style={{width:'auto'}} source={{uri:images.medium}}>
            <View style={[layoutStyles.flexRow, styles.head]}>

              <View style={layoutStyles.flex1}>
                  <Image
                    resizeMode="contain"
                    source={{uri:images.large}}
                    style={{width:100, height: 139}}
                  />
              </View>

              <View style={[layoutStyles.flex3,{paddingHorizontal:50}]}>
                <Text style={[styles.whiteTxt,{lineHeight:24}]}>
                  <Text style={styles.movieName}>{title}{'\n'}</Text>
                  <Text>{aka[0]}{'\n'}</Text>
                  <Text style={styles.score}>{utils.getScore(rating.average)}{'\n'}</Text>
                  <Text>{utils.getGenres(genres)}{'\n'}</Text>
                  <Text>{countries[0]} {durations[durations.length-1]}{'\n'}</Text>
                  <Text>{utils.getPubDate(pubdates)} </Text>
                </Text>
              </View>

            </View>
          </ImageBackground>

            <View style={styles.main}>
              <Text>演员 {utils.getActor(casts)}</Text>

              <Text style={[layoutStyles.txtBold,layoutStyles.title]}>剧情简介</Text>

              <TouchableOpacity activeOpacity={0.8}  onPress={this.changeSummary}>
                <Text style={{lineHeight:24}} numberOfLines={summaryStyle}>{summary}</Text>
                <View style={{alignItems: 'center'}}>
                    {IconNode}
                </View>
              </TouchableOpacity>

              <Text style={[layoutStyles.txtBold,layoutStyles.title]}>演职人员</Text>
              {actorImgNode}

              <Text style={[layoutStyles.txtBold,layoutStyles.title]}>预告花絮</Text>
              {videoNode}

              <Text style={[layoutStyles.txtBold, layoutStyles.title]}>短评</Text>
              <CommentList data={popular_comments} />
              {this.getBottom()}
            </View>
          </ScrollView>
        </View>
      )
    }

      return (
        <View>
        </View>
      )
  }


}

export default Detail;
