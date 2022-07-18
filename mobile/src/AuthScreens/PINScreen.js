import {Image, SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';

import React, {useState} from 'react'
import imageSpotifiuby from '../../assets/SpotifiubyImage.png'
import {Button, Text, TextInput, Title} from 'react-native-paper'
import constants from "../others/constants"
import {useRoute} from '@react-navigation/native';
import {getToGateway} from "../others/utils";
import {auth} from '../Firebase/firebase'
import {useAuthUser} from '../context/AuthContext';

const firebaseAuth = require("firebase/auth");

const PINScreen = ({navigation}) => {

  const route = useRoute();
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(null);
  const [id, setId] = useState(route.params.tempId);
  const {signIn} = useAuthUser();


  let handleSignUp = () => {

    getToGateway(constants.USERS_HOST + constants.SIGN_UP_END_URL,
      `/${id}/${pin}`)
      .then((response) => {
        checkResponse(response);
      });
  }

  let checkResponse = async (res) => {
    if (res.error === undefined) {
      let args = route.params;
      args['id'] = res.id;

      const response = await firebaseAuth.signInWithEmailAndPassword(auth,
        route.params.email,
        route.params.password)
        .catch(err => {
          return {
            error: err.toString()
          };
        });

      if (response.error !== undefined) {
        alert("No se pudo iniciar sesión");
        return;
      }

      args['token'] = response._tokenResponse.idToken;


      if (route.params.isListener) {
        navigation.navigate('RequestMusicalPreferencesScreen', args);
      } else {
        signIn(response._tokenResponse.idToken, response.user.uid);
      }

    } else {
      alert(res.error);
    }
  }


  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <Image source={imageSpotifiuby} style={styles.image}></Image>
            <Title style={styles.title}>Ingrese PIN de validación</Title>
            <Text style={styles.description}>Hemos enviado un PIN a su telefono por mensaje a su cuenta Whatssap.
              Ingrese PIN para poder confirmar que es usted</Text>

            <TextInput
              name='PIN'
              label='PIN*'
              value={pin}
              onChangeText={(newText) => {
                setPin(newText);
                setPinError(null);
              }}
              mode='outlined'
              error={pinError !== null}
              style={styles.input}/>

            {pinError && (
              <Text style={{color: 'red'}}>{pinError}</Text>
            )}

            <Button mode='contained' style={styles.button} onPress={handleSignUp}>
              <Text style={styles.buttonText}>Enviar PIN</Text>
            </Button>

          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create(
  {
    input: {
      marginBottom: 15,
      marginTop: 15,
      backgroundColor: '#f5fcff',
      height: 60,
      width: 210,
      alignSelf: 'center',
      fontSize: 40,
    },
    container: {
      flex: 1,
      backgroundColor: '#f5fcff',
      paddingLeft: 15,
      paddingRight: 15,
    },
    title: {textAlign: 'center', fontSize: 25, marginBottom: 35},
    button: {
      backgroundColor: 'skyblue',
      paddingTop: 15,
      paddingBottom: 15,
      width: 150,
      alignSelf: 'center',
      marginTop: 30,
      marginBottom: 30,
      borderRadius: 10
    },
    description: {textAlign: 'center', fontSize: 13},
    buttonText: {textAlign: 'center', fontSize: 13},
    image: {height: 150, width: 150, borderRadius: 200, resizeMode: 'contain', paddingTop: 200, alignSelf: 'center'}
  }
)

export default PINScreen;