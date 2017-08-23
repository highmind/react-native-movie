import React,{Component} from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
} from 'react-native';

const styles = StyleSheet.create({
  btn : {
    borderRadius:3,
    alignItems:'center',
    paddingVertical:6
  },
  btnText : {
    color:'#fff'
  }
});

class Button extends Component{
  render(){
    let {color, title, style} = this.props;
    return (
        <TouchableHighlight
          style={[styles.btn, {backgroundColor:color}, style]}
          onPress={this.props.onPress}
        >
          <Text style={styles.btnText}>{title}</Text>
        </TouchableHighlight>
    )
  }
}

export default Button;
