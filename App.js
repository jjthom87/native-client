import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

import MainScreen from './screens/Main.js';
import SignupScreen from './screens/Signup.js';
import SigninScreen from './screens/Signin.js';
import HomeScreen from './screens/Home.js';
import CreateItinerary from './screens/CreateItinerary.js';
import ListItineraries from './screens/ListItineraries.js';

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{ title: 'Welcome' }}
        />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Signin" component={SigninScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Create Itinerary" component={CreateItinerary} />
        <Stack.Screen name="List Itineraries" component={ListItineraries} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
