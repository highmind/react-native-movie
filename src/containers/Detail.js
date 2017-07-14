import React,{Component} from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import {Toast} from 'antd-mobile';

const styles = StyleSheet.create({
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
      title:''
    }
  }

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
  });

  componentDidMount(){
    Toast.loading('Loading...', 0);
    const { params } = this.props.navigation.state;
    let url = `http://api.douban.com/v2/movie/subject/${params.id}?apikey=0b2bdeda43b5688921839c8ecb20399b&city=%E5%8C%97%E4%BA%AC`;
    fetch(url)
    .then((res) => {return res.json()})
    .then((resTxt) => {
      Toast.hide();
      this.setState({
        title:resTxt.title
      })
    })
  }

  render(){

    return (
      <View>
        <Text>{this.state.title}</Text>
      </View>
    )

  }
}

export default Detail;
