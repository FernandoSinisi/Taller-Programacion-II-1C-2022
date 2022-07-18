import React, {useEffect, useState} from 'react';
import {songToTrack} from "../others/utils";
import {SafeAreaView, View, ScrollView} from "react-native";
import {containerStyle} from "../styles/genericStyles";
import PlayableListItem from "../Components/PlayableListItem";
import defaultArtwork from "../../assets/album-placeholder.png";
import usePlayerAction from "../Hooks/usePlayerAction";
import {getArtists} from "../Services/UsersService";
import {getAllAlbums} from "../Services/MediaService";
import LoaderScreen from '../Components/LoaderScreen';
import {Searchbar} from "react-native-paper";
import subscription from "../data/Subscription";
import {useAuthUser} from "../context/AuthContext";

const enrichWithArtistNames = (albums, artists) => albums.map(album => enrichWithArtistName(album, artists));

const enrichWithArtistName = (album, artists) => ({
  ...album,
  artistNames: album.artists
    .map(artistId => artists.find(a => a.id === artistId))
    .map(getUserName)
    .join(', '),
});

const getUserName = user => `${user.username}`

const AlbumListScreen = ({navigation}) => {
  const [albumList, setAlbumList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('')
  const player = usePlayerAction();
  const {userState} = useAuthUser();

  useEffect(() => {
    const getAlbumsWithArtists = async () => {
      const allAlbums = getAllAlbums();
      const artists = await getArtists().then(r => r.list);
      return allAlbums.then(albums => enrichWithArtistNames(albums, artists));
    }
    getAlbumsWithArtists().then(albums => {
      setAlbumList(albums);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    navigation.setOptions({headerShown: true, headerTitle: 'Álbumes'});
  }, []);


  const toPlayable = album => {
    return {
      title: album.title,
      artwork: album.link ? {uri: album.link} : defaultArtwork,
      artist: album.artistNames ?? 'Unknown artists',
      subscription: album.subscription,
    };
  };

  const filterAlbum = filterText => {
    filterText = filterText.toLowerCase();
    return a => subscription[a.subscription].level <= subscription[userState.subscription].level &&
      (a.title.toLowerCase().includes(filterText) || a.artistNames.toLowerCase().includes(filterText));
  }

  if (loading) {
    return <LoaderScreen/>;
  }
  return (
    <ScrollView style={{...containerStyle, marginTop: 10}}>
      <SafeAreaView>
        <Searchbar onChangeText={setText}
                   placeholder={"Buscar albumes"}
                   inputStyle={{}}
                   containerStyle={{}}
                   inputContainerStyle={{}}
        />
        <View style={{marginBottom: 10, marginTop: 10}}>
          {
            albumList.filter(filterAlbum(text)).map((album, id) => {
                return <PlayableListItem id={id}
                                         key={id}
                                         playableItem={toPlayable(album)}
                                         play={() => player.playList(album.songs.filter(s => subscription[s.subscription].level <= subscription[userState.subscription].level).map(songToTrack), 0)}
                                         moreInfoCallback={() => {
                                           navigation.navigate('AlbumScreen', {
                                             albumId: album.id,
                                             userSubscription: userState.subscription,
                                           });
                                         }}
                />
              }
            )
          }
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

export default AlbumListScreen;
