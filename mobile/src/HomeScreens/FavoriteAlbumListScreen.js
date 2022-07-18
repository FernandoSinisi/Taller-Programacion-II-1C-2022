import React, {useEffect, useState} from 'react';
import {songToTrack} from "../others/utils";
import {ScrollView, View} from "react-native";
import {containerStyle} from "../styles/genericStyles";
import PlayableListItem from "../Components/PlayableListItem";
import defaultArtwork from "../../assets/album-placeholder.png";
import usePlayerAction from "../Hooks/usePlayerAction";
import {getArtists} from "../Services/UsersService";
import {getFavoriteAlbums} from "../Services/MediaService";
import {useAuthUser} from "../context/AuthContext";
import LoaderScreen from '../Components/LoaderScreen';
import subscription from "../data/Subscription";

const toPlayable = album => {
  return {
    title: album.title,
    artwork: album.link ? {uri: album.link} : defaultArtwork,
    artist: album.artistNames ?? 'Unknown artists',
    subscription: album.subscription,
  };
};

const enrichWithArtistNames = (albums, artists) => albums.map(album => enrichWithArtistName(album, artists));

const enrichWithArtistName = (album, artists) => ({
  ...album,
  artistNames: album.artists
      .map(artistId => artists.find(a => a.id === artistId))
      .map(getUserName)
      .join(', '),
});

const getUserName = user => `${user.username}`

const FavoriteAlbumListScreen = ({navigation}) => {
  const [albumList, setAlbumList] = useState([]);
  const [loading, setLoading] = useState(true);

  const player = usePlayerAction();

  const {userState} = useAuthUser();

  useEffect(() => {
    const getAlbumsWithArtists = async () => {
      const allAlbums = getFavoriteAlbums(userState.uid);
      const artists = await getArtists().then(r => r.list);
      return allAlbums.then(albums => enrichWithArtistNames(albums, artists));
    }
    getAlbumsWithArtists().then(albums => {
      setAlbumList(albums);
      setLoading(false);
    });
  }, [userState]);

  useEffect( ()=>{
    navigation.setOptions({ headerShown: true, headerTitle: 'Álbumes Favoritos' });
  }, []);

  if (loading) {
    return <LoaderScreen/>;
  }
  return (
      <View style={containerStyle}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            {
              albumList.map((album, id) => {
                return (
                    <PlayableListItem id={id}
                                      key={id}
                                      playableItem={toPlayable(album)}
                                      play={() => player.playList(album.songs.filter(s => subscription[s.subscription].level <= subscription[userState.subscription].level).map(songToTrack), 0)}
                                      moreInfoCallback={() => {
                                        navigation.navigate('AlbumScreen', {
                                          albumId: album.id,
                                          userSubscription: userState.subscription,
                                        });
                                      }}/>
                )
              })
            }
          </View>
        </ScrollView>
      </View>
  )
}

export default FavoriteAlbumListScreen;
