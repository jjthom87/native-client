import React, { Component, useEffect } from 'react';
import { Image, StyleSheet, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { Button, Text, TextInput } from "@react-native-material/core";
import axios from 'axios';
import * as Keychain from 'react-native-keychain';

const SigninScreen = ({ navigation, route }) => {
   useEffect(() => {
     this.state.email = '';
     this.state.password = '';
   }, [])
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
      return axios.post("http://localhost:7000/api/sign-in", {email, password}).then(async (response) => {
        if(response.data.user){
          var {email, token} = response.data.user;
          await Keychain.setGenericPassword(email, token).then(function() {
            navigation.push('Home')
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
             <TouchableOpacity style={styles.homeImageStyle} onPress={()=>navigation.push('Main')}>
               <Image
                 style={styles.homeImage}
                 source={require('../images/home.jpeg')}
                 onPress={() =>
                   navigation.push('Main')
                 }
               />
              </TouchableOpacity>
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
   homeImage: {
     height: 75,
     width: 75
   },
   homeImageStyle: {
     justifyContent: 'center',
     alignItems: 'center'
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
