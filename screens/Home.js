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
    Keychain.resetGenericPassword().then((res) => {
      axios.delete("http://localhost:7000/api/logout").then((response) => {
        navigation.push("Main")
      }).catch((error) => {
        console.log("Error during Signout")
      })
    }).catch((err) => {
      console.log("Error during keychain reset")
    })
  }
  render: {
    return (
      <View style={styles.container}>
        <Text>Welcome {user.email}</Text>
        <TouchableOpacity style = {styles.createItineraryButton}>
           <Text onPress={() => navigation.push('CreateItinerary')} style = {styles.createItineraryButtonText}>Create Itinerary</Text>
        </TouchableOpacity>
        <Button
          title="Logout"
          buttonStyle={styles.logoutButton}
          onPress={() => this.signOut()}
        />
      </View>
    )
  }
}
export default HomeScreen

const styles = StyleSheet.create({
   container: {
       paddingTop: 23
   },
   createItineraryButton: {
     backgroundColor: "#501fe0",
     padding: 10,
     margin: 15,
     height: 40,
   },
   createItineraryButtonText: {
     color: "black"
   },
   logoutButton: {
      backgroundColor: '#1E6738',
      color: 'white',
      padding: 10,
      margin: 15,
      height: 40,
   },
   mainButton: {
      backgroundColor: '#1E6738',
      padding: 10,
      margin: 15,
      height: 40,
   }
})
