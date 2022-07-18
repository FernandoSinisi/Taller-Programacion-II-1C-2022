import { 
    StyleSheet, 
    View, 
    Image,
    SafeAreaView,
    ScrollView
  } from 'react-native';
  
import React, {useState} from 'react'
import imageSpotifiuby from '../../assets/SpotifiubyImage.png'
import { Button, Text, Title, IconButton } from 'react-native-paper'
import constants from "../others/constants"
import { useRoute } from '@react-navigation/native';
import {postToGateway, requestLocation} from "../others/utils"
import { useAuthUser } from '../context/AuthContext';
import { auth } from "../Firebase/firebase";
const firebaseAuth = require("firebase/auth");

export default RequestExternalUserATypeScreen = ({navigation}) => {
    const route = useRoute();
    const {signIn} = useAuthUser();

    const [isArtist, setIsArtist] = useState(false);
    const [isListener, setIsListener] = useState(false);
    const [isBand, setIsBand] = useState(false);
    const [userTypeError, setUserTypeError] = useState(null);

    let handleSend = async () => {

        let params = route.params;
        let body = params.body;

        if (! validate()){
            return;
        }

        if (isListener) {
            const locaction = requestLocation(body.email);
            body['latitude'] = locaction.latitude;
            body['longitude'] = locaction.longitude;
        }

        body['isListener'] = isListener;
        body['isArtist'] = isArtist;
        body['isBand'] = isBand;
        body['redirectTo'] = constants.USERS_HOST + constants.SIGN_IN_URL;

        if ( isBand ){
            body['isArtist'] = true;
        }

        const response = await postToGateway(body);


        if (response.error !== undefined) {
            alert(response.error);
        } else {
            if (body.signin === 'biometric') {
                firebaseAuth.signInWithEmailAndPassword(
                    auth,
                    body.email,
                    body.password)
                    .then(res => {
                        params['id'] = res.user.uid;
                        params['token'] = res._tokenResponse.idToken;
                        goTONextScreen(params);
                    })
                    .catch(err => alert(err));
            } else {
                goTONextScreen(params);
            }
        }
    }

        let goTONextScreen = (params) => {
            if (isListener) {
                navigation.navigate('RequestMusicalPreferencesScreen', params);
            } else {
                signIn(params.token, params.id);
            }
        }

        let validate = () => {
            
            let isValid = true
            if (!isArtist && !isListener && !isBand ) {
                setUserTypeError("Elija el tipo de usuario que desee ser")
                isValid = false;
            }

            return isValid;
        }

        return (
            <View style={styles.container}>
                <SafeAreaView>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View>
                            <Image source={imageSpotifiuby} style={styles.image}></Image>
                            <Title style={styles.title}></Title>
                            <Text style={{alignSelf: 'center', marginBottom: 40}}>Como esta ingresando de manera externa
                                por primera vez solicitamos que seleccione el tipo de usuario que desea ser.</Text>

                            <Title style={{fontSize: 17, marginTop: 20}}>Tipo de usuario:</Title>

                            <View style={{flexDirection: 'row', marginTop: 10, paddingRight: 100}}>
                                <View style={{flexDirection: 'column', marginHorizontal: 13}}>
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
                                    


                                <View style={{flexDirection: 'column', marginHorizontal: 13}}>
                                    <Title style={{fontSize: 14}}>Artista</Title>
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
                                <View style={{flexDirection: 'column', marginHorizontal: 13}}>
                                    <Title style={{fontSize: 14}}>Banda</Title>
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


                            <Button mode='contained' style={styles.button} onPress={handleSend}>
                                <Text style={styles.buttonText}>Enviar</Text>
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
            image: {height: 150, width: 150, borderRadius: 200, resizeMode: 'contain', paddingTop: 200, marginLeft: 84}
        }
    )
