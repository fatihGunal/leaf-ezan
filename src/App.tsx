/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import {TailwindProvider} from 'tailwind-rn';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import utilities from './../tailwind.json';
import RootNavigator from './navigation/RootNavigator';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
// npm start
// npm run android
  return (
    // @ts-ignore - TailwindProvider is missing a type difinition
    <TailwindProvider utilities={utilities}>
      <RootNavigator/>
    </TailwindProvider>
  );
}

export default App;
