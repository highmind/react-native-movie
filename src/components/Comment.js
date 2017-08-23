import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

import { layoutStyles } from '../styles/layout';

const styles = StyleSheet.create({
  comment:{borderBottomWidth:1, borderStyle:'solid', borderBottomColor:'#ddd',marginBottom:16},
  commentHead:{marginTop:6},
  commentTitle:{color:'#999', fontSize:16},
  commentUserName:{marginLeft:10, fontSize:14, color:'#999'},
  commentUser:{marginTop:14,},
  commentUserPhoto:{width:40, height:40, borderRadius:20},
  commentScore:{color:'#ffc600', fontSize:18, }
});

class Comment extends Component{
  constructor(props){
    super(props)
  }

  render(){
    let {
      rating={},
      author={},
      content,
      created_at
    } = this.props.data;
    return(
      <View style={styles.comment}>
        <View style={[styles.commentHead, layoutStyles.flexRow]}>
          <View style={layoutStyles.flex1}>
            <Image
              source={{uri:author.avatar}}
              style={styles.commentUserPhoto}
             />
          </View>
          <View style={[layoutStyles.flex5, {justifyContent: 'center'}]}>
            <Text>{author.name}</Text>
            <Text>{created_at}</Text>
          </View>
          <View style={[layoutStyles.flex1, {justifyContent: 'center'}]}>
            <Text style={styles.commentScore}>{rating.value}分</Text>
          </View>
        </View>

        <View>
          <Text style={[layoutStyles.paragraph, {lineHeight:22}]}>
            {content}
          </Text>
        </View>

      </View>
    );
  }
}

export default Comment;
