import React, {useCallback, useEffect, useState} from 'react';
import {getGenreAlbums, getGenreSongs} from "../Services/MediaService";
import {songToTrack} from "../others/utils";
import usePlayerAction from "../Hooks/usePlayerAction";
import {useAuthUser} from "../context/AuthContext";
import {useFocusEffect} from "@react-navigation/native";
import {getArtists} from "../Services/UsersService";
import defaultArtwork from "../../assets/album-placeholder.png";
import {FlatList, View} from "react-native";
import PlayableListItem from "../Components/PlayableListItem";
import subscription from "../data/Subscription";


const getUserName = user => `${user.username}`

const enrichWithArtistNames = (albums, artists) => albums.map(album => enrichWithArtistName(album, artists));

const enrichWithArtistName = (album, artists) => ({
  ...album,
  artistNames: album.artists
    .map(artistId => artists.find(a => a.id === artistId))
    .map(getUserName)
    .join(', '),
});

const GenreScreen = ({navigation, route}) => {
  const [songs, setSongs] = useState([]);
  const [albumList, setAlbumList] = useState([]);
  const player = usePlayerAction();
  const {userState} = useAuthUser();

  useEffect(() => {
    navigation.setOptions({headerShown: true, headerTitle: route.params.genre.label});
  }, []);

  useFocusEffect(useCallback(() => {
    getGenreSongs(route.params.genre.value)
      .then(res => {
        setSongs(res.filter(s => subscription[s.subscription].level <= subscription[userState.subscription].level));
        player.initialize(res.map(songToTrack));
      });

    const getAlbumsWithArtists = async () => {
      const genreAlbums = getGenreAlbums(route.params.genre.value);
      const artists = await getArtists().then(r => r.list);
      return genreAlbums.then(albums => enrichWithArtistNames(albums.filter(a => subscription[a.subscription].level <= subscription[userState.subscription].level), artists));
    }
    getAlbumsWithArtists().then(albums => {
      setAlbumList(albums);
    });

  }, [navigation]))

  const toPlayable = album => {
    return {
      title: album.title,
      artwork: album.link ? {uri: album.link} : defaultArtwork,
      artist: album.artistNames ?? 'Unknown artists',
      subscription: album.subscription,
    };
  };


  return (
    <View>
      <FlatList
        data={songs.map(songToTrack)}
        renderItem={({item, index}) => <PlayableListItem id={index}
                                                         key={index}
                                                         playableItem={item}
                                                         play={() => player.playList(songs.map(songToTrack), index)}
                                                         moreInfoCallback={() => {
                                                           navigation.navigate('SongScreen', {
                                                             songId: item.id
                                                           });
                                                         }}
        />
        }
      />
      <FlatList
        data={albumList}
        renderItem={({item, index}) => <PlayableListItem id={index}
                                                         key={index}
                                                         playableItem={toPlayable(item)}
                                                         play={() => player.playList(item.songs.filter(s => subscription[s.subscription].level <= subscription[userState.subscription].level).map(songToTrack), 0)}
                                                         moreInfoCallback={() => {
                                                           navigation.navigate('AlbumScreen', {
                                                             albumId: item.id,
                                                             userSubscription: userState.subscription,
                                                           });
                                                         }}
        />
        }
      />
    </View>
  );
}

export default GenreScreen;
