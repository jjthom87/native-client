import React, { Component, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, TouchableHighlight, Button } from 'react-native'
import axios from 'axios';
import * as Keychain from 'react-native-keychain';

const ListUsersItinerariesScreen = ({ navigation, route }) => {
  const [itineraries, setItineraries] = useState([]);
  const [authUser, setAuthUser] = useState(null);
  const [initialItineraryLoad, setInitialItineraryLoad] = useState(false)
  const [itineraryToShow, setItineraryToShow] = useState('')

  useEffect(() => {
    if(!initialItineraryLoad){
      Keychain.getGenericPassword().then((credentials) => {
        var {username, password} = credentials;
        setAuthUser(username)
        axios.get('http://localhost:7000/api/user/'+route.params.user.id+'/itinerary', {
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

    }

  },[])
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
  handleAddItineraryClick = (itinerary_id) => {
    Keychain.getGenericPassword().then((credentials) => {
      var {username, password} = credentials;
      axios.post("http://localhost:7000/api/itinerary/shared",
          {
            owner_id: parseInt(route.params.user.id),
            requester_id: parseInt(authUser.id),
            itinerary_id: parseInt(itinerary_id),
            approved: true
          }, {
            headers: {
              authorization: password,
              'Content-Type': 'application/json'
          }
        }).then((response) => {
        // console.log(response)
  		}).catch((error) => {
        console.log(error)
  			console.log("Error during Signin")
  		})
    })
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
             <Text onPress={() => this.handleItineraryClick(itinerary.name)} style = {styles.itineraryNameText}>{itinerary.name}
              <Text onPress={() => this.handleAddItineraryClick(itinerary.id)} style = {styles.addItineraryText}>+</Text>
             </Text>
             {showItinerary(itinerary)}
          </TouchableOpacity>

        </View>
      )
    })
  }
  render: {
    return (
      <View style={styles.container}>
        <Text>{route.params.user.email}'s Itineraries</Text>
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
export default ListUsersItinerariesScreen

const styles = StyleSheet.create({
   container: {
       paddingTop: 23
   },
   itineraryNameButton: {
     backgroundColor: "#501fe0",
     padding: 10,
     margin: 15,
     display: "flex"
   },
   itineraryNameText: {
     color: "black"
   },
   addItineraryText: {
     backgroundColor: "yellow",
     color: "black",
     width: 10
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
