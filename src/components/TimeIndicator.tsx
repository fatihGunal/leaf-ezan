import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Colors from '../util/Colors'

type IndicatorProps = {
    name: string;
    timeText: string | null;
    value: string | null;
}

const TimeIndicator = (props: IndicatorProps) => {
  return (
    <View style={styles.box_style}>
      <Text style={styles.text}>{props.timeText} vaktine</Text>
      <Text style={styles.names}>{props.name}</Text>
      <Text style={styles.values}>{props.value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  box_style: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  names: {
    color: Colors.containerbackground,
    fontFamily: 'Space Grotesk',
    fontWeight: 'bold',
    fontSize: 30
  }, 
  text: {
    color: Colors.containerbackground,
    fontFamily: 'Space Grotesk',
    fontWeight: 'bold',
    fontSize: 45
  },
  values: {
    color: Colors.values,
    fontFamily: 'Space Grotesk',
    fontWeight: 'bold',
    fontSize: 70
  }
})

export default TimeIndicator