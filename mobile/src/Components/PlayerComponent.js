import React, {useEffect, useState} from 'react'
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import FullScreenPlayer from "./FullScreenPlayer";
import HomeNavStack from "./HomeNavStack";
import TrackPlayer, {Capability, RepeatMode} from "react-native-track-player";
import LoaderScreen from "./LoaderScreen";
import {FavouriteSongsProvider} from "../context/FavouriteSongsProvider";

const Stack = createNativeStackNavigator();

const setUpTrackPlayer = async () => {
  await TrackPlayer.setupPlayer();
  await TrackPlayer.updateOptions({
    stopWithApp: true,
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
    ],
    compactCapabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious
    ],
  });
  await TrackPlayer.setRepeatMode(RepeatMode.Queue);
  console.log("Track player set up correctly")
}

const PlayerComponent = () => {

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setUpTrackPlayer()
      .then(() => setInitialized(true));
    return () => {
      console.log('Destroying track player');
      TrackPlayer.destroy();
    }
  }, []);

  if (!initialized) {
    return <LoaderScreen/>;
  }
  return (
    <FavouriteSongsProvider>
      <Stack.Navigator mode='modal' screenOptions={{headerShown: false}}>
        <Stack.Screen name='Main' component={HomeNavStack}/>
        <Stack.Screen name='Player' component={FullScreenPlayer}/>
      </Stack.Navigator>
    </FavouriteSongsProvider>
  )
}

export default PlayerComponent;
