import {Button, Text} from "react-native-paper";
import {StyleSheet, View} from "react-native";
import {containerStyle} from "../styles/genericStyles";
import React from 'react'

const TopList = props => {

  return (
    <View style={containerStyle}>
      <Text style={styles.title}>{props.title}</Text>
      {
          props.data.slice(0, props.max).map(props.renderDataItem)
      }
      <Button
        mode='text'
        style={styles.button}
        onPress={props.viewMoreCallback}>
        <Text style={{color: 'steelblue'}}>Ver mas</Text>
      </Button>
    </View>
  )
}

const styles = StyleSheet.create(
  {
    title: {
      alignSelf: 'center',
      fontSize: 18,
      marginBottom: 13,
      marginTop: 26,
      color: 'steelblue'
    },
    button: {
      alignSelf: 'center',
      fontSize: 15,
      flex: 1
    },
  }
)

export default TopList;
