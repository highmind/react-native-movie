import React,{Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';
import * as utils from '../utils';
import { Button } from './';
import { layoutStyles } from '../styles/layout';

const styles = StyleSheet.create({
  itemTitle:{
    fontSize:18,
  },
  itemWrap:{
    flexDirection: 'row',
    padding:10
  },
  score:{
    color: '#ffc600',
    fontWeight: 'bold',
    fontSize:15
  },
});


class ListItem extends Component {
  render(){
    let { data } = this.props;
    let { navigate } = this.props.navigation;
    return (
      <TouchableOpacity activeOpacity={0.8}  onPress={()=> {
        navigate('Detail', { id: data.id, title: data.title });}}>
        <View style={[layoutStyles.flexRow,styles.itemWrap]}>

         <View style={layoutStyles.flex2}>
           <Image source={{uri:data.images.medium}}
             style={{width:87, height: 120}}
             resizeMode="contain" />
         </View>

         <View style={[layoutStyles.flex4,{paddingHorizontal:6}]}>
            <Text style={styles.itemTitle}>{data.title}</Text>
            <Text>{data.genres.join('/')}</Text>
            <Text>导演:{utils.getDirector(data.directors)}</Text>
            <Text>{utils.getActor(data.casts)}</Text>
            <Text>{utils.getPubDate(data.pubdates)}</Text>
         </View>

         <View style={[layoutStyles.flex2, layoutStyles.flexColumn, {alignItems:'flex-end'}]}>

           <View>
             <Text style={[styles.score,layoutStyles.txtRight]}>
              {utils.getScore(data.rating.average)}
             </Text>
           </View>
           <View style={{marginTop:30}}>
             <Button style={{width:60}} onPress={()=> {
              navigate('Detail', { id: data.id, title: data.title });}}
              title="更多" color="#EF4238" />
           </View>

         </View>

       </View>
      </TouchableOpacity>
    )
  }

}

export default ListItem;
