import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff'
  },
});

class Celebrity extends Component {

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
                <Text>ID：{params.id}</Text>
                <Text>影人：{params.title}</Text>
            </View>
        )
    }
}

export default Celebrity;
