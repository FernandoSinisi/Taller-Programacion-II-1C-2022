import {Image, SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';

import React, {useState} from 'react'
import imageSpotifiuby from '../../assets/SpotifiubyImage.png'
import {Button, IconButton, Text, TextInput, Title} from 'react-native-paper'
import {getSHAOf, postToGateway, requestLocation} from "../others/utils"
import constants from "../others/constants"


export default SignUpScreen = ({navigation}) => {

  const [id, setId] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [repeatPasswordError, setRepeatPasswordError] = useState(null);
  const [securePassword, setSecurePassword] = useState(true);
  const [secureRepeatPassword, setSecureRepeatPassword] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState(null);
  const [usernameError, setUsernameError] = useState(null);
  const [isListener, setIsListener] = useState(false);
  const [isArtist, setIsArtist] = useState(false);
  const [isBand, setIsBand] = useState(false);
  const [userTypeError, setUserTypeError] = useState(null);

  let handleSignUp = async () => {

    if (!validate()) {
      alert("Error: no se puede registar al usuario por valores invalidos");
      return;
    }

    let location = null;

    const requestBody = {
      username: username,
      email: email,
      phoneNumber: phoneNumber,
      password: getSHAOf(getSHAOf(password)),
      repeatPassword: getSHAOf(getSHAOf(repeatPassword)),
      isArtist: isArtist,
      isListener: isListener,
      isBand: isBand,
      link: "mobile",
      isExternal: false,
    };

    if (isListener) {
      location = await requestLocation()
    }

    if (location === null || !isListener) {
      requestBody['latitude'] = 0;
      requestBody['longitude'] = 0;
    } else {
      requestBody['latitude'] = location.coords.latitude;
      requestBody['longitude'] = location.coords.longitude;
    }

    if (isBand) {
      requestBody["isArtist"] = true;
    }

    requestBody['redirectTo'] = constants.USERS_HOST + constants.SIGN_UP_URL;
    postToGateway(requestBody)
      .then((response) => {
        checkResponse(response);
      });
  }


  let checkResponse = (res) => {

    if (res.id) {
      setId(res.id);
    }

    if (res.error === undefined || res.error === "Ya hay un usuario con ese mail pendiente de confirmación") {
      navigation.navigate('PINScreen',
        {
          email: email,
          password: getSHAOf(getSHAOf(password)),
          isListener: isListener,
          tempId: (id === '') ? res.id : id
        });

    } else {
      alert(res.error);
    }
  }

  let validate = () => {
    let ok = true;
    if (username === '') {
      setUsernameError('Campo "Nombre" debe ser completado');
      ok = false;
    }

    if (password === '') {
      setPasswordError('Campo "Contraseña" debe ser completado');
      ok = false;
    }
    if (email === '') {
      setEmailError('Campo "Mail" debe ser completado');
      ok = false;
    }

    if (phoneNumber === '') {
      setPhoneNumberError('Campo "Telefono" debe ser completado');
      ok = false;
    }
    if (repeatPassword === '') {
      setRepeatPasswordError('Campo "Repetir Contraseña" debe ser completado');
      ok = false;
    }

    if (password.length < constants.MIN_LENGTH_PASSWORD && password !== '') {
      setPasswordError('La Contraseña debe tener como minimo 10 caracteres');
      ok = false;
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) && email !== '') {
      setEmailError('No tiene formato de mail');
      ok = false;
    }

    if (password !== repeatPassword) {
      setRepeatPasswordError('Debe coincidir con la contraseña que ingresaste');
      ok = false;
    }

    if (!isArtist && !isListener && !isBand) {
      setUserTypeError("Elija el tipo de usuario que desee ser");
      ok = false;
    }

    return ok;
  }

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <Image source={imageSpotifiuby} style={styles.image}></Image>
            <Title style={styles.title}>Registrarse en Spotifiuby</Title>
            <Title>Ingrese sus datos:</Title>

            <TextInput
              name='Username'
              label='Nombre*'
              value={username}
              onChangeText={(newText) => {
                setUsername(newText);
                setUsernameError(null);
              }}
              mode='outlined'
              error={usernameError !== null}
              style={styles.input}/>

            {usernameError && (
              <Text style={{color: 'red'}}>{usernameError}</Text>
            )}

            <TextInput
              name='Mail'
              label='Mail*'
              value={email}
              onChangeText={(newText) => {
                setEmail(newText);
                setEmailError(null);
              }}
              mode='outlined'
              error={emailError !== null}
              style={styles.input}/>

            {emailError && (
              <Text style={{color: 'red'}}>{emailError}</Text>
            )}

            <TextInput
              name='PhoneNumber'
              label='Telefono*'
              value={phoneNumber}
              onChangeText={(newText) => {
                setPhoneNumber(newText);
                setPhoneNumberError(null);
              }}
              mode='outlined'
              error={phoneNumberError !== null}
              style={styles.input}/>

            {phoneNumberError && (
              <Text style={{color: 'red'}}>{phoneNumberError}</Text>
            )}

            <TextInput
              name='Password'
              label='Contraseña*'
              value={password}
              onChangeText={(newText) => {
                setPassword(newText);
                setPasswordError(null);
              }}
              mode='outlined'
              error={passwordError !== null}
              secureTextEntry={securePassword}
              right={<TextInput.Icon name="eye" onPress={() => {
                setSecurePassword(!securePassword)
              }}/>}
              style={styles.input}/>

            {passwordError && (
              <Text style={{color: 'red'}}>{passwordError}</Text>
            )}

            <TextInput
              name='Repeat-Password'
              label='Repetir Contraseña*'
              value={repeatPassword}
              onChangeText={(newText) => {
                setRepeatPassword(newText);
                setRepeatPasswordError(null);
              }}
              mode='outlined'
              error={repeatPasswordError !== null}
              secureTextEntry={secureRepeatPassword}
              right={<TextInput.Icon name="eye" onPress={() => {
                setSecureRepeatPassword(!secureRepeatPassword)
              }}/>}
              style={styles.input}
            />

            {repeatPasswordError && (
              <Text style={{color: 'red'}}>{repeatPasswordError}</Text>
            )}

            <Title style={{fontSize: 17, marginTop: 20}}>Tipo de usuario:</Title>

            <View style={{flexDirection: 'row', marginTop: 10, paddingRight: 100}}>
              <View style={{flexDirection: 'column', marginHorizontal: 10}}>
                <Title style={{fontSize: 14}}>Oyente</Title>
                <IconButton
                  icon="headphones"
                  color={isListener ? 'skyblue' : 'grey'}
                  size={50}
                  onPress={() => {
                    setIsListener(!isListener);
                    setUserTypeError(null);
                  }}
                />
              </View>

              <View style={{flexDirection: 'column', marginHorizontal: 10}}>
                <Title style={{fontSize: 14, alignSelf: 'center'}}>Artista</Title>
                <IconButton
                  icon='account'
                  color={isArtist ? 'skyblue' : 'grey'}
                  size={50}
                  onPress={() => {
                    setIsArtist(!isArtist);
                    setUserTypeError(null);
                  }}
                />
              </View>

              <View style={{flexDirection: 'column', marginHorizontal: 10}}>
                <Title style={{fontSize: 14, alignSelf: 'center'}}>Banda</Title>
                <IconButton
                  icon='account-group'
                  color={isBand ? 'skyblue' : 'grey'}
                  size={50}
                  onPress={() => {
                    setIsBand(!isBand);
                    setUserTypeError(null);
                  }}
                />
              </View>


            </View>
            {userTypeError && (
              <Text style={{color: 'red'}}>{userTypeError}</Text>
            )}


            <Button mode='contained' style={styles.button} onPress={handleSignUp}>
              <Text style={styles.buttonText}>Iniciar</Text>
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
      marginBottom: 5,
      marginTop: 5,
      backgroundColor: 'white',
      height: 60
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
      width: 100,
      alignSelf: 'center',
      marginTop: 30,
      marginBottom: 30,
      borderRadius: 10
    },
    buttonText: {textAlign: 'center', fontSize: 13},
    forgotPasswordButton: {textAlign: 'center', fontSize: 13, color: 'skyblue'},
    image: {height: 150, width: 150, borderRadius: 200, resizeMode: 'contain', paddingTop: 200, alignSelf: 'center'}
  }
)
