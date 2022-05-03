import React, { Component, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, TouchableHighlight, Button } from 'react-native'
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import Config from "react-native-config";

const CreateItinerary = ({ navigation, route }) => {
  const [usersRecs, setUsersRecs] = useState([]);
  const [googlePlacesSearchResults, setGooglePlacesSearchResults] = useState([]);
  const [itinerary, setItinerary] = useState([]);
  const [itineraryName, setItineraryName] = useState();

  const GOOGLE_PLACES_API_BASE_URL = 'https://maps.googleapis.com/maps/api/place'

  useEffect(() => {
  }, [])
  handlePlaceInputChange = async function(text){
    const apiUrl = `${GOOGLE_PLACES_API_BASE_URL}/autocomplete/json?key=${Config.GOOGLE_API_KEY}&input=${text}`

      try {
        const result = await axios.get(apiUrl)
        if (result) {
          setGooglePlacesSearchResults(result.data.predictions)
        }
      } catch (e) {
        console.log(e)
      }
  }
  handleItineraryNameInputChange = function(text){
    setItineraryName(text)
  }
  handleGooglePlaceClick = async (autocompleteResult) => {
    const apiUrl = `${GOOGLE_PLACES_API_BASE_URL}/details/json?place_id=${autocompleteResult.place_id}&key=${Config.GOOGLE_API_KEY}`
    try {
      const placeResult = await axios.get(apiUrl)
      if (placeResult) {
        const addedItinerary = {name: placeResult.data.result.name, place_id: placeResult.data.result.place_id}
        setItinerary(currentItinerary => [...currentItinerary, addedItinerary])
      }
    } catch (e) {
      console.log(e)
    }
  }
  handleDeleteDraftItineraryItem = (place_id) => {
    const updatedItinerary = itinerary.filter((item) => item.place_id != place_id)
    setItinerary(updatedItinerary)
  }
  handleCreateItinerary = () => {
    Keychain.getGenericPassword().then((credentials) => {
      var {username, password} = credentials;
      axios.post("http://localhost:7000/api/itinerary",
      JSON.stringify({
        itineraryName: itineraryName,
        details: itinerary
      }), {
          headers: {
            authorization: password,
            'Content-Type': 'application/json'
          }
        }).then((response) => {
        // console.log(response)
  		}).catch((error) => {
        // console.log(error)
  			console.log("Error during Signin")
  		})
    })
  }
  render: {
     return (
         <View style={styles.container}>
           <Button
             title="Go to Home Page"
             onPress={() =>
               navigation.push('Main')
             }
           />
           <TextInput
             style={styles.input}
             placeholder="Search Places"
             onChangeText={this.handlePlaceInputChange}
           />
           <View>
             {
               googlePlacesSearchResults.length > 0 ?
                 googlePlacesSearchResults.map((result, index) => {
                   return (
                     <TouchableOpacity key={index}>
                       <Text onPress={() => this.handleGooglePlaceClick(result)}>{result.description}</Text>
                     </TouchableOpacity>
                   )
                 }) : <View></View>
             }
           </View>
           <View style={styles.itinerarySection}>
              <Text style={styles.itinerarySectionHeaderText}>Itinerary</Text>
              <View style={styles.draftItinerary}>
                {
                  itinerary.length > 0 ?
                    itinerary.map((place, index) => {
                      return (
                        <View style={styles.draftItineraryItem}>
                            <Text>
                              <Text style={styles.draftItineraryItemText} key={place.place_id}>{place.name}</Text>
                              <TouchableOpacity>
                                <Text
                                  style={styles.deleteDraftItineraryItem}
                                  key={place.place_id}
                                  onPress={() => this.handleDeleteDraftItineraryItem(place.place_id)}>X</Text>
                              </TouchableOpacity>
                            </Text>
                        </View>
                      )
                    }) : <View></View>
                }
                {
                  itinerary.length > 0 ?
                    <View>
                      <TextInput
                        style={styles.input}
                        placeholder="Itinerary Name"
                        onChangeText={this.handleItineraryNameInputChange}
                      />
                      <TouchableOpacity
                         style = {styles.createItineraryButton}
                         onPress = {() => this.handleCreateItinerary()}
                      >
                         <Text style = {styles.createItineraryButtonText}>Create Itinerary</Text>
                      </TouchableOpacity>
                    </View> :
                    <View></View>
                }
              </View>
           </View>
         </View>
     )
  }
}
export default CreateItinerary

const styles = StyleSheet.create({
  input: {
     margin: 15,
     height: 40,
     borderColor: '#7a42f4',
     borderWidth: 1
  },
  container: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  textColorPrimary: {
    color: "blue"
  },
  itinerarySection: {
    marginTop: 20
  },
  itinerarySectionHeaderText: {
    fontSize: 18
  },
  draftItinerary: {
    margin: 1
  },
  draftItineraryItem: {
  },
  draftItineraryItemText: {
  },
  deleteDraftItineraryItem: {
  },
  createItineraryButton: {
     backgroundColor: '#7a42f4',
     padding: 10,
     margin: 15,
     height: 40,
  },
  createItineraryButtonText:{
     color: 'white'
  }
})
