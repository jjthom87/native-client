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
import ListUsersItineraries from './screens/ListUsersItineraries.js';
import SearchUsersItineraries from './screens/SearchUsersItineraries.js';
import ListSharedItineraries from './screens/ListSharedItineraries.js';


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
        <Stack.Screen name="List Users Itineraries" component={ListUsersItineraries} />
        <Stack.Screen name="Search Users Itineraries" component={SearchUsersItineraries} />
        <Stack.Screen name="List Shared Itineraries" component={ListSharedItineraries} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
