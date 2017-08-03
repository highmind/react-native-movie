import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

class Video extends Component {
    constructor(props){
        super(props);
    }

    static navigationOptions = ({ navigation }) => ({
      title: navigation.state.params.title,
    });

    componentDidMount(){
        const { params } = this.props.navigation.state;
        console.log(params);
    }

    render(){
      let {params} = this.props.navigation.state;
        return (
            <View>
                <Text>ID：{params.id}</Text>
                <Text>名称：{params.title}</Text>
            </View>
        )
    }
}

export default Video;
