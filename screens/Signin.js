import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, TouchableHighlight, Button } from 'react-native'
import axios from 'axios';
import * as Keychain from 'react-native-keychain';

const SigninScreen = ({ navigation, route }) => {
   state = {
      email: '',
      password: ''
   }
   handleEmail = (text) => {
      this.state.email = text
   }
   handlePassword = (text) => {
      this.state.password = text
   }
   signIn = (email, password) => {
      return axios.post("http://localhost:7000/api/sign-in", {email, password}).then((response) => {
        if(response.data.user){
          var {email, token} = response.data.user;
          Keychain.setGenericPassword(email, token).then(function() {
            navigation.navigate('Home')
          }).catch((error) => {
            console.log(error)
            console.log("error during Keychain Signin")
          });
        } else {
          console.log(response)
          console.log("Error getting user")
        }
  		}).catch((error) => {
        console.log(error)
  			console.log("Error during Signin")
  		})
   }
   render: {
      return (
         <View style = {styles.container}>
             <Button
               title="Go to Home Page"
               onPress={() =>
                 navigation.navigate('Home', { name: 'Jane' })
               }
             />
            <TextInput style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder = "Email"
               placeholderTextColor = "#9a73ef"
               autoCapitalize = "none"
               onChangeText = {this.handleEmail}
             />

            <TextInput style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder = "Password"
               placeholderTextColor = "#9a73ef"
               autoCapitalize = "none"
               onChangeText = {this.handlePassword}
               secureTextEntry={true}
            />

            <TouchableOpacity
               style = {styles.submitButton}
               onPress = {
                  () => this.signIn(this.state.email, this.state.password)
               }>
               <Text style = {styles.submitButtonText}> Submit </Text>
            </TouchableOpacity>
         </View>
      )
   }
}
export default SigninScreen

const styles = StyleSheet.create({
   container: {
      paddingTop: 23
   },
   input: {
      margin: 15,
      height: 40,
      borderColor: '#7a42f4',
      borderWidth: 1
   },
   submitButton: {
      backgroundColor: '#7a42f4',
      padding: 10,
      margin: 15,
      height: 40,
   },
   submitButtonText:{
      color: 'white'
   }
})
