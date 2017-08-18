import React, {Component, PropTypes} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

const styles = StyleSheet.create({
  tag: {
    fontSize:12,
    borderRadius:3,
    paddingHorizontal:2,
    paddingVertical:2,
    textAlign:'center'
  },
  tagIsPlain: {
    borderWidth:1,
    borderColor:'#fff',
    backgroundColor:'rgba(0,0,0,0)',
  }
});

class Tag extends Component{

  static defaultProps = { //默认属性设置
    style : '', //用于自定义样式
    isPlain : false,   //是否是空心按钮
    clickEvent : () => {} //按钮点击事件，默认为空
  }

  constructor(props){
    super(props);
  }

  render(){
    let {style, isPlain} = this.props;
    let isPlainStyle = isPlain ? styles.tagIsPlain : null;
    let finalStyle = [styles.tag, style, isPlainStyle];
    return (
      <TouchableOpacity onPress={this.clickEvent}>
        <Text style={finalStyle}>
          {this.props.children}
        </Text>
      </TouchableOpacity>
    );
  }

}

export default Tag;
