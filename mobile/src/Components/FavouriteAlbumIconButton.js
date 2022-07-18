import {IconButton, Colors} from "react-native-paper";
import React, {useEffect, useState} from "react";
import {addFavoriteAlbum,
        getFavoriteAlbums,
        removeFavoriteAlbum} from "../Services/MediaService";
import {useAuthUser} from "../context/AuthContext";

const FavouriteAlbumIconButton = ({albumId, size, style}) => {
  const [isFavourite, setIsFavourite] = useState(undefined);
  const {userState} = useAuthUser();

  const handle = (newIsFav) => {
    const call = newIsFav ? addFavoriteAlbum : removeFavoriteAlbum;
    call(albumId, userState.uid).then(_ => setIsFavourite(newIsFav));
  }

  useEffect(() => {
    if (!albumId) {
      return;
    }

    getFavoriteAlbums(userState.uid)
      .then(r => setIsFavourite(r.map(s => s.id).includes(albumId)))
      .catch(e => console.log(JSON.stringify(e)));
  });

  return (
    isFavourite ? (
      <IconButton 
        style={style} 
        color={Colors.red300}
        size={size} 
        icon='heart' 
        onPress={() => handle(false)}/>
    ) : (
      <IconButton 
        style={style} 
        color={Colors.red300}
        size={size} 
        icon='heart-outline' 
        onPress={() => handle(true)} disabled={isFavourite === undefined}/>
    )
  );
}

export default FavouriteAlbumIconButton;
