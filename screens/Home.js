import React, { Component, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, TouchableHighlight, Button } from 'react-native'
import axios from 'axios';
import * as Keychain from 'react-native-keychain';

const HomeScreen = ({ navigation, route }) => {
  const [authUser, setAuthUser] = useState(false);
  const [user, setUser] = useState('');

  useEffect(() => {
    Keychain.getGenericPassword().then((credentials) => {
      var {username, password} = credentials;
      axios.get('http://localhost:7000/api/signed-in', {
        headers: {authorization: password}
      }).then((response) => {
        setAuthUser(true)
        setUser(response.data.user)
      }).catch((err) => {
        navigation.push("Main")
      })
    })
  }, [authUser])
  signOut = () => {
    Keychain.resetGenericPassword();
    return axios.delete("http://localhost:7000/api/logout").then((response) => {
      navigation.push("Main")
    }).catch((error) => {
      console.log("Error during Signout")
    })
  }
  render: {
    return (
      <View>
        <Text>Welcome {user.email}</Text>
        <Button
          title="Logout"
          style={styles.logoutButton}
          onPress={() => this.signOut()}
        />
      </View>
    )
  }
}
export default HomeScreen

const styles = StyleSheet.create({
   logoutButton: {
      backgroundColor: 'red',
      color: 'white',
      padding: 10,
      margin: 15,
      height: 40,
   }
})
