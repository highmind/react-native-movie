import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Slider,
  Image,
  ActivityIndicator,
  ScrollView
} from 'react-native';

import Video from 'react-native-video';
import {layoutStyles} from '../styles/layout';
import {Icon, Toast } from 'antd-mobile';

let styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: 'black',
  },
  loading:{
    position:'absolute',
  },
  postWrap:{
    flex:1,
    height:240
  },
  videoList: {
    backgroundColor:'#fff',
    paddingHorizontal:10
  },
  fullScreen: {
    width:'auto',
    height:240,
    position:'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  video: {
    position:'absolute',
    width:'auto',
    height:240
  },
  controls: {
    backgroundColor: 'transparent',
    borderRadius: 5,
    // position: 'absolute',
    // top:242,
    // left: 20,
    // right: 20,
  },
  progress: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 3,
    overflow: 'hidden',
  },
  innerProgressCompleted: {
    height: 10,
    backgroundColor: '#cccccc',
  },
  innerProgressRemaining: {
    height: 10,
    backgroundColor: '#2C2C2C',
  },
  generalControls: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 4,
    overflow: 'hidden',
    paddingBottom: 10,
  },
  rateControl: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  volumeControl: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  resizeModeControl: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlOption: {
    alignSelf: 'center',
    fontSize: 11,
    color: 'white',
    paddingLeft: 2,
    paddingRight: 2,
    lineHeight: 12,
  },
});


class Trailer extends Component {
    constructor(props){
        super(props);
        this.state = {
           rate: 1,
           volume: 1,
           muted: false,
           resizeMode: 'contain',
           duration: 0.0,
           currentTime: 0.0,
           paused: true,
           videoData:[],
           loading : true,
           nowVideo:{"resource_url":'http://croooo.com/code-test/test/douban-movie/staticData/static.mp4'}
        }
    }

    static navigationOptions = ({ navigation }) => ({
      title: navigation.state.params.title,
    });

    componentDidMount(){
        let { params } = this.props.navigation.state;
        let {id, videoData} = params;
        console.log(videoData)
        let nowVideo = this.getNowVideo(videoData, id);
        this.setState({
          nowVideo : nowVideo,
          videoData : videoData
        })
    }

    getVideoList(data){
      let nodes = data.map((dData, index) => {
        return (
          <TouchableOpacity
            style={[layoutStyles.flexRow,{marginTop:10}]}
            key={dData.id}
            onPress={()=>{
              this.setState({
                paused : true,
              });

              let nowVideo = this.getNowVideo(this.state.videoData, dData.id);
              this.video.seek(0);
              this.setState({
                loading : true,
                paused : false,
                nowVideo : nowVideo,
              })

            }}
          >

            <View style={layoutStyles.flex2}>
              <Image
                resizeMode="contain"
                source={{uri:dData.medium}}
                style={{width:140, height:100}}
              />
            </View>

            <View style={layoutStyles.flex3}>
              <Text>{dData.title}</Text>
            </View>

          </TouchableOpacity>
        );
      });

      return(
        <View style={styles.videoList}>
          {nodes}
        </View>
      );
    }

    getNowVideo = (data, vId) => {
      let nowVideo = '';
      for(let i = 0; i < data.length;i++){
        if(data[i].id == vId){
          nowVideo = data[i];
        }
      }
      return nowVideo;
    }

    // 开始加载的回调函数
    loadStart = () => {
      console.log('loadStart');
    }

    // 视频载入时回调， 设置 总时长
    onLoad = (data) => {
      console.log('onLoad'); //加载完成 开始自动播放
      this.setState({
        loading: false,
        paused: false,
        duration: data.duration
      });
    };

    // 每250毫秒进行一次回调， 设置当前时间
    onProgress = (data) => {
      this.setState({ currentTime: data.currentTime });
    };

    // 视频播放完成以后， 设置pasued为true, 视频跳转到 0即 开始位置
    onEnd = () => {
      this.setState({ paused: true })
      this.video.seek(0)
    };

    onAudioBecomingNoisy = () => {
      this.setState({ paused: true })
    };

    onAudioFocusChanged = (event: { hasAudioFocus: boolean }) => {
      this.setState({ paused: !event.hasAudioFocus })
    };

    // 视频错误
    videoError = () => {
      Toast.info('网络错误', 1);
    }

    // 获取当前时长的百分比
    getCurrentTimePercentage() {
      if (this.state.currentTime > 0) {
        return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
      }
      return 0;
    };

    getCurrentTimeByNum = (num) => {
      return this.state.duration * (num / 100)
    }

    // 渲染  速率控制区
    renderRateControl(rate) {
      const isSelected = (this.state.rate === rate);

      return (
        <TouchableOpacity onPress={() => { this.setState({ rate }) }}>
          <Text style={[styles.controlOption, { fontWeight: isSelected ? 'bold' : 'normal' }]}>
            {rate}x
          </Text>
        </TouchableOpacity>
      );
    }

