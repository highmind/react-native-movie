import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView
} from 'react-native';

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff'
  },
});

class Review extends Component {

    constructor(props){
        super(props);
    }

    static navigationOptions = ({ navigation }) => ({
      title: navigation.state.params.title,
    });

    componentDidMount(){
        const { params } = this.props.navigation.state; //从上个 screen 传过来的参数
        console.log(params);
    }

    render(){
        let {params} = this.props.navigation.state;
        return (
            <View style={styles.containers}>
              <Text>短评</Text>
            </View>
        )
    }
}

export default Review;
