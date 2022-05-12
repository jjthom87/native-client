import React, { Component, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, TouchableHighlight, Button } from 'react-native'
import axios from 'axios';
import * as Keychain from 'react-native-keychain';

const ListItinerariesScreen = ({ navigation, route }) => {
  const [itineraries, setItineraries] = useState([]);
  const [authUser, setAuthUser] = useState(null);
  const [initialItineraryLoad, setInitialItineraryLoad] = useState(false)
  const [itineraryToShow, setItineraryToShow] = useState('')

  useEffect(() => {
    if(!initialItineraryLoad){
      Keychain.getGenericPassword().then((credentials) => {
        var {username, password} = credentials;
        setAuthUser(username)
        axios.get('http://localhost:7000/api/itinerary', {
          headers: {authorization: password}
        }).then((response) => {
          response.data.itineraries.forEach((itinerary) => {
            itinerary.details = JSON.parse(itinerary.details)
          })
          setItineraries(response.data.itineraries)
          setInitialItineraryLoad(true)
        }).catch((err) => {
          console.error(err)
        })
      })
    }
  })
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
  handleItineraryClick = (itineraryName) => {
    itineraries.forEach((itinerary) => {
      if(itinerary.name == itineraryName){
        if(itinerary.name != itineraryToShow){
          setItineraryToShow(itineraryName)
        } else {
          setItineraryToShow("")
        }
      }
    })
    setItineraries(itineraries)
  }
  showItinerary = (itinerary) => {
    const display = itinerary.name == itineraryToShow ? "flex" : "none"
    return itinerary.details.map((place) => {
      return (
        <View style={{backgroundColor: 'red'}}>
         <Text
          style={{display: display, margin: 5}}
         >{place.name}</Text>
        </View>
      )
    })
  }
  mapItineraries = () => {
    return itineraries.map((itinerary) => {
      return (
        <View>
          <TouchableOpacity style = {styles.itineraryNameButton}>
             <Text onPress={() => this.handleItineraryClick(itinerary.name)} style = {styles.itineraryNameText}>{itinerary.name} <Text onPress = {() => this.handleShareClick(itinerary)} style = {styles.shareText}>Share</Text></Text>
             {showItinerary(itinerary)}
          </TouchableOpacity>
        </View>
      )
    })
  }
  handleShareClick = (itinerary) => {
    navigation.push("Share Itineraries", {itinerary: itinerary})
  }
  render: {
    return (
      <View style={styles.container}>
        <Text>{authUser}'s Itineraries</Text>
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
export default ListItinerariesScreen

const styles = StyleSheet.create({
   container: {
       paddingTop: 23
   },
   itineraryNameButton: {
     backgroundColor: "#501fe0",
     padding: 10,
     margin: 15
   },
   itineraryNameText: {
     color: "black"
   },
   shareText: {
     color: "blue",
     backgroundColor: "yellow"
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
