import React from "react";
import {IconButton, Colors} from "react-native-paper";
import {useFavouriteSongs} from "../context/FavouriteSongsProvider";

const FavouriteSongIconButton = ({songId, size, style}) => {
  const {isReady, isFavourite, toggleFavourite} = useFavouriteSongs();

  return (
    isFavourite(songId) ? (
      <IconButton 
        style={style} 
        size={size}
        color={Colors.red300} 
        icon='heart' 
        onPress={() => toggleFavourite(songId)} 
        disabled={!isReady}/>
    ) : (
      <IconButton 
        style={style} 
        size={size} 
        icon='heart-outline' 
        onPress={() => toggleFavourite(songId)}
        disabled={!isReady}/>
    )
  );
}

export default FavouriteSongIconButton;
