import React from 'react'
import {ScrollView, View} from "react-native";
import PlayableListItem from "./PlayableListItem";
import {songToTrack} from "../others/utils";
import usePlayerAction from "../Hooks/usePlayerAction";

const SongList = ({navigation, songList}) => {
  const player = usePlayerAction();
  const tracks = songList.map(songToTrack);
  return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          {
            tracks.map((track, id) => {
              return (
                <PlayableListItem id={id}
                                  key={id}
                                  playableItem={track}
                                  play={() => player.playList(tracks, id)}
                                  moreInfoCallback={() => {
                                    navigation.navigate('SongScreen', {
                                      songId: track.id
                                    });
                                  }}
                />
              )
            })
          }
        </View>
      </ScrollView>
  );
}

export default SongList;
