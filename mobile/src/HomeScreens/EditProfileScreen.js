import {SafeAreaView, ScrollView, StyleSheet, View,} from 'react-native';
import React, {useEffect, useReducer, useState} from 'react'
import {Button, Chip, Modal, Portal, Text} from 'react-native-paper'
import {useRoute} from '@react-navigation/native';
import constants from '../others/constants'
import {postToGateway} from "../others/utils";
import ProfilePicture from '../Components/ProfilePicture';
import EditProfileTextInput from '../Components/EditProfileTextInput';
import subscription from "../data/Subscription";
import SubscriptionDropDown from "../Components/SubscriptionDropDown";
import {useAuthUser} from "../context/AuthContext";

const reducer = (state, action = {}) => {

  switch (action.type) {
    case 'username':
      return {
        ...state,
        username: action.value,
      };

    case 'phoneNumber':
      return {
        ...state,
        phoneNumber: action.value
      }

    case 'phoneNumber':
      return {
        ...state,
        phoneNumber: action.value
      }

    case 'email':
      return {
        ...state,
        email: action.value
      }

    case 'metal':
      return {
        ...state,
        metal: (!state.metal)
      }
    case 'rock':
      return {
        ...state,
        rock: (!state.rock)
      }
    case 'salsa':
      return {
        ...state,
        salsa: (!state.salsa)
      }
    case 'pop':
      return {
        ...state,
        pop: (!state.pop)
      }
    case 'punk':
      return {
        ...state,
        punk: (!state.punk)
      }
    case 'blues':
      return {
        ...state,
        blues: (!state.blues)
      }
    case 'jazz':
      return {
        ...state,
        jazz: (!state.jazz)
      }
    case 'rap':
      return {
        ...state,
        rap: (!state.rap)
      }
    case 'indie':
      return {
        ...state,
        indie: (!state.indie)
      }
    case 'classic':
      return {
        ...state,
        classic: (!state.classic)
      }
    case 'reggeaton':
      return {
        ...state,
        reggeaton: (!state.reggeaton)
      }
    case 'electronic':
      return {
        ...state,
        electronic: (!state.electronic)
      }
    case 'others':
      return {
        ...state,
        others: (!state.others)
      }
    case 'subscription':
      return {
        ...state,
        subscription: action.value,
      };
  }
  return state;
};

