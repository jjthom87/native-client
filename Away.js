import React, { Component } from 'react';
import { NavigatorIOS, View, Text } from 'react-native';
import Home from './Home.js';

export default class Away extends Component {
  _handleNextPress() {
    this.props.navigator.push({
      component: Home,
      title: 'Go Home'
    });
  }
  render(){
    return (
      <View>
        <Text>I am Away</Text>
        <Button
          title="Go to Home Page"
          onPress={() => this._handleNextPress}
        />
      </View>
    )
  }
};

module.exports = Away;
