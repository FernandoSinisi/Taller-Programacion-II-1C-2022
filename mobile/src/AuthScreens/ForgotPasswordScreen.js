import { 
    StyleSheet, 
    View, 
    Image,
    ScrollView,
    SafeAreaView,
  } from 'react-native';
  
import React, {useState} from 'react'
import imageSpotifiuby from '../../assets/SpotifiubyImage.png'
import { TextInput, Button, Text, Title } from 'react-native-paper'
import constants from "../others/constants";
import {postToGateway} from "../others/utils";

  
export default ForgotPasswordScreen = ({navigation}) =>{
  
      const [email,setEmail] = useState('');
      const [emailError,setEmailError] = useState(null);

      let validate = () =>{

        let isValid = true;
      
        if ( email === '' ) {
          setEmailError('Campo "Mail" debe ser completado');
          isValid = false;
        }
        
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
          setEmailError('No tiene formato de mail');
          isValid = false;
        }
          
        return isValid;
      }
  
      let handleForgotPassword = async () =>{

        if (! validate()) {
          return;
        }

        const body = {
            email: email,
            link: 'mobile',
            redirectTo: constants.USERS_HOST + constants.FORGOT_PASSWORD_URL
        };
  
        postToGateway(body)
        .then((response)=>{
            if (response.error === undefined ){
              alert("Cuenta confirmada: acceder a su casilla para cambiar contraseña");
              navigation.navigate('SignInScreen');
            }
            else{
              alert(response.error);
            }
          });
      }
  
      return(
        <View style={styles.container}>
          <SafeAreaView>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View>
                  <Image source={imageSpotifiuby} style={styles.image}></Image>
                  <Title style={styles.title}>¿Ha olvidado su contraseña?</Title>
                  
                  <TextInput
                      name='mail'
                      label='Mail*'
                      mode='outlined'
                      value={email}
                      onChangeText={(text) =>{setEmail(text);setEmailError(null);}}
                      error={emailError!==null}
                   />
                   {emailError &&(
                      <Text style={{color: 'red'}}>{emailError}</Text>
                    )}

                  <Button mode='contained' style={styles.button} onPress={handleForgotPassword}>
                      <Text style={styles.buttonText}>Enviar</Text>
                  </Button>
  
              </View>
              </ScrollView>
          </SafeAreaView>
        </View>
      )
    }
  
    const styles = StyleSheet.create(
       { input: {
           borderWidth: 2,
           marginBottom: 15,
           marginTop: 15,
           backgroundColor: '#f5fcff',
           height: 60
          },
         container: {
           flex:1,
           backgroundColor: '#f5fcff',
           paddingLeft: 15,
           paddingRight: 15,
          },
          title: {textAlign: 'center',fontSize: 25, marginBottom: 35},
          button: {
            backgroundColor: 'skyblue', 
            paddingTop: 15, 
            paddingBottom:15, 
            width: 100, 
            alignSelf: 'center', 
            marginTop: 30, 
            marginBottom:30,
            borderRadius: 10},
          buttonText: {textAlign: 'center', fontSize: 13},
          forgotPasswordButton: {textAlign: 'center', fontSize: 13, color: 'skyblue'},
          image:{height:  150, width: 150, borderRadius: 200, resizeMode: 'contain', paddingTop: 200, marginLeft: 84}}
    )