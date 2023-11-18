import React from 'react'
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'

const RootStack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <NavigationContainer>
        <RootStack.Navigator 
        initialRouteName='Home'
        screenOptions={{headerShown: false}}>
            <RootStack.Screen name='Home' component={HomeScreen}/>
            <RootStack.Screen name='Settings' component={SettingsScreen}/>
        </RootStack.Navigator>
    </NavigationContainer>
  )
}

export default RootNavigator