import React from 'react'
import {StyleSheet, View, Image} from "react-native";
import {IconButton, Text} from "react-native-paper";
import usePlayer from "../Hooks/usePlayer";
import TextTicker from "react-native-text-ticker";
import SongProgressBar from "./SongProgressBar";
import SwipeableView from "./SwipeableView";
import FavouriteSongIconButton from "./FavouriteSongIconButton";

const FullScreenPlayer = ({navigation}) => {
  const player = usePlayer();
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <IconButton icon='chevron-down' size={32} onPress={() => navigation.goBack()}/>
        <Text style={{fontSize: 20}}>{player.currentTrack?.album || ''}</Text>
      </View>
      <SwipeableView
        style={styles.artworkContainer}
        onSwipeLeft={() => player.skipToNext()}
        onSwipeRight={() => player.skipToPrevious()}
      >
        <Image style={styles.artwork} source={player.currentTrack?.artwork}/>
      </SwipeableView>
      <View style={styles.bottom}>
        <View style={styles.infoRow}>
          <View style={styles.infoText}>
            <TextTicker style={{fontSize: 24, fontWeight: 'bold'}} scroll={false} bounce={false}>
              {player.currentTrack?.title ?? 'Unknown title'}
            </TextTicker>
            <TextTicker style={{fontSize: 22}} scroll={false}
                        bounce={false}>{player.currentTrack?.artist ?? 'Unknown artist'}</TextTicker>
          </View>
          <View style={styles.favourite}>
            <FavouriteSongIconButton size={30} songId={player.currentTrack?.id}/>
          </View>
        </View>
        <SongProgressBar position={player.position} duration={player.duration} setPosition={player.seekTo}/>
        <View style={styles.musicControl}>
          <IconButton icon='skip-previous' size={50} disabled={player.isLoading} onPress={() => {
            player.skipToPrevious();
          }}/>
          {
            player.isPlaying ?
              (<IconButton style={{backgroundColor: 'black'}} color={'white'} icon='pause' size={53}
                           disabled={player.isLoading} onPress={() => {
                player.pause();
              }}/>) :
              (<IconButton style={{backgroundColor: 'black'}} color={'white'} icon='play' size={53}
                           disabled={player.isLoading} onPress={() => {
                player.play();
              }}/>)
          }
          <IconButton icon='skip-next' size={50} disabled={player.isLoading} onPress={() => {
            player.skipToNext();
          }}/>
        </View>
      </View>
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
  },
  topBar: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  artworkContainer: {
    flex: 7,
  },
  artwork: {
    resizeMode: 'contain',
    height: undefined,
    width: undefined,
    ...StyleSheet.absoluteFillObject,
  },
  bottom: {
    flex: 4,
    marginLeft: 25,
    marginRight: 25,
  },
  musicControl: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoText: {
    flexShrink: 1,
    flexGrow: 1,
  },
  favourite: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: -10,
  },
})

export default FullScreenPlayer;
