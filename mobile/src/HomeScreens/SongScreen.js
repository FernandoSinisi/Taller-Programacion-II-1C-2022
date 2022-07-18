import {FlatList, StyleSheet, View} from "react-native";
import {Text} from 'react-native-paper';
import React, {useEffect, useState} from 'react';
import {getToGateway} from "../others/utils";
import * as constants from "../others/constants";
import {contentTextStyle, contentTitleStyle} from "../styles/contentStyle";
import FavouriteSongIconButton from "../Components/FavouriteSongIconButton";
import UserChip from "../Components/UserChip";
import {containerStyle} from "../styles/genericStyles";

const SongScreen = ({navigation, route}) => {

  const [song, setSong] = useState();

  useEffect(() => {
    const getSong = async () => {
      const song = await getToGateway(constants.MEDIA_HOST + constants.SONGS_URL
        + "/"
        + route.params
          .songId);

      if (song.error !== undefined) {
        console.log(JSON.stringify(song.error));
        return;
      }
      return song;
    }

    getSong().then(s => {
      setSong(s);
      navigation.setOptions({headerShown: true, headerTitle: s?.title});
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={contentTitleStyle}>{song?.title}</Text>
      <Text style={contentTextStyle}>Artistas</Text>
      {
        <FlatList
          data={song?.artists}
          renderItem={({item, id}) => <UserChip id={id} key={id} user={item} navigation={navigation}/>}
        />
      }
      <FavouriteSongIconButton style={styles.favouriteIcon} size={90} songId={song?.id}/>
    </View>

  );
}

const styles = StyleSheet.create(
  {
    container: {
      ...containerStyle,
      backgroundColor: '#f5fcff',
      paddingTop: 5
    },
    favouriteIcon: {
      alignSelf: 'center',
      marginTop: 10,
      marginBottom: 10
    }
  }
)

export default SongScreen;

