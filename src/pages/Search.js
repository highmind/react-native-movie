import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, TextInput} from 'react-native';
import {Toast} from 'antd-mobile';
import {debounce} from 'lodash';
import * as utils from '../utils';
import {layoutStyles} from '../styles/layout';
import {Button, ListItem, SearchList, SearchTextList} from '../components/';
import Storage from 'react-native-storage';
import {AsyncStorage} from 'react-native';

const storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: 1000 * 3600 * 24,
  enableCache: true
});

global.storage = storage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  searchTop: {
    paddingHorizontal: 10,
    paddingVertical: 14,
    backgroundColor: '#fafafa'
  },
  searchInput: {
    height: 32,
    borderRadius: 20,
    margin: 0,
    padding: 0,
    paddingLeft: 14,
    backgroundColor: '#ebebeb'
  },
  searchGoBack: {
    width: 60,
    alignItems: 'center',
    paddingVertical: 6
  },
  searchTitle: {
    marginLeft:20, fontSize:16, marginVertical:10
  }
});

class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchTxt: '', //搜索词
      searchTxtList: []
    }
  }

  static navigationOptions = ({navigation}) => ({
    header: null, //设置为null,则隐藏header
  });

  componentDidMount() {
    // 组件加载时，从本地缓存 加载搜索列表
    this.getSearchTxtList();
  }

  componentWillUnmount() {
    console.log('... componentWillUnmount ...');
    Toast.hide();
  }

  saveSearchTxt = () => {  // 点击 键盘完成按钮时，提取搜索词 存入本地缓存
    let {searchTxt, searchTxtList} = this.state;
    if(utils.trim(searchTxt) == ''){ // 如果搜索词为空，则终止
      return;
    }
    searchTxtList.unshift(searchTxt); // 将搜索词添加到数组头部

    storage.save({
      key: 'searchTxtList', // 注意:请不要在key中使用_下划线符号!
      data: {
        content: searchTxtList
      },
      expires: null, //永不过期
    });
  }

  getSearchTxtList = () => { // 组件didMount时，加载本地缓存搜索词列表，并设置state
    storage.load({
      key: 'searchTxtList'
    }).then((ret) => {
      this.setState({
        searchTxtList: ret.content
      });
    }).catch(err => {
      //console.warn(err.message);
    })
  }

  clearSearchTxtList = () => {  // 清除本地缓存的搜索词，并设置state，使UI刷新
    storage.remove({
      key: 'searchTxtList'
    });
    this.setState({
      searchTxtList : []
    })
  }


  render() {
    let {searchTxt, searchTxtList} = this.state;
    // 搜索词为空的时候，隐藏搜索结果列表
    let searchListStyle = searchTxt == ''
      ? {
        width: 0,
        height: 0
      }
      : {flex:1};
    // 搜索词不为空的时候， 显示 搜索词列表
    let textListStyle = searchTxt == ''
      ? null
      : {
        width: 0,
        height: 0
      };
    //本地缓存中列表为空，隐藏搜索词列表
    let textListStyle2 = searchTxtList.length == 0
      ? {
        width: 0,
        height: 0
      }
      : null;

    const {navigate, goBack} = this.props.navigation;
    return (
      <View style={styles.container}>
        <View style={[layoutStyles.flexRow, styles.searchTop]}>
          <View style={layoutStyles.flex6}>
            <TextInput
              style={styles.searchInput}
              autoFocus={true}
              placeholder="找影视剧"
              underlineColorAndroid="transparent"
              onEndEditing={() => {
                console.log('编辑结束');
                this.saveSearchTxt();
              }}
              onChangeText={(text) => {
                this.setState({searchTxt: text});
              }}
              value={this.state.searchTxt} />
          </View>

          <TouchableOpacity
            style={[layoutStyles.flex1, styles.searchGoBack]}
            onPress={() => {goBack();}}>
            <Text style={{color: '#f2554f'}}>取消</Text>
          </TouchableOpacity>

        </View>

        <View style={[textListStyle, textListStyle2]}>
          <Text style={styles.searchTitle}>最近搜索</Text>
          <SearchTextList
            clear={this.clearSearchTxtList}
            onPress={(text) => {
              this.setState({
                searchTxt : text
              })
            }}
            data={searchTxtList.slice(0, 6)} />
        </View>

        <View style={searchListStyle}>
          <SearchList text={this.state.searchTxt} {...this.props}/>
        </View>

      </View>
    );

  }

}

export default Search;