    //渲染 缩放模式控制区
    renderResizeModeControl(resizeMode) {
      const isSelected = (this.state.resizeMode === resizeMode);
      return (
        <TouchableOpacity onPress={() => { this.setState({ resizeMode }) }}>
          <Text style={[styles.controlOption, { fontWeight: isSelected ? 'bold' : 'normal' }]}>
            {resizeMode}
          </Text>
        </TouchableOpacity>
      )
    }

    //渲染 音量控制
    renderVolumeControl(volume) {
      const isSelected = (this.state.volume === volume);

      return (
        <TouchableOpacity onPress={() => { this.setState({ volume }) }}>
          <Text style={[styles.controlOption, { fontWeight: isSelected ? 'bold' : 'normal' }]}>
            {volume * 100}%
          </Text>
        </TouchableOpacity>
      )
    }

    render(){
      const flexCompleted = this.getCurrentTimePercentage() * 100; //进度条已完成多少
      const flexRemaining = (1 - this.getCurrentTimePercentage()) * 100; // 进度条剩余多少
      let {nowVideo, videoData} = this.state;
      let controlBtn = this.state.paused
      ? <Icon type={'\ue604'} size="md" color="#fff" />
      : <Icon type={'\ue63D'} size="md" color="#fff" />;
      let videoListNode = this.getVideoList(videoData);
      // <TouchableOpacity style={{marginTop:50}} onPrsss={()=>{this.video.presentFullscreenPlayer()}}>
      //   <Text style={{color:'#fff'}}>全屏</Text>
      // </TouchableOpacity>
      // <View style={styles.trackingControls}>
      //   <View style={styles.progress}>
      //     <View style={[styles.innerProgressCompleted, { flex: flexCompleted }]} />
      //     <View style={[styles.innerProgressRemaining, { flex: flexRemaining }]} />
      //   </View>
      // </View>
      //
      //   <View style={styles.generalControls}>
      //     <View style={styles.rateControl}>
      //       <Text>速率</Text>
      //       {this.renderRateControl(0.25)}
      //       {this.renderRateControl(0.5)}
      //       {this.renderRateControl(1.0)}
      //       {this.renderRateControl(1.5)}
      //       {this.renderRateControl(2.0)}
      //     </View>
      //
      //     <View style={styles.volumeControl}>
      //       <Text>音量</Text>
      //       {this.renderVolumeControl(0.5)}
      //       {this.renderVolumeControl(1)}
      //       {this.renderVolumeControl(1.5)}
      //     </View>
      //
      //     <View style={styles.resizeModeControl}>
      //       <Text>缩放</Text>
      //       {this.renderResizeModeControl('cover')}
      //       {this.renderResizeModeControl('contain')}
      //       {this.renderResizeModeControl('stretch')}
      //     </View>
      //   </View>
      return (
        <View style={styles.container}>
          <ScrollView>
           <TouchableOpacity
             style={[styles.fullScreen, layoutStyles.flexRow]}
             onPress={() => this.setState({ paused: !this.state.paused })}
           >
             <Video
               ref={(ref: Video) => { this.video = ref }}
               source={{uri:nowVideo.resource_url}}
               style={styles.video}
               rate={this.state.rate}
               paused={this.state.paused}
               volume={this.state.volume}
               muted={this.state.muted}
               resizeMode={this.state.resizeMode}
               onLoadStart={this.loadStart}
               onLoad={this.onLoad}
               onProgress={this.onProgress}
               onEnd={this.onEnd}
               onAudioBecomingNoisy={this.onAudioBecomingNoisy}
               onAudioFocusChanged={this.onAudioFocusChanged}
               repeat={false}
               onError={this.videoError}
             />
            {
              this.state.loading &&
              <View style={styles.postWrap}>
                <Image
                  resizeMode="cover"
                  style={{width:'auto',height: 240}}
                  source={{uri:nowVideo.medium}}
                />
              </View>
            }

            <ActivityIndicator
              style={styles.loading}
              animating={this.state.loading}
              color="white"
              size="large"
            />
           </TouchableOpacity>

           <View style={styles.controls}>
             <View style={layoutStyles.flexRow}>
                <TouchableOpacity
                  onPress={() => {
                    let {paused} = this.state;
                    this.setState({ paused: !paused})
                  }}
                >
                  {controlBtn}
                </TouchableOpacity>
               <Slider
                 style={layoutStyles.flex1}
                 maximumTrackTintColor="#fff"
                 minimumTrackTintColor="#ddd"
                 thumbTintColor="#fff"
                 maximumValue={100}
                 minimumValue={0}
                 step={1}
                 value={flexCompleted}
                 onSlidingComplete={ (value) => {
                   let currentTime = this.getCurrentTimeByNum(value);
                   this.setState({ currentTime : currentTime})
                 }}
                 />
               <TouchableOpacity
                 onPress={() => {
                   this.video.presentFullscreenPlayer()
                 }}
               >
                  <Icon type={'\ue615'} size="md" color="#fff" />
               </TouchableOpacity>
             </View>

           </View>

           {videoListNode}
          </ScrollView>
         </View>
        )
    }
}

export default Trailer;
