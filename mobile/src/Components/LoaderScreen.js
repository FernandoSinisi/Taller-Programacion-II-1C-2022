import React from 'react'
import {View} from 'react-native';
import {ActivityIndicator} from "react-native-paper";

const LoaderScreen = () => (
  <View style={{flex: 1, flexGrow: 1, justifyContent: 'center'}}>
    <ActivityIndicator size={80}/>
  </View>
)

export default LoaderScreen;
