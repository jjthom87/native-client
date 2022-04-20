import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, TouchableHighlight, Button } from 'react-native'
import axios from 'axios';
import * as Keychain from 'react-native-keychain';

const SignupScreen = ({ navigation, route }) => {
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
   signUp = (email, password) => {
      return axios.post("http://localhost:7000/api/sign-up", {email, password}).then((response) => {
        if(response.data.user){
          var {email, token} = response.data.user;
          Keychain.setGenericPassword(email, token).then(function() {
            navigation.navigate('Main')
          }).catch((error) => {
            console.log(error)
            console.log("Error during Keychain Signup");
          });
        } else {
          console.log(response)
          console.log("User Already Signed Up")
        }
      }).catch((error) => {
        console.log(error)
        console.log("Error during Sign Up");
      })
   }
   render: {
      return (
         <View style = {styles.container}>
             <Button
               title="Go to Home Page"
               onPress={() =>
                 navigation.push('Main')
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
                  () => this.signUp(this.state.email, this.state.password)
               }>
               <Text style = {styles.submitButtonText}> Submit </Text>
            </TouchableOpacity>
         </View>
      )
   }
}
export default SignupScreen

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
