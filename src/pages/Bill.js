import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

class Bill extends Component {
    constructor(props){
        super(props);
    }
    
    componentDidMount(){
        console.log('... Bill didMount');
    }

    render(){
        return (
            <View>
                <Text>Bill</Text>
            </View>
        )
    }
}

export default Bill