const EditProfileScreen = ({navigation}) => {
  useEffect(() => {
    navigation.setOptions({headerShown: true, headerTitle: 'Editar Perfil'});
  }, []);

  const route = useRoute();
  const [profile, dispatch] = useReducer(reducer, route.params.profile);
  const [subscriptionValue, setSubscriptionValue] = useState(profile.subscription);
  const [visible, setVisible] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const showModalSubscription = () => setVisible(true);
  const {userState, setUserBasicInfo} = useAuthUser();

  const hideModalSubscription = () => {
    setButtonDisabled(true);
    setVisible(false);
    setSubscriptionValue(profile.subscription);
  };
  const handleNewSubscription = (newSubscription) => {
    if (newSubscription !== profile.subscription) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
    setSubscriptionValue(newSubscription);
  }
  const handleUpdateSubscription = () => {
    setButtonDisabled(true);
    dispatch({type: 'subscription', value: subscriptionValue});
    hideModalSubscription();
  }

  const saveProfile = () => {

    let requestBody = {
      redirectTo: constants.USERS_HOST + constants.EDIT_PROFILE_URL
        + "?" + constants.USER_ID_QUERY_PARAM + profile.id
    };

    if (route.params.profile.username !== profile.username) {
      requestBody['username'] = profile.username;
    }

    if (route.params.profile.metal !== profile.metal) {
      requestBody['metal'] = profile.metal;
    }
    if (route.params.profile.rock !== profile.rock) {
      requestBody['rock'] = profile.rock;
    }
    if (route.params.profile.pop !== profile.pop) {
      requestBody['pop'] = profile.pop;
    }
    if (route.params.profile.punk !== profile.punk) {
      requestBody['punk'] = profile.punk;
    }
    if (route.params.profile.blues !== profile.blues) {
      requestBody['blues'] = profile.blues;
    }
    if (route.params.profile.salsa !== profile.salsa) {
      requestBody['salsa'] = profile.salsa;
    }
    if (route.params.profile.jazz !== profile.jazz) {
      requestBody['jazz'] = profile.jazz;
    }
    if (route.params.profile.classic !== profile.classic) {
      requestBody['classic'] = profile.classic;
    }
    if (route.params.profile.electronic !== profile.electronic) {
      requestBody['electronic'] = profile.electronic;
    }
    if (route.params.profile.reggeaton !== profile.reggeaton) {
      requestBody['reggeaton'] = profile.reggeaton;
    }
    if (route.params.profile.indie !== profile.indie) {
      requestBody['indie'] = profile.indie;
    }
    if (route.params.profile.rap !== profile.rap) {
      requestBody['rap'] = profile.rap;
    }
    if (route.params.profile.others !== profile.others) {
      requestBody['other'] = profile.others;
    }
    if (route.params.profile.subscription !== profile.subscription) {
      requestBody['subscription'] = profile.subscription;
    }

    requestBody['isListener'] = route.params
                                     .profile
                                     .isListener;

    if (requestBody?.username === '') {
      alert("Campo nombre vacio.");
      return;
    }

    postToGateway(requestBody, 'PATCH')
      .then(res => {
        if (res.error === undefined) {
            const userSubscription = requestBody?.subscription !== undefined ? requestBody.subscription : userState.subscription;
            const userName = requestBody?.username !== undefined ? requestBody.username : userState.username;
            setUserBasicInfo(userState.usertype, userName, userSubscription);
          } else {
            alert(res.error);
          }
        }
      ).then(res => navigation.goBack())
  }

  return (
    <View style={profile.isArtist ? styles.containerArtist : styles.containerListener}>
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <ProfilePicture
              uid={profile.id}
              username={profile.username}
              style={styles.avatar}
              photoUrl={profile.photoUrl}
              pictureSize={175}
              disabled={false}
              defaultStyle={styles.defaultImage}
              Imagestyle={styles.profilePicture}
            />

            <View style={{flexDirection: 'row', alignSelf: 'center', marginTop: 10}}>
              <EditProfileTextInput
                label='Nombre'
                name='username'
                input={profile.username}
                execute={dispatch}
                styles={styles.name}/>
            </View>
            {profile.isListener &&
              (
                <>
                  <View style={{flexDirection: 'row', flex: 1, justifyContent: 'center', marginTop: 18}}>
                    <Text style={{
                      fontSize: 18,
                      marginTop: 5,
                      marginBottom: 5,
                      alignSelf: 'center',
                      color: 'steelblue'
                    }}>Suscripción: </Text>
                    <Button style={styles.buttonSubscriptionStyle}
                            onPress={showModalSubscription}><Text style={{
                      marginTop: 5,
                      marginBottom: 5,
                      alignSelf: 'center'
                    }}>{subscription[profile.subscription].label}</Text></Button>
                    <Portal>
                      <Modal visible={visible} onDismiss={hideModalSubscription} contentContainerStyle={styles.modal}>
                        <Text style={{
                          alignSelf: 'center',
                          fontSize: 18,
                          color: 'steelblue'
                        }}>Escoja la suscripción deseada</Text>
                        <SubscriptionDropDown
                          name='Suscripción'
                          value={subscriptionValue}
                          setValue={newSubscription => handleNewSubscription(newSubscription)}
                        />
                        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                          <Button disabled={buttonDisabled} mode='contained'
                                  onPress={handleUpdateSubscription}>{'Aceptar'}</Button>
                          <Button mode='contained' style={{backgroundColor: 'red'}}
                                  onPress={hideModalSubscription}>Cancelar</Button>
                        </View>
                      </Modal>
                    </Portal>
                  </View>
                  <Text style={styles.text}>Intereses Musicales</Text>
                  <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap'}}>
                    <Chip
                      style={profile.metal ? styles.chipSelected : styles.chipUnselected}
                      onPress={() => {
                        dispatch({type: 'metal'})
                      }}
                    >
                      <Text> Metal</Text>
                    </Chip>
                    <Chip
                      style={profile.rock ? styles.chipSelected : styles.chipUnselected}
                      onPress={() => {
                        dispatch({type: 'rock'})
                      }}
                    >
                      <Text> Rock</Text>
                    </Chip>
                    <Chip
                      style={profile.salsa ? styles.chipSelected : styles.chipUnselected}
                      onPress={() => {
                        dispatch({type: 'salsa'})
                      }}
                    >
                      <Text> Salsa</Text>
                    </Chip>
                    <Chip
                      style={profile.blues ? styles.chipSelected : styles.chipUnselected}
                      onPress={() => {
                        dispatch({type: 'blues'})
                      }}
                    >
                      <Text> Blues</Text>
                    </Chip>
                    <Chip
                      style={profile.reggeaton ? styles.chipSelected : styles.chipUnselected}
                      onPress={() => {
                        dispatch({type: 'reggeaton'})
                      }}
                    >
                      <Text>Reggaeton</Text>
                    </Chip>
                    <Chip
                      style={profile.jazz ? styles.chipSelected : styles.chipUnselected}
                      onPress={() => {
                        dispatch({type: 'jazz'})
                      }}
                    >
                      <Text> Jazz</Text>
                    </Chip>
                    <Chip
                      style={profile.punk ? styles.chipSelected : styles.chipUnselected}
                      onPress={() => {
                        dispatch({type: 'punk'})
                      }}
                    >
                      <Text> Punk</Text>
                    </Chip>
                    <Chip
                      style={profile.rap ? styles.chipSelected : styles.chipUnselected}
                      onPress={() => {
                        dispatch({type: 'rap'})
                      }}
                    >
                      <Text> Rap</Text>
                    </Chip>
                    <Chip
                      style={profile.pop ? styles.chipSelected : styles.chipUnselected}
                      onPress={() => {
                        dispatch({type: 'pop'})
                      }}
                    >
                      <Text> Pop</Text>
                    </Chip>
                    <Chip
                      style={profile.indie ? styles.chipSelected : styles.chipUnselected}
                      onPress={() => {
                        dispatch({type: 'indie'})
                      }}
                    >
                      <Text> Indie</Text>
                    </Chip>
                    <Chip
                      style={profile.classic ? styles.chipSelected : styles.chipUnselected}
                      onPress={() => {
                        dispatch({type: 'classic'})
                      }}
                    >
                      <Text> Clásica</Text>
                    </Chip>
                    <Chip
                      style={profile.electronic ? styles.chipSelected : styles.chipUnselected}
                      onPress={() => {
                        dispatch({type: 'electronic'})
                      }}
                    >
                      <Text>Electronica</Text>
                    </Chip>
                    <Chip
                      style={profile.others ? styles.chipSelected : styles.chipUnselected}
                      onPress={() => {
                        dispatch({type: 'others'})
                      }}
                    >
                      <Text> Otros</Text>
                    </Chip>
                  </View>
                </>)
            }

            <View>
              <Button
                mode='contained'
                color='skyblue'
                style={{width: 120, alignSelf: 'center', margin: 30}}
                onPress={saveProfile}>
                <Text>Guardar</Text>
              </Button>
            </View>


          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create(
  {
    containerArtist: {
      flex: 1,
      backgroundColor: '#B0E0E6',
      paddingTop: 15
    },
    containerListener: {
      flex: 1,
      backgroundColor: '#f5fcff',
      paddingTop: 15
    },
    avatar: {
      marginTop: 30,
      alignSelf: 'center',
      marginBottom: 50
    },
    name: {
      width: 300,
      fontSize: 17,
      height: 80,
      alignSelf: 'center',
      backgroundColor: '#f5fcff',
      marginBottom: 10,
      marginRight: 7,
      marginLeft: 7
    },

    email: {
      alignSelf: 'center',
      fontSize: 17,
      marginBottom: 10,
      color: 'darkblue'
    },
    phone: {
      width: 144,
      fontSize: 17,
      height: 50,
      alignSelf: 'center',
      backgroundColor: '#f5fcff',
      marginBottom: 10,
      marginRight: 7,
      marginLeft: 7
    },

    usertype: {
      alignSelf: 'center',
      color: 'purple',
      fontSize: 23,
      marginBottom: 15
    },
    chipSelected: {
      backgroundColor: 'lightblue',
      width: 95,
      marginRight: 8,
      marginStart: 10,
      marginEnd: 10,
      marginBottom: 10,
      marginTop: 0,
    },
    chipUnselected: {
      backgroundColor: '#adb8e6',
      width: 95,
      marginRight: 8,
      marginStart: 10,
      marginEnd: 10,
      marginBottom: 10,
      marginTop: 0,
    },
    mucialPref: {
      alignSelf: 'center'
    },
    text: {
      alignSelf: 'center',
      fontSize: 18,
      marginBottom: 13,
      marginTop: 26,
      color: 'steelblue'
    },
    buttonSubscriptionStyle: {
      alignSelf: 'center',
      marginTop: 5,
      marginBottom: 5,
      height: 35,
      backgroundColor: 'skyblue'
    },
    modal: {
      height: 200,
      width: 300,
      padding: 20,
      borderRadius: 10,
      alignSelf: 'center',
      justifyContent: 'space-around',
      backgroundColor: 'white'
    },
    defaultImage: {
      marginTop: 40,
      marginBottom: 50,
      alignSelf: 'center',
    },
    profilePicture: {
      marginTop: 40,
      marginBottom: 50,
      alignSelf: 'center',
    }
  }
)

export default EditProfileScreen;
