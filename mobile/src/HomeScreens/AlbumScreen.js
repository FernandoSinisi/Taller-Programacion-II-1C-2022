import React, {useEffect, useState} from "react";
import SongList from "../Components/SongList";
import {getAlbum} from "../Services/MediaService";
import {Image, View, StyleSheet} from "react-native";
import {Text} from "react-native-paper";
import LoaderScreen from "../Components/LoaderScreen";
import defaultArtwork from "../../assets/album-placeholder.png";
import FavouriteAlbumIconButton from "../Components/FavouriteAlbumIconButton";
import { ScrollView } from "react-native-gesture-handler";
import {getUser} from "../Services/UsersService";
import UserChip from "../Components/UserChip";
import subscription from "../data/Subscription";

const AlbumScreen = ({navigation, route}) => {
  const albumId = route.params.albumId;
  const userSubscription = route.params.userSubscription;
  const [album, setAlbum] = useState();
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    getAlbum(albumId).then(a => {
      Promise.all(a.artists.map(getUser)).then(setArtists);
      setAlbum(a);
      navigation.setOptions({ headerShown: true, headerTitle: a.title });
    });
  }, [])

  if (album === undefined) {
    return <LoaderScreen/>;
  }

  return (

    <View style={styles.container}>
      <ScrollView>
        <Image source={album.link ? {uri: album.link} : defaultArtwork} style={styles.artwork}/>
        <Text style={styles.title}>{artists.length > 1 ? 'Autores' : 'Autor'}</Text>
        {artists.map((a, i) => <UserChip key={i} id={i} user={a} navigation={navigation}/>)}
        <Text style={styles.title}>Canciones</Text>

        <SongList navigation={navigation}
                  songList={album.songs.filter(s => subscription[s.subscription].level <= subscription[userSubscription].level) ?? []}/>



      <Text>{"\n\n"}
      </Text>

      <FavouriteAlbumIconButton style={{alignSelf: 'center'}}
                                size={90}
                                albumId={route.params.albumId}/>
    </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'stretch',
    justifyContent: 'center',
    flexGrow: 1,
    backgroundColor: '#f5fcff',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'left',
    padding: 15,
  },
  artwork: {
    width: undefined,
    aspectRatio: 1,
    flexGrow: 1,
  },
});

export default AlbumScreen;
