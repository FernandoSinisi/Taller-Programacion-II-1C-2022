import React from 'react';
import {StyleSheet, View} from "react-native";
import {Slider} from "@miblanchard/react-native-slider";
import {Text} from "react-native-paper";

const formatSeconds = s => new Date(s * 1000).toISOString().substring(14, 19);

const SongProgressBar = ({position, duration, setPosition}) => {
  return (
    <View style={styles.container}>
      <View>
        <Text>{formatSeconds(position)}</Text>
      </View>
      <View style={styles.sliderContainer}>
        <Slider
          value={Math.floor(position)}
          onValueChange={v => setPosition(v[0])}
          maximumValue={Math.floor(duration)}
          step={1}
        />
      </View>
      <View>
        <Text>{formatSeconds(duration)}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderContainer: {
    margin: 3,
    flexGrow: 1,
  },
});

export default SongProgressBar;
