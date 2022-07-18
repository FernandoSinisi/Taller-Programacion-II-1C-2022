import React,{useEffect} from 'react'
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {Avatar} from "react-native-paper";

import UploadSongScreen from "../ContentScreens/UploadSongScreen";
import UploadAlbumScreen from '../ContentScreens/UploadAlbumScreen';

const CreateContentScreen = ({navigation}) => {
  const ContentTab = createBottomTabNavigator();

  useEffect(()=>{
    navigation.setOptions({ headerShown: true, headerTitle: 'Subir Contenido' });
  }, []);

  return (
    <ContentTab.Navigator screenOptions={{headerShown: false}}>
      <ContentTab.Screen
        name="Canciones"
        component={UploadSongScreen}
        initialParams={{navigation: navigation}}
        options={{
          tabBarIcon: () => (< Avatar.Icon size={30} icon='music'/>)
        }}
      />

      <ContentTab.Screen
        name="Albumes"
        component={UploadAlbumScreen}
        initialParams={{navigation: navigation}}
        options={{
          tabBarIcon: () => (< Avatar.Icon size={30} icon='album'/>)
        }}
      />
    </ContentTab.Navigator>
  );
}

export default CreateContentScreen;