import {
  StyleSheet, TouchableOpacity,
  View, Image,
} from 'react-native';
import React from 'react'
import {Text, IconButton} from 'react-native-paper';
import subscription from "../data/Subscription";
import MaterialCommunityIcon from "react-native-paper/src/components/MaterialCommunityIcon";

const styles = StyleSheet.create(
  {
    container: {
      backgroundColor: 'lightblue',
      marginTop: 5,
      height: 80,
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 10,
    },
    info: {
      flexDirection: 'row',
      flex: 20,
      flexGrow: 10,
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    textInfo: {
      flexShrink: 1,
    },
    title: {
      fontSize: 19,
      color: 'black',
    },
    artist: {
      fontSize: 16,
      color: '#565656',
    },
    artwork: {
      height: 60,
      width: 60,
      marginHorizontal: 10,
      borderRadius: 10,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flexShrink: 1,
      borderColor: 'black',
      borderWidth: 2,
      flexWrap: 'nowrap',
    }
  }
)

const PlayableListItem = ({playableItem, play, moreInfoCallback}) => (
  <TouchableOpacity style={styles.container} onPress={() => play()}>
    <View style={styles.info}>
      <Image style={styles.artwork} source={playableItem.artwork}/>
      <View style={styles.textInfo}>
        <Text numberOfLines={1} style={styles.title}>{playableItem.title}</Text>
        {playableItem.artist ? (<Text numberOfLines={1} style={styles.artist}>{playableItem.artist}</Text>) : null}
        {playableItem.artistNames ? (<Text numberOfLines={1} style={styles.artist}>{playableItem.artistNames}</Text>) : null}
      </View>
    </View>
    {(playableItem.subscription === subscription.premium.value) ? (<MaterialCommunityIcon size={30} name="star" color='#d4af37' direction="rtl"/>) : null}
    <IconButton
      icon='information'
      size={30}
      onPress={() => moreInfoCallback()}
    />
  </TouchableOpacity>
);

export default PlayableListItem;
