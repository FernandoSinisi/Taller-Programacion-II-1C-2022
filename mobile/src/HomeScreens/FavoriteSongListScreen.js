import React, {useCallback, useEffect, useState} from 'react';
import {getFavouriteSongs} from "../Services/MediaService";
import SongList from "../Components/SongList";
import usePlayerAction from "../Hooks/usePlayerAction";
import {useAuthUser} from "../context/AuthContext";
import {useFocusEffect} from "@react-navigation/native";
import {songToTrack} from "../others/utils";
import LoaderScreen from '../Components/LoaderScreen';
import subscription from "../data/Subscription";

const FavoriteSongListScreen = ({navigation}) => {
  const {userState} = useAuthUser();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  const player = usePlayerAction();


  useEffect(()=>{
    navigation.setOptions({ headerShown: true, headerTitle: 'Canciones favoritas' });
  }, []);

  useFocusEffect(useCallback(() => {
    getFavouriteSongs(userState.uid)
      .then(res => {
        setSongs(res);
        setLoading(false);
        player.initialize(res.map(songToTrack));
      });
  }, [navigation]))

  if (loading) {
    return <LoaderScreen/>;
  }
  return <SongList songList={songs.filter(s => subscription[s.subscription].level <= subscription[userState.subscription].level)} navigation={navigation}/>;
}

export default FavoriteSongListScreen;
