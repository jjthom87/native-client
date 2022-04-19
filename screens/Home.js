import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View>
      <Button
        title="Go to Signup Page"
        onPress={() =>
          navigation.navigate('Signup')
        }
      />
      <Button
        title="Go to Signin Page"
        onPress={() =>
          navigation.navigate('Signin')
        }
      />
    </View>
  );
};

export default HomeScreen
