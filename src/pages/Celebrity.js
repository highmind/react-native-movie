import React, {Component} from 'react';
import {StyleSheet, Text, View, ImageBackground, TouchableOpacity, Image, ScrollView} from 'react-native';
import {Toast, Icon} from 'antd-mobile';
import {Tag} from '../components/';
import * as utils from '../utils';
import {layoutStyles} from '../styles/layout';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  head:{
    paddingLeft:10,
    paddingTop:30
  },
  tag:{
     color:'#fff',
     width:36,
     height:22,
     marginRight:4,
     marginBottom:4
  },
  main:{
    paddingTop:10,
    paddingLeft:16,
    paddingBottom:10,
    paddingRight:16,
  },

});

class Celebrity extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading : false,
      data : [],
      isOpen : false,
      viewRef: null
    }
  }

  static navigationOptions = ({navigation}) => ({title: navigation.state.params.title});

  componentDidMount() {
    this.setState({loading : true})
    Toast.loading('Loading...', 0);
    let {params} = this.props.navigation.state;
    let url = `http://api.douban.com/v2/movie/celebrity/${params.id}?apikey=0b2bdeda43b5688921839c8ecb20399b&city=%E5%8C%97%E4%BA%AC`;
    fetch(url)
    .then((res) => {return res.json()})
    .then((resTxt) => {
      Toast.hide();
      let {works, born_place, professions, photos} = resTxt; //取出要处理的特殊格式数据

      let formatData = {                             //生成相应json数据
        "listNode" : this.getList(works),
        "bornNode" : utils.getBorn(born_place),
        "tagNode"  : this.getTagNode(professions)
      }

      this.setState({
          data : Object.assign({}, resTxt, formatData),  //将新处理生成的数据与原始数据合并
          loading : false
      });
    })
  }


  getTagNode = (data) => {
    let nodes = data.map((dData,index) => {
      return (
        <Tag key={index} style={styles.tag} isPlain>{dData}</Tag>
      );
    });
    return nodes;
  }

  getList = (data) => {
    let nodes = <Text>暂无数据</Text>;
    if(data.length != 0){
      nodes = data.map((dData, index) => {
        let {mainland_pubdate:pubdate, year} = dData.subject;
        return(
          <Text key={index}>{pubdate}</Text>
        );
      });
    }

    return(
      <View>
        {nodes}
      </View>
    )
  }

  changeSummary = () => {
    let {isOpen} = this.state;
    console.log(isOpen)
    this.setState({
      isOpen : !isOpen
    });
  }


  render() {
    let {loading} = this.state;
    if(!loading){
      let {
        avatars={},
        name,
        name_en,
        birthday,
        gender,
        constellation,
        summary,
        listNode,
        bornNode,
        tagNode,
        photoNode
      } = this.state.data;
      let summaryStyle = this.state.isOpen ? null : 4;
      let IconNode = this.state.isOpen ? <Icon type="up" size="md" color="black" /> :
      <Icon type="down" size="md" color="black" />;
      return (
        <View style={styles.container}>
          <ScrollView>

              <ImageBackground style={{width:'auto'}} source={require('../assets/celbg.png')}>

                <View style={[layoutStyles.flexRow, styles.head]}>

                  <View style={[layoutStyles.flex1]}>
                      <Image
                        resizeMode="contain"
                        source={{uri:avatars.medium}}
                        style={{width:120, height: 166}} />
                  </View>

                  <View style={[layoutStyles.flexColumn, layoutStyles.flex2, {paddingBottom:10,justifyContent:'flex-end'}]}>
                      <Text style={{color:'#fff'}}>
                        <Text>{name} </Text>
                        <Text>{name_en}</Text>
                      </Text>

                      <View style={[layoutStyles.flexRow, {marginTop:10, flexWrap:'wrap'}]}>
                        {tagNode}
                      </View>

                  </View>
                </View>

              </ImageBackground>

              <View style={styles.main}>
                <Text>
                  <Text>出生地: {bornNode}{'\n'}</Text>
                  <Text>生日: {birthday =='' ? '不详': birthday}{'\n'}</Text>
                  <Text>星座: {constellation =='' ? '不详': constellation}{'\n'}</Text>
                </Text>

                <TouchableOpacity activeOpacity={0.8}  onPress={this.changeSummary}>
                  <Text style={{lineHeight:24}} numberOfLines={summaryStyle}>简介 {summary == '' ? '暂无' : summary}</Text>
                  <View style={{alignItems: 'center'}}>
                      {IconNode}
                  </View>
                </TouchableOpacity>
              </View>

          </ScrollView>

        </View>
      )

  }

    return (
      <View></View>
    )
  }
}

export default Celebrity;
