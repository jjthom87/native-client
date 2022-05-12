import React, { Component, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, TouchableHighlight, Button } from 'react-native'
import axios from 'axios';
import * as Keychain from 'react-native-keychain';

const PendingItinerariesScreen = ({ navigation, route }) => {
  const [itineraries, setItineraries] = useState([]);
  const [authUser, setAuthUser] = useState({});
  const [initialItineraryLoad, setInitialItineraryLoad] = useState(false)
  const [itineraryToShow, setItineraryToShow] = useState('')

  useEffect(() => {

    if(!initialItineraryLoad){
      Keychain.getGenericPassword().then((credentials) => {

        var {username, password} = credentials;
        axios.get('http://localhost:7000/api/signed-in', {
          headers: {authorization: password}
        }).then((response) => {
          setAuthUser(response.data.user)
        }).catch((err) => {
          navigation.push("Main")
        })

        axios.get('http://localhost:7000/api/itinerary/shared?approved=false', {
          headers: {authorization: password}
        }).then((response) => {
          if(response.data.itineraries.length > 0){
            response.data.itineraries.forEach((itinerary) => {
              itinerary.details = JSON.parse(itinerary.details)
            })
            setItineraries(response.data.itineraries)
          } else {
            setItineraries([])
          }
          setInitialItineraryLoad(true)
        }).catch((err) => {
          console.log(err)
        });

      });
    }
  },[itineraries])
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
  setApproval = (itinerary_id, approved) => {
    Keychain.getGenericPassword().then((credentials) => {
      var {username, password} = credentials;
      axios.put("http://localhost:7000/api/itinerary/shared",
          {
            requester_id: parseInt(authUser.id),
            itinerary_id: parseInt(itinerary_id),
            approved: approved
          }, {
            headers: {
              authorization: password,
              'Content-Type': 'application/json'
          }
        }).then((response) => {
          const updatedItineraries = itineraries.filter((itinerary) => itinerary.id != response.data.itinerary_id)
          setItineraries(updatedItineraries)
      }).catch((error) => {
        console.log(error)
        console.log("Error during Signin")
      })
    })
  }
  mapItineraries = () => {
    if(itineraries.length > 0){
      return itineraries.map((itinerary) => {
        return (
          <View>
            <TouchableOpacity style = {styles.itineraryNameButton}>
               <Text style = {styles.itineraryNameText}>{itinerary.name} - Owned by {itinerary.owner_email}</Text>
               <Text style={{color: "green"}} onPress={() => this.setApproval(itinerary.id, true)}>Approve</Text>
               <Text style={{color: "red"}} onPress={() => this.setApproval(itinerary.id, false)}>Reject</Text>
            </TouchableOpacity>
          </View>
        )
      })
    } else {
      return (
        <View></View>
      )
    }
  }
  render: {
    return (
      <View style={styles.container}>
        <Text>{authUser.email}'s Pending Itineraries</Text>
        {mapItineraries()}
        <TouchableOpacity style = {styles.homeButton}>
           <Text onPress={() => navigation.push('Home')} style = {styles.homeButtonText}>Home</Text>
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
export default PendingItinerariesScreen

const styles = StyleSheet.create({
   container: {
       paddingTop: 23
   },
   itineraryNameButton: {
     backgroundColor: "pink",
     padding: 10,
     margin: 15
   },
   itineraryNameText: {
     color: "black"
   },
   homeButton: {
     margin: 20
   },
   homeButtonText: {
     color: "blue"
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
