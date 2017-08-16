import React, {Component} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import * as utils from '../utils';
import {layoutStyles} from '../styles/layout';
import {Icon} from 'antd-mobile';

const styles = StyleSheet.create({
  textItem: {
    paddingVertical:6,
    marginHorizontal:20,
    alignItems:'center',
  }
});

class SearchTextList extends React.PureComponent {
  render(){
    let {data, onPress, clear} = this.props;
    let nodes = data.map((dData, index) => {
      return (
        <TouchableOpacity key={index} onPress={() => {
          onPress(dData);
        }} activeOpacity={0.8}>
          <View style={[layoutStyles.flexRow, styles.textItem]}>
            <Icon type={'\ue641'} size={12} color="#aaa" />
            <Text style={{paddingLeft:8}}>{dData}</Text>
          </View>
        </TouchableOpacity>
      )
    });

    return (
      <View>
        {nodes}
        <TouchableOpacity style={[layoutStyles.flexRow,{justifyContent:'center',alignItems:'center'}]}
          onPress={() => {
            clear();
          }} activeOpacity={0.8}>
          <Icon type={'\ue69F'} size={14} color="#aaa" />
          <Text>清除所有搜索记录</Text>
        </TouchableOpacity>
      </View>
    )
  }

}

export default SearchTextList;
