import React, {useEffect, useState} from 'react';
import {getAllSongs} from "../Services/MediaService";
import SongList from "../Components/SongList";
import LoaderScreen from '../Components/LoaderScreen'
import {SafeAreaView, View} from "react-native";
import {Searchbar} from "react-native-paper";
import {containerStyle} from "../styles/genericStyles";
import {useAuthUser} from "../context/AuthContext";
import subscription from "../data/Subscription";


const SongListScreen = ({navigation}) => {
  const {userState} = useAuthUser();
  const [allSongs, setAllSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('')

  useEffect(() => {
    navigation.setOptions({headerShown: true, headerTitle: 'Canciones'});
  }, []);

  // TODO Warning: es asimétrico respecto de Favorite Song List Screen
  useEffect(() => {
    return navigation.addListener('focus', async () => {
      getAllSongs().then(setAllSongs).then(res => setLoading(false));
    });
  }, [navigation]);

  const filterSongs = filterText => {
    filterText = filterText.toLowerCase();
    return s => subscription[s.subscription].level <= subscription[userState.subscription].level &&
      (s.title.toLowerCase().includes(filterText) || s.author.toLowerCase().includes(filterText));
  }

  if (loading) {
    return <LoaderScreen/>;
  }
  return (
    <View style={{...containerStyle, marginTop: 10}}>
      <SafeAreaView>
        <Searchbar onChangeText={setText}
                   placeholder={"Buscar canciones"}
                   inputStyle={{}}
                   containerStyle={{}}
                   inputContainerStyle={{}}
        />
      </SafeAreaView>
      <View style={{marginBottom: 10}}/>
      <SongList navigation={navigation} songList={allSongs.filter(filterSongs(text))}/>
    </View>
  )
}

export default SongListScreen;
