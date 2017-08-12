import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

class TestList extends Component {
    constructor(props){
        super(props);
    }


    render(){
      let nodes = this.props.data.map((dData, index) => {
        return(
          <Text key={dData.id}>{dData.title}</Text>
        )
      });

      return (
        <View>
        {nodes}

        </View>
      )
    }
}

export default TestList;
