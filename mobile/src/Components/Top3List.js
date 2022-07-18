import {StyleSheet, View} from 'react-native';
import React, {useCallback, useState} from 'react'
import {Button, Text} from 'react-native-paper';
import {getToGateway, songToTrack} from '../others/utils';
import constants from '../others/constants'
import UserChip from './UserChip';
import {useFocusEffect} from '@react-navigation/native';
import usePlayerAction from "../Hooks/usePlayerAction";
import PlayableListItem from "../Components/PlayableListItem";
import LoaderScreen from './LoaderScreen';
import defaultArtwork from "../../assets/album-placeholder.png";
import SongList from "./SongList";
import {containerStyle} from "../styles/genericStyles";
import {getArtists} from "../Services/UsersService";
import subscription from "../data/Subscription";


const getAlbumsWithArtists = async (allAlbums) => {
  const artists = await getArtists().then(r => r.list);
  return allAlbums.map(album => enrichWithArtistName(album, artists));
}

const enrichWithArtistName = (album, artists) => ({
  ...album,
  artistNames: album.artists
    .map(artistId => artists.find(a => a.id === artistId))
    .map(getUserName)
    .join(', '),
});

const getUserName = user => `${user.username}`

const Top3List = props => {

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const player = usePlayerAction();

  const toPlayable = album => {
    return {
      title: album.title,
      artwork: album.link ? {uri: album.link} : defaultArtwork,
      artist: album.artistNames ?? '',
      subscription: album.subscription,
    };
  };

  useFocusEffect(
    useCallback(() => {
      getToGateway(props.endpoint + constants.LIMIT_3_PARAM)
        .then(res => {
          if (res.error !== undefined) {
            console.log(res.error)
            if(res.error.toLowerCase().includes('no autorizado')){
              setList([]);
              alert(res.error);
            }
          } else {
            if (props.userList) {
              setList(res.list)
            }
            else if (props.albumList) {
              getAlbumsWithArtists(res).then(albums => {
                setList(albums)
              });
            } else {
              setList(res)
            }
            setLoading(false);
          }
        })


    }, []));


  if (loading) {
    return <LoaderScreen/>;
  }
  return (
    <View style={{...containerStyle, backgroundColor: props.color}}>
      {
        list.length !== 0 && (
          <View style={{flex: 1, flexGrow: 1}}>
            <Text style={styles.title}>{props.title}</Text>
            {
              props.userList && (
                list.map((user, id) => {
                  return (<UserChip id={id} key={id} user={user} navigation={props.navigation}/>)
                })
              )
            }
            {
              props.songList &&
              (<SongList navigation={props.navigation} songList={list.filter(s => subscription[s.subscription].level <= subscription[props.subscription].level)}/>)
            }
            {
              props.albumList && (
                list.map((album, id) => {
                  return (<PlayableListItem id={id}
                                            key={id}
                                            playableItem={toPlayable(album)}
                                            play={() => player.playList(album.songs.filter(s => subscription[s.subscription].level <= subscription[props.subscription].level).map(songToTrack), 0)}
                                            moreInfoCallback={() => {
                                              props.navigation.navigate('AlbumScreen', {albumId: album.id, userSubscription: props.subscription});
                                            }}
                  />)
                })
              )
            }
            <Button
              mode='text'
              style={styles.button}
              onPress={() => {
                props.navigation.navigate(props.open)
              }}>
              <Text style={{color: 'steelblue'}}>Ver mas</Text>
            </Button>
          </View>
        )
      }
    </View>
  )
}

const styles = StyleSheet.create(
  {
    title: {
      alignSelf: 'center',
      fontSize: 18,
      marginBottom: 13,
      marginTop: 26,
      color: 'steelblue'
    },
    button: {
      alignSelf: 'center',
      fontSize: 15,
      flex: 1
    },
  }
)
export default Top3List;
