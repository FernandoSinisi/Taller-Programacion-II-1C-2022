import React, {useEffect, useState} from 'react'
import {HomeScreen} from '../HomeScreens/HomeScreen';
import ProfileScreen from '../HomeScreens/ProfileScreen';
import UserListScreen from '../HomeScreens/UserListScreen';
import {useAuthUser} from '../context/AuthContext'
import {createDrawerNavigator} from '@react-navigation/drawer';
import {checkAuthTokenExpirationTime} from '../others/utils'
import ContentScreen from "../HomeScreens/ContentScreen";
import {ExitScreen} from "../HomeScreens/ExitScreen";
import ArtistListScreen from '../HomeScreens/ArtistsListScreen';

const Drawer = createDrawerNavigator();

const Menu = () => {

  const {userState, signOut} = useAuthUser();
  const [isSignIn, setIsSignIn] = useState(true);

  useEffect(() => {
    if (!isSignIn)
      signOut();

  }, [isSignIn]);


  /* Todas las pantallas del menu se agregan Aca*/
  return (
    <Drawer.Navigator
        initialRouteName={'Inicio'}
        screenListeners={{
        focus: async (e) => {
          if (!await checkAuthTokenExpirationTime()) {
            alert("Su token de sesión expiro.");
            setIsSignIn(false);
          }
        },
      }}>
      <Drawer.Screen name='Inicio' component={HomeScreen}/>
      <Drawer.Screen name='Perfil' component={ProfileScreen} initialParams={{uid: userState.uid}}/>
      <Drawer.Screen name='Usuarios' component={UserListScreen}/>
      <Drawer.Screen name='Artistas' component={ArtistListScreen}/>
      <Drawer.Screen name='Contenido' component={ContentScreen} initialParams={{userSubscription: userState.subscription}}/>
      <Drawer.Screen name='Salir' component={ExitScreen}/>
    </Drawer.Navigator>
  )
}

export default Menu;
