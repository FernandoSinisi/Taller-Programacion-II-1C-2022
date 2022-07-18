import {StyleSheet, TouchableOpacity, View, Image} from "react-native";
import {Text} from "react-native-paper";
import React from 'react'
import genre from "../data/Genre"

const GenreChip = props => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => props.navigation.navigate('GenreScreen',{genre:props.genre})}>
        <View style={{flexDirection: 'row'}}>
          <Image style={styles.image} source={genre[props.genre.value].icon}/>
          <Text style={styles.label}>{props.genre.label}</Text>
        </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create(
  {
    container: {
      backgroundColor: 'lightblue',
      marginTop: 5,
      height: 80,
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 10,
    },
    label: {
      alignSelf: 'center',
      fontSize: 19,
      color: 'black',
    },
    image: {
      marginHorizontal: 10,
      borderRadius: 10,
      backgroundColor: 'transparent',
      height:60,
      width:60
    }
  }
)

export default GenreChip;

