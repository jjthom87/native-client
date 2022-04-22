import React, { Component, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, TouchableHighlight, Button } from 'react-native'
import axios from 'axios';
import * as Keychain from 'react-native-keychain';
import Config from "react-native-config";

const CreateItinerary = ({ navigation, route }) => {
  const [usersRecs, setUsersRecs] = useState([]);
  const [googlePlacesSearchResults, setGooglePlacesSearchResults] = useState([]);
  const [itinerary, setItinerary] = useState([]);

  const GOOGLE_PLACES_API_BASE_URL = 'https://maps.googleapis.com/maps/api/place'

  useEffect(() => {
  }, [])
  handleInputChange = async function(text){
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
  handleGooglePlaceClick = async (autocompleteResult) => {
    const apiUrl = `${GOOGLE_PLACES_API_BASE_URL}/details/json?place_id=${autocompleteResult.place_id}&key=${Config.GOOGLE_API_KEY}`
    try {
      const placeResult = await axios.get(apiUrl)
      if (placeResult) {
        const addedItinerary = {name: placeResult.data.result.name, place_id: placeResult.data.result.place_id}
        setItinerary(currentItinerary => [...currentItinerary, addedItinerary])
        console.log(itinerary)
      }
    } catch (e) {
      console.log(e)
    }
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
             placeholder="Type here to translate!"
             onChangeText={this.handleInputChange}
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
              {
                itinerary.length > 0 ?
                  itinerary.map((place, index) => {
                    return (
                      <Text key={place.place_id}>{place.name}</Text>
                    )
                  }) : <View></View>
              }
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
  }
})
