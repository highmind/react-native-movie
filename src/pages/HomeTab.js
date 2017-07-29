import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

class HomeTab extends Component {

    constructor(props){
        super(props);
    }
    
    componentDidMount(){
        console.log('... HomeTab didMount');
    }

    render(){
        return (
            <View>
                <Text>HomeTab</Text>
            </View>
        )
    }
}

export default HomeTab
