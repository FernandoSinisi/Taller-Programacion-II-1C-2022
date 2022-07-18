import {
  View,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {Button, Text} from 'react-native-paper';
import React, {useEffect, useState} from 'react'
import constants from '../others/constants'
import {getToGateway, postToGateway} from "../others/utils";
import {useAuthUser} from '../context/AuthContext';
import LoaderScreen from '../Components/LoaderScreen';


const NotificationListScreen = ({navigation}) => {


  const [notificationsList, setList] = useState([]);
  const {userState} = useAuthUser();
  const [nameChanged, setNameChanged] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    let isMounted = true;

    function getNotifications() {

      getToGateway(constants.USERS_HOST + constants.NOTIFICATION_LIST_URL
        + "?" + constants.EMISSOR_PARAM + userState.uid,
        "").then(res => {
        if (res.error !== undefined) {
          alert(res.error);
        } else {
          if (isMounted) {
            setList(res.notifications);
            setLoading(false);
          }
        }
      });
    }

    if (!nameChanged) {
      navigation.setOptions({headerShown: true, headerTitle: 'Notificaciones'});
      if (isMounted) setNameChanged(true);
    }

    const unsubscribe = navigation.addListener('focus',
      () => {
        getNotifications();
      });

    return () => {
      isMounted = false;
      unsubscribe();
    }
  }, []);

  const openChat = (notification) => {

    const body = {
      redirectTo: constants.USERS_HOST + constants.NOTIFICATION_LIST_URL
        + "?" + constants.EMISSOR_PARAM + notification.idEmissor + "&"
        + constants.RECEIVER_PARAM + notification.idReceptor
    }
    postToGateway(body, 'DELETE')
      .then(res => {
        if (res.error === undefined) {
          navigation.navigate('ChatScreen', notification);
        }
      })
  }

  if (loading) {
    return <LoaderScreen/>;
  }
  return (
    <View>
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            {
              notificationsList.map((notification, id) => {
                return (
                  <Button
                    id={id}
                    key={id}
                    mode='contained'
                    onPress={() => {
                      openChat(notification)
                    }}
                    style={{
                      width: 330,
                      height: 40,
                      borderRadius: 10,
                      backgroundColor: 'lightblue',
                      margin: 10,
                      flexDirection: 'row',
                      flexShrink: 1
                      
                    }}>
                    <Text style={{flexWrap: 'wrap', fontSize: 10}}>{notification.usernameReceptor} te ha enviado un mensaje.</Text>
                  </Button>
                )
              })
            }
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default NotificationListScreen;
