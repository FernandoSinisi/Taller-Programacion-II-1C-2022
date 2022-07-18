import React, {useCallback, useState} from 'react'
import Top3List from '../Components/Top3List'
import constants from '../others/constants'
import {ScrollView} from "react-native";
import TopList from "../Components/TopList";
import genre from "../data/Genre"
import GenreChip from "../Components/GenreChip";
import usePlayerAction from "../Hooks/usePlayerAction";
import {useFocusEffect, useRoute} from "@react-navigation/native";
import {getPublicPlaylists} from "../Services/MediaService";
import PlayableListItem from "../Components/PlayableListItem";
import {playlistToPlayable, songToTrack} from "../others/utils";
import LoaderScreen from "../Components/LoaderScreen";
import subscription from "../data/Subscription";

const ContentScreen = ({navigation}) => {

  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const userSubscription = route.params.userSubscription;

  const player = usePlayerAction();

  useFocusEffect(useCallback(() => {
    setLoading(true);
    getPublicPlaylists()
      .then(setPlaylists)
      .then(_ => setLoading(false))
      .catch(e => {
        if(JSON.stringify(e).includes('401')) alert("No Autorizado");
        });
  }, []))

  if (loading) {
    return <LoaderScreen/>;
  }

  return (
    <ScrollView style={{backgroundColor: '#f5fcff'}}>
      <Top3List
        title='Canciones'
        endpoint={constants.MEDIA_HOST + constants.SONGS_URL + "?"}
        navigation={navigation}
        subscription={userSubscription}
        open='SongListScreen'
        songList={true}
        color={'#f5fcff'}
      />

      <Top3List
        title='Álbumes'
        endpoint={constants.MEDIA_HOST + constants.ALBUM_URL + "?"}
        navigation={navigation}
        subscription={userSubscription}
        open='AlbumListScreen'
        albumList={true}
        color={'#f5fcff'}
      />

      <TopList
        title={'Playlists'}
        data={playlists}
        renderDataItem={(playlist, id) => (
          <PlayableListItem id={id}
                            key={id}
                            playableItem={playlistToPlayable(playlist)}
                            play={() => player.playList(playlist.songs.filter(s => subscription[s.subscription].level <= subscription[userSubscription].level).map(songToTrack), 0)}
                            moreInfoCallback={() => navigation.navigate('PlaylistScreen', {playlistId: playlist.id})}

          />)}
        max={3}
        viewMoreCallback={() => navigation.navigate('PlaylistListScreen', {playlists: playlists})}
      />

      <TopList
        title={'Géneros'}
        data={Object.values(genre)}
        max={3}
        renderDataItem={(genre, id) => {
          return <GenreChip id={id} key={id} genre={genre} navigation={navigation}/>
        }}
        viewMoreCallback={() => navigation.navigate('GenreListScreen')}
        defaultColor={true}
      />

    </ScrollView>
  );
}

export default ContentScreen;
