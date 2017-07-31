import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

class Celebrity extends Component {

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
        return (
            <View>
                <Text>影人</Text>
            </View>
        )
    }
}

export default Celebrity
