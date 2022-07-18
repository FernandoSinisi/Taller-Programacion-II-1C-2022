import {
    StyleSheet,
    View,
    TouchableOpacity
  } from 'react-native';
import React,{useState, useCallback, useLayoutEffect, useEffect} from 'react'
import { Text } from 'react-native-paper'
import {GiftedChat, Bubble, Send, InputToolbar} from 'react-native-gifted-chat'
import { getCurrentUser, addDocIntoCollection, db} from '../Firebase/firebase';
import { useRoute } from '@react-navigation/native';
import { collection, orderBy, query, onSnapshot} from 'firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import ProfilePicture from '../Components/ProfilePicture';
import constants from '../others/constants';
const utils = require("../others/utils");
import * as Notifications from 'expo-notifications'


const ChatScreen = ({navigation}) =>{

        const route = useRoute();
        const [messages, setMessages] = useState([]);
        const {
          idEmissor,
          idReceptor,
          usernameReceptor,
          pushNotificationToken,
          usernameEmissor,
          photoUrl} = route.params;
        
        useEffect(()=>{
            navigation.setOptions({ headerShown: true, headerTitle: 'Mensajes'});
          }, []);


        useLayoutEffect( ()=>{
             function requestMessages(){
                const unsubscribe = onSnapshot(query(collection(db, utils.getChatId(idEmissor, idReceptor)), orderBy('createdAt','desc')),
                    snapshots =>{
                        setMessages(
                            snapshots.docs.map(doc =>({
                                _id: doc.data()._id,
                                createdAt: doc.data().createdAt.toDate(),
                                text: doc.data().text,
                                user:doc.data().user
                            }))
                        )
                    });

                return unsubscribe;
            }

            requestMessages();
        }, [])

        const onSend = useCallback(async (messages = []) => {
            setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
            await addDocIntoCollection(utils.getChatId(idEmissor,idReceptor), messages[0]);

            if ( pushNotificationToken === null ){
              return;
            }

            const token = (await Notifications.getExpoPushTokenAsync({experienceId: '@spotifiuby-t2/Spotifiuby'})).data;

            const params = {
              idEmissor: idReceptor,
              idReceptor: idEmissor,
              usernameReceptor: usernameEmissor,
              usernameEmissor: usernameReceptor,
              pushNotificationToken: token,
            }

            const body = {
              to: `ExponentPushToken[${pushNotificationToken}]`,
              title: 'Spotifiuby',
              sound: 'default',
              body: `${usernameEmissor} te ha enviado mensajes`,
              data: {
                  type: 'chat',
                  screenName: 'ChatScreen',
                  params: params
              }
            }


            fetch('https://exp.host/--/api/v2/push/send',{
              method: 'POST',
              headers: constants.JSON_HEADER,
              body: JSON.stringify(body)

            })
            .then(res => res.json())
            .then(res => console.log(res));


          }, []);

        const renderSend = (props) =>{
            return(
                <Send
                    {...props}>
                    <View>
                        <MaterialCommunityIcons
                            name='send-circle'
                            size={45}
                            color='#1338be'/>
                    </View>
                </Send>
            )
        }

        const renderTextInputBar = (props) =>{
            return(
                <InputToolbar {...props} placeholder='Mensaje'/>
            );
        }

        return(
            <View style={{backgroundColor: '#f5fcff', flex: 1}}>
            <View style={{backgroundColor: 'darkblue', height: 70}}>
                <View style={{flexDirection: 'row'}}>
                    <View style={{marginLeft: 13}}></View>
                    <ProfilePicture
                        uid={idReceptor}
                        username={usernameReceptor}
                        style={styles.avatar}
                        photoUrl={photoUrl}
                        pictureSize={60}
                        defaultImage={{marginTop: 5}}
                        profilePicture={{marginTop: 5}}
                        />
                    <Text style={{marginTop: 20, marginLeft: 55, fontSize: 20, color: 'white'}}>
                        {`${usernameReceptor}`}
                    </Text>
                </View>

            </View>
            <GiftedChat
                messages={messages}
                backgroundColor
                onSend={messages => onSend(messages)}
                alwaysShowSend
                user={{
                    _id: idEmissor,
                }}
                renderInputToolbar={renderTextInputBar}
                renderSend={renderSend}
                renderBubble={props => {
                    return (
                      <Bubble
                        {...props}

                        textStyle={{
                          right: {
                            color: 'white',
                          },
                          left: {
                            color: 'black',
                          },
                        }}
                        wrapperStyle={{
                          left: {
                            backgroundColor: '#4D4DFF',
                          },
                          right: {
                            backgroundColor: "#ADD8E6",
                          },
                        }}
                      />
                    );
                  }}


          />
          </View>
        )
      }

      const styles =StyleSheet.create(
        {
          avatar: {
            marginTop: 30,
            alignSelf: 'auto',
            marginBottom: 50,
          },
        }
      )

      export default ChatScreen;