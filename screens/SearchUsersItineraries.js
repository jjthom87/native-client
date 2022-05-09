import React, { Component, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, TouchableHighlight, Button } from 'react-native'
import axios from 'axios';
import * as Keychain from 'react-native-keychain';

const SearchUsersItineraries = ({ navigation, route }) => {
  const [users, setUsers] = useState([]);
  const [inputUserText, setInputUserText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:7000/api/users').then((response) => {
      setUsers(response.data.users)
    }).catch((err) => {
      console.error(err)
    })
  }, [])
  handleUserInputChange = function(text){
    if(text == ""){
      setFilteredUsers([])
    } else {
      const filterUsersFromInput = users.filter((user) => user.email.includes(text.toLowerCase()))
      setFilteredUsers(filterUsersFromInput)
    }
  }
  handleUserClick = (user) => {
    navigation.push("List Users Itineraries", {user: user})
  }
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
        <Text>Search Users Itineraries</Text>
        <TextInput
          style={styles.input}
          placeholder="Search User"
          onChangeText={this.handleUserInputChange}
        />
        {
          filteredUsers.map((user) => {
            return (
              <TouchableOpacity>
                <Text onPress={()=> this.handleUserClick(user)}>{user.email}</Text>
              </TouchableOpacity>
            )
          })
        }
        <Button
          title="Logout"
          buttonStyle={styles.logoutButton}
          onPress={() => this.signOut()}
        />
      </View>
    )
  }
}
export default SearchUsersItineraries

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
