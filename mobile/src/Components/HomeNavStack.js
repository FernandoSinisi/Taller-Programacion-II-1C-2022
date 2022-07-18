import {
  Platform, StyleSheet, View
} from 'react-native';
import React, {useEffect, useState} from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {HomeScreen} from '../HomeScreens/HomeScreen';
import ProfileScreen from '../HomeScreens/ProfileScreen';
import {useAuthUser} from '../context/AuthContext';
import Menu from './Menu';
import ContentScreen from "../HomeScreens/ContentScreen";
import { getToGateway, postToGateway } from '../others/utils';
import constants from '../others/constants'
import EditProfileScreen from '../HomeScreens/EditProfileScreen';
import ChatScreen from '../HomeScreens/ChatScreen';
import NotificationListScreen from '../HomeScreens/NotificationListScreen';
import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device';
import NowPlayingBar from "./NowPlayingBar";
import SongScreen from "../HomeScreens/SongScreen";
import CreateContentScreen from "../HomeScreens/CreateContentScreen";
import VerificationAccountScreen from "../HomeScreens/VerificationAccountScreen";
import FavoriteArtistListScreen from '../HomeScreens/FavoriteArtistsListScreen';
import ArtistListScreen from '../HomeScreens/ArtistsListScreen';
import SongListScreen from '../HomeScreens/SongListScreen';
import AlbumListScreen from '../HomeScreens/AlbumListScreen'
import AlbumScreen from "../HomeScreens/AlbumScreen";
import FavoriteSongListScreen from '../HomeScreens/FavoriteSongListScreen';
import FavoriteAlbumListScreen from "../HomeScreens/FavoriteAlbumListScreen";
import GenreScreen from "../HomeScreens/GenreScreen";
import GenreListScreen from "../HomeScreens/GenreListScreen";
import CreateBandScreen from '../HomeScreens/CreateBandScreen'
import BandMenbersListScreen from '../HomeScreens/BandMenbersListScreen';
import CreatePlaylist from "../ContentScreens/CreatePlaylist";
import PlaylistListScreen from "../HomeScreens/PlaylistListScreen";
import PlaylistScreen from "../HomeScreens/PlaylistScreen";


const HomeStack = createNativeStackNavigator();

const HomeNavStack = () =>{

  const {userState, setUserBasicInfo} = useAuthUser();
  const [expoPushToken, setExpoPushToken] = useState('');

  let registerForPushNotifications = async ()=>{
      let token;

      if (Device.isDevice){
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          alert('No se pudo obterner un token para realizar push notifications');
          return;
        }

        token = (await Notifications.getExpoPushTokenAsync({experienceId: '@spotifiuby-t2/Spotifiuby'})).data;

        saveToken(token);
      }
      else {
        alert('Para realizar push notifications se necesita un dispositivo fisico');
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        }).then(nc => console.log("notification channel set"));
      }

      return token;
    }

    let saveToken = (str) =>{

      const token = str.slice(
        str.indexOf('[') + 1,
        str.indexOf(']'),
      );

      const requestBody = {
        token: token,
        redirectTo: constants.USERS_HOST + constants.PUSH_NOTIFICATION_TOKEN_URL
             + "?" + constants.USER_ID_QUERY_PARAM + userState.uid
      }


      postToGateway(requestBody, 'PATCH').
        then(res =>{
          if ( res.error !== undefined ){
            alert(res.error)
          }
        })

    }

    useEffect(()=>{
      if ( userState.userType !== null )
        return;

      function getUserBasicInfo(){

          return getToGateway(constants.USERS_HOST + constants.PROFILE_USER_BASIC_INFO_URL
                        + "?"
                        + constants.USER_ID_QUERY_PARAM
                        + userState.uid);
        }
        getUserBasicInfo()
          .then(res =>setUserBasicInfo(res.type, res.username,res.subscription));


      registerForPushNotifications()
          .then(token =>
              {
                setExpoPushToken(token);
              })


    },[])

    /*Todas las pantallas de la Home van aca*/
    return(
        <View style={styles.container}>
          <HomeStack.Navigator style={styles.homeStack}
                               screenOptions={{headerShown: false}}>
            <HomeStack.Screen name='Menu' component={Menu} />
            <HomeStack.Screen name='HomeScreen' component={HomeScreen} />
            <HomeStack.Screen name='ProfileScreen' component={ProfileScreen} initialParams={{uid: userState.uid}}/>
            <HomeStack.Screen name='ArtistListScreen' component={ArtistListScreen} />
            <HomeStack.Screen name='FavoriteArtistsListScreen' component={FavoriteArtistListScreen} />
            <HomeStack.Screen name='ContentScreen' component={ContentScreen} initialParams={{userSubscription: userState.subscription}}/>
            <HomeStack.Screen name='CreateContentScreen' component={CreateContentScreen} />
            <HomeStack.Screen name='EditProfileScreen' component={EditProfileScreen}/>
            <HomeStack.Screen name='SongScreen' component={SongScreen} />
            <HomeStack.Screen name='AlbumScreen' component={AlbumScreen} />
            <HomeStack.Screen name='ChatScreen' component={ChatScreen}/>
            <HomeStack.Screen name='NotificationListScreen' component={NotificationListScreen}/>
            <HomeStack.Screen name='VerificationAccountScreen' component={VerificationAccountScreen}/>
            <HomeStack.Screen name='SongListScreen' component={SongListScreen}/>
            <HomeStack.Screen name='AlbumListScreen' component={AlbumListScreen}/>
            <HomeStack.Screen name='FavoriteSongListScreen' component={FavoriteSongListScreen}/>
            <HomeStack.Screen name='FavoriteAlbumListScreen' component={FavoriteAlbumListScreen}/>
            <HomeStack.Screen name='GenreScreen' component={GenreScreen}/>
            <HomeStack.Screen name='GenreListScreen' component={GenreListScreen}/>
            <HomeStack.Screen name='CreateBandScreen' component={CreateBandScreen}/>
            <HomeStack.Screen name='BandMenbersListScreen' component={BandMenbersListScreen}/>
            <HomeStack.Screen name='CreatePlaylist' component={CreatePlaylist} initialParams={{userId: userState.uid}}/>
            <HomeStack.Screen name='PlaylistListScreen' component={PlaylistListScreen}/>
            <HomeStack.Screen name='PlaylistScreen' component={PlaylistScreen} />
          </HomeStack.Navigator>
          <NowPlayingBar style={styles.bar}/>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  homeStack: {
    flex: 20,
  },
  bar: {
    flex: 1,
  }
});

export default HomeNavStack;
