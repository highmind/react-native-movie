import React,{Component} from 'react';
import Comment from './Comment';
import {
  View,
  Text
} from 'react-native';

class CommentList extends Component{
  constructor(props){
    super(props)
  }

  render(){
    let nodes = <View>
    <Text>暂无数据</Text>
    </View>;
    if(this.props.data.length != 0){
      nodes = this.props.data.map((dData, index) =>{
        return(
          <Comment key={dData.id} data={dData} />
        )
      });
    }

    return(
      <View>
          {nodes}
      </View>
    );
  }
}

export default CommentList;
