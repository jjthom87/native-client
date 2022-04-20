import React, { Component, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as Keychain from 'react-native-keychain';
import axios from 'axios';

const MainScreen = ({ navigation, route }) => {
  const [authUser, setAuthUser] = useState(false);

  useEffect(() => {
    Keychain.getGenericPassword().then((credentials) => {
      var {username, password} = credentials;
      axios.get('http://localhost:7000/api/signed-in', {
        headers: {authorization: password}
      }).then((response) => {
        if(response.config.data != undefined){
          setAuthUser(true)
          navigation.push("Home")
        } else {
          Keychain.resetGenericPassword();
        }
      }).catch((err) => {
        console.log("no logged in user")
        console.log(err)
      })
    })
  }, [authUser])
  signOut = () => {
    Keychain.resetGenericPassword();
    return axios.delete("http://localhost:7000/api/logout").then((response) => {
      setAuthUser(false)
    }).catch((error) => {
      console.log("Error during Signout")
    })
  }
  renderAuth = () => {
    if(authUser){
      return (
        <Button
          title="Logout"
          style={styles.logoutButton}
          onPress={() => this.signOut()}
        />
      )
    } else {
      return ( <View></View> )
    }
  }
  render: {
    return (
      <View>
        <Button
          title="Sign Up"
          onPress={() =>
            navigation.push('Signup')
          }
        />
        <Button
          title="Sign In"
          onPress={() =>
            navigation.push('Signin')
          }
        />
      </View>
    )
  }
};

const styles = StyleSheet.create({
   logoutButton: {
      backgroundColor: 'red',
      color: 'white',
      padding: 10,
      margin: 15,
      height: 40,
   }
})

export default MainScreen
