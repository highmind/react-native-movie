import React,{Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import * as utils from '../utils';
import { layoutStyles } from '../styles/layout';

const styles = StyleSheet.create({
  itemTitle:{
    fontSize:18,
  },
  itemWrap:{
    padding:10
  },
});


const SearchTextList = (props) => {
  let { data, onPress } = props;
  let nodes = data.map((dData, index) => {
    return (
      <TouchableOpacity key={index} activeOpacity={0.8}  onPress={onPress(dData)}>
        <View style={[layoutStyles.flexRow,styles.itemWrap]}>
          <Text>{dData}</Text>
        </View>
      </TouchableOpacity>
    )
  });
  return (
    <View>
      {nodes}
    </View>
  )
}

export default SearchTextList;
