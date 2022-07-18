import React, {useEffect, useState} from "react";
import SongList from "../Components/SongList";
import {getPlaylist, setPlaylistStatus} from "../Services/MediaService";
import {Image, StyleSheet, View} from "react-native";
import {Button, Text} from "react-native-paper";
import LoaderScreen from "../Components/LoaderScreen";
import defaultArtwork from "../../assets/album-placeholder.png";
import {ScrollView} from "react-native-gesture-handler";
import {buttonStyle} from "../styles/genericStyles";
import {useAuthUser} from "../context/AuthContext";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import subscription from "../data/Subscription";
import {getUser} from "../Services/UsersService";
import UserChip from "../Components/UserChip";


const PlaylistScreen = ({navigation, route}) => {
  const playlistId = route.params.playlistId;
  const [playlist, setPlaylist] = useState();
  const [isPublic, setIsPublic] = useState(false);
  const [owner, setOwner] = useState();
  const {userState} = useAuthUser();

  useEffect(() => {
    getPlaylist(playlistId).then(p => {
      getUser(p.owner).then(u => {
        setOwner(u)
        setPlaylist(p);

        setIsPublic(p.isCollaborative);

        navigation.setOptions({headerShown: true, headerTitle: p.title});
      });
    });
  }, [])

  const handleStatusChange = async () => {
    const data = {
      id: playlistId,
      isPublic: !isPublic,
    }

    await setPlaylistStatus(data)
      .then(res => {
        setIsPublic(!isPublic);
      })
      .catch(err => {
          alert(err.error.toString());
        }
      );
  }

  if (playlist === undefined) {
    return <LoaderScreen/>;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Image source={playlist.artwork ? {uri: playlist.artwork} : defaultArtwork} style={styles.artwork}/>
        <Text style={{
          textAlign: 'left',
          padding: 15,
          fontSize: 25
        }}>{'Autor'}</Text>
        <UserChip user={owner} navigation={navigation}/>
        <View>
          <Text style={{
            textAlign: 'left',
            padding: 15,
            fontSize: 25
          }}>{'Canciones'}</Text>


          <SongList navigation={navigation}
                    songList={playlist.songs.filter(s => subscription[s.subscription].level <= subscription[userState.subscription].level) ?? []}/>
        </View>

        <View>
          {
            (userState.uid === playlist.owner) &&
            (<Button mode='contained'
                     style={styles.button}
                     onPress={handleStatusChange}>
              {
                (isPublic) ?
                  <MaterialCommunityIcons
                    name='lock-open'
                    size={50}
                    color='#388AD6'/>
                  :
                  <MaterialCommunityIcons
                    name='lock'
                    size={50}
                    color='#388AD6'/>
              }
            </Button>)
          }
        </View>
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
    alignSelf: 'center',
  },
  artwork: {
    width: undefined,
    aspectRatio: 1,
    flexGrow: 1,
  },
  button: {
    ...buttonStyle,
    width: 100,
  }
});

export default PlaylistScreen;
