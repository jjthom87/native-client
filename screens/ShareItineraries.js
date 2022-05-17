import React, { Component, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, TouchableHighlight, Button } from 'react-native'
import axios from 'axios';
import * as Keychain from 'react-native-keychain';

const ShareItineraries = ({ navigation, route }) => {
  const [users, setUsers] = useState([]);
  const [authUser, setAuthUser] = useState(null);
  const [inputUserText, setInputUserText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [itineraries, setItineraries] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:7000/api/users').then((response) => {
      setUsers(response.data.users)
    }).catch((err) => {
      console.error(err)
    })

    Keychain.getGenericPassword().then((credentials) => {
      var {username, password} = credentials;
      axios.get('http://localhost:7000/api/signed-in', {
        headers: {authorization: password}
      }).then((response) => {
        if(response.data != undefined){
          setAuthUser(response.data.user)
        } else {
          Keychain.resetGenericPassword();
        }
      }).catch((err) => {
        console.log("no logged in user")
        console.log(err)
      })
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
    Keychain.getGenericPassword().then((credentials) => {
      var {username, password} = credentials;
      axios.post("http://localhost:7000/api/itinerary/shared",
          {
            owner_id: parseInt(authUser.id),
            requester_id: parseInt(user.id),
            requester_email: user.email,
            itinerary_id: parseInt(route.params.itinerary.id),
            itinerary_name: route.params.itinerary.name,
            approved: false,
            shareRequest: true
          }, {
            headers: {
              authorization: password,
              'Content-Type': 'application/json'
          }
        }).then((response) => {
          //console.log(response)
      }).catch((error) => {
        console.log(error)
        console.log("Error during Signin")
      })
    })
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
        <Text>Share {route.params.itinerary.name} itinerary with User</Text>
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
export default ShareItineraries

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
