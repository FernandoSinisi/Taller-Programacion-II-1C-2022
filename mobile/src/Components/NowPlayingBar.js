import React from 'react';
import {StyleSheet, View, Text, Image} from "react-native";
import {IconButton, ProgressBar} from "react-native-paper";
import TextTicker from "react-native-text-ticker";
import SwipeableView from "./SwipeableView";
import usePlayer from "../Hooks/usePlayer";
import {useNavigation} from "@react-navigation/native";
import FavouriteSongIconButton from "./FavouriteSongIconButton";

const NowPlayingBar = () => {
  const navigation = useNavigation();
  const player = usePlayer();
  return (
    <View style={styles.container}>
      <View style={styles.horizontalLayout}>
        <SwipeableView
          style={styles.songInfoArea}
          onPress={() => navigation.navigate('Player')}
          onSwipeLeft={() => player.skipToNext()}
          onSwipeRight={() => player.skipToPrevious()}
        >
          {player.currentTrack && <Image style={styles.artwork} source={player.currentTrack?.artwork}/>}
          <View style={styles.songInfo}>
            <TextTicker style={{fontSize: 18, fontWeight: 'bold'}} scroll={false} bounce={false}>
              {player.currentTrack?.title ?? 'Unknown song'}
            </TextTicker>
            <Text numberOfLines={1} style={{fontSize: 16}}>{player.currentTrack?.artist ?? 'Unknown artist'}</Text>
          </View>
        </SwipeableView>
        <View style={styles.buttonArea}>
          <FavouriteSongIconButton size={24} songId={player.currentTrack?.id}/>
          {
            player.isPlaying ?
              (<IconButton icon='pause' disabled={player.isLoading} onPress={() => {
                player.pause();
              }}/>) :
              (<IconButton icon='play' disabled={player.isLoading} onPress={() => {
                player.play();
              }}/>)
          }
        </View>
      </View>
      <ProgressBar style={styles.progressBar}
                   progress={(player.position ?? 0) / (player.duration ?? 1) || 0}
                   indeterminate={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 5,
    marginRight: 5,
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  horizontalLayout: {
    marginLeft: 5,
    marginRight: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  songInfoArea: {
    padding: 5,
    flexDirection: 'row',
    flexShrink: 1,
    flexGrow: 1,
  },
  songInfo: {
    paddingLeft: 5,
    alignSelf: 'flex-start',
    flexShrink: 1,
  },
  progressBar: {
    width: '95%',
    alignSelf: 'center',
  },
  artwork: {
    height: 45,
    width: 45,
    borderRadius: 8,
  },
  buttonArea: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  }
});

export default NowPlayingBar;
