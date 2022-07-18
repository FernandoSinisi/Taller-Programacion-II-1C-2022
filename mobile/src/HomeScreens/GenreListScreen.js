import React, {useEffect, useState} from 'react'
import {SafeAreaView, ScrollView, StyleSheet, View} from "react-native";
import {Searchbar} from "react-native-paper";
import {containerStyle} from "../styles/genericStyles";
import GenreChip from "../Components/GenreChip";
import genre from "../data/Genre";

const GenreListScreen = ({navigation}) => {

  const [genreList, setGenreList] = useState([]);
  const [text, setText] = useState('')

  useEffect(() => {
    setGenreList(Object.values(genre))
    navigation.setOptions({headerShown: true, headerTitle: 'Géneros'});
  }, []);


  const filterGenre = filterText => {
    filterText = filterText.toLowerCase();
    return g => g.label.toLowerCase().includes(filterText);
  }

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        <Searchbar onChangeText={setText}
                   placeholder={"Buscar géneros"}
                   inputStyle={{}}
                   containerStyle={{}}
                   inputContainerStyle={{}}
        />
        <View style={{marginBottom: 10, marginTop: 10}}>
          {genreList.filter(filterGenre(text)).map((genreValue, id) => {
              return <GenreChip id={id} key={id} genre={genreValue} navigation={navigation}/>
            }
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  )
}

const styles = StyleSheet.create(
  {
    container: {
      ...containerStyle,
      backgroundColor: '#f5fcff',
      paddingTop: 5
    }
  }
)

export default GenreListScreen;