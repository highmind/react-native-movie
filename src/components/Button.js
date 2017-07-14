import React,{Component} from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  Alert
} from 'react-native';

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

class Button extends Component{
  render(){
    return (
        <TouchableHighlight style={styles.btn}
          onPress={()=> {
            Alert.alert(`你点击了按钮`,)
            }
        }>
          <Text style={styles.btnText}>Button</Text>
        </TouchableHighlight>
    )

  }
}

export default Button;
