import React from "react";
import {createContext, useContext, useEffect, useState} from "react";
import {addFavouriteSong, getFavouriteSongs, removeFavouriteSong} from "../Services/MediaService";
import {useAuthUser} from "./AuthContext";
import LoaderScreen from "../Components/LoaderScreen";
import usePlayerAction from "../Hooks/usePlayerAction";
import {songToTrack} from "../others/utils";

const FavouriteSongsContext = createContext(undefined);

export const FavouriteSongsProvider = ({children}) => {
  const {userState} = useAuthUser();
  const [favouriteSongs, setFavouriteSongs] = useState(undefined);
  const [isReady, setIsReady] = useState(false);
  const {initialize} = usePlayerAction();

  const refreshFavourites = () => {
    getFavouriteSongs(userState.uid)
      .then(r => setFavouriteSongs(r))
      .then(() => setIsReady(true))
      .catch(e => {
        setFavouriteSongs([])
        setIsReady(true)
        console.log(JSON.stringify(e))});
  }

  const toggleFavourite = (songId) => {
    setIsReady(false);
    const call = isFavourite(songId) ? removeFavouriteSong : addFavouriteSong;
    return call(songId, userState.uid)
      .then(refreshFavourites);
  }

  const isFavourite = (songId) => favouriteSongs.map(s => s.id).includes(songId);

  useEffect(refreshFavourites, []);

  useEffect(() => {
    if (favouriteSongs) {
      initialize(favouriteSongs.map(songToTrack));
    }
  }, [favouriteSongs])

  if (favouriteSongs === undefined) {
    return <LoaderScreen/>;
  }

  return (
    <FavouriteSongsContext.Provider value={{favouriteSongs, isReady, isFavourite, refreshFavourites, toggleFavourite}}>
      {children}
    </FavouriteSongsContext.Provider>
  )
};

export const useFavouriteSongs = () => useContext(FavouriteSongsContext);
