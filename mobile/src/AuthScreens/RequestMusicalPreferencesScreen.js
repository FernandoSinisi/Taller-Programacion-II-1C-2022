import { 
    StyleSheet, 
    View, 
    Image,
    SafeAreaView,
    ScrollView
  } from 'react-native';
  
import React, {useReducer, useMemo} from 'react'
import imageSpotifiuby from '../../assets/SpotifiubyImage.png'
import { Button, Text, Title } from 'react-native-paper'
import { useRoute } from '@react-navigation/native';
import MusicalPreferenceCheckbox from '../Components/MusicalPreferenceCheckbox';
import { useAuthUser } from '../context/AuthContext';
import { MusicalPreferencesContext } from '../context/MusicalPreferencesContext';
import constants from "../others/constants";
import {postToGateway} from "../others/utils";
const firebaseAuth = require("firebase/auth");



const reducer = (state = initialState(), action = {})=>{

  switch(action.type){
      case 'metal':
      return{
          ...state,
          metal: (! state.metal)
      };
      case 'rock':
      return{
          ...state,
          rock: (! state.rock )
      };
      case 'jazz':
      return{
          ...state,
          jazz: (! state.jazz)
      };
      case 'blues':
      return{
          ...state,
          blues: (! state.blues)
      };
      case 'electronic':
      return{
          ...state,
          electronic: (! state.electronic),
      };
      case 'punk':
      return{
          ...state,
          punk: ( ! state.punk )
      };
      case 'pop':
      return{
          ...state,
          pop: (! state.pop),
      };
      case 'rap':
      return{
          ...state,
          rap: (! state.rap),
      };
      case 'indie':
      return{
          ...state,
          indie: (! state.indie),
      };
      case 'salsa':
      return{
          ...state,
          salsa: (! state.salsa),
      };
      case 'reggeaton':
      return{
          ...state,
          reggeaton: (! state.reggeaton),
      };
      case 'classic':
      return{
          ...state,
          classic: (! state.classic),
      };
      case 'other':
      return{
          ...state,
          other: (! state.other),
      };
      
  }
  return state;
  };


  const initialState = ()=>{
    return{
        jazz: false,
        rock: false,
        metal: false,
        punk: false,
        indie: false,
        salsa: false,
        electronic: false,
        classic: false,
        blues: false,
        pop: false,
        rap: false,
        reggeaton: false,
        other: false
        
    }
  };
  

  export default RequestMusicalPreferencesScreen = ({navigation}) =>{

      const route = useRoute();
      const {signIn} = useAuthUser();

      const [musicalPrefs, dispatch] = useReducer(reducer, reducer());


      const musicalPreferencesContext = useMemo(()=>{
          return ({
            musicalPrefs,
            check: (name) => {dispatch({type: name})}
            });

      },[musicalPrefs]);


      let handleSend = () => {
        const requestBody={
          musicalPref: musicalPrefs,
          redirectTo: constants.USERS_HOST + constants.MUSICAL_PREF_URL
                                           + "?"
                                           + constants.USER_ID_QUERY_PARAM
                                           + route.params.id
        };

        postToGateway(requestBody,
              'PATCH')
          .then( async res => {
              await checkResponse(res)
          });
      }

      let checkResponse = async (res)=>{

          if (res.error === undefined){
              signIn(route.params.token, route.params.id);
          }
          else{
            alert(res.error);
          }

      }

  
      return(
        <MusicalPreferencesContext.Provider value={musicalPreferencesContext}>
        <View style={styles.container}>
          <SafeAreaView>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View>
                  <Image source={imageSpotifiuby} style={styles.image}></Image>
                  <Title style={styles.title}>Ingrese sus Intereses Musicales</Title>
                  <Text style={styles.description}>Solicitamos que nos envie sus intereses musicales para poder conocer un poco mas de usted</Text>
                  
                  <View style={{flexDirection:'row'}}>
                        <View style={styles.row} >
                          <MusicalPreferenceCheckbox name='Metal' type='metal'  />
                          <MusicalPreferenceCheckbox name='Rap' type='rap'/>
                          <MusicalPreferenceCheckbox name='Pop' type='pop'/>
                        </View>
                        <View style={styles.row}>
                          <MusicalPreferenceCheckbox name='Jazz' type='jazz'/>
                          <MusicalPreferenceCheckbox name='Reggeaton' type='reggeaton'/>
                          <MusicalPreferenceCheckbox name='Rock' type='rock'/>
                        </View>
                        <View style={styles.row}>
                          <MusicalPreferenceCheckbox name='Electrónica' type='electronic'/>
                          <MusicalPreferenceCheckbox name='Indie' type='indie'/>
                          <MusicalPreferenceCheckbox name='Clásica' type='classic'/>
                        </View>
                        <View style={styles.row}>
                          
                          <MusicalPreferenceCheckbox name='Blues' type='blues'/>
                          <MusicalPreferenceCheckbox name='Punk' type='punk'/>
                          <MusicalPreferenceCheckbox name='Salsa' type='salsa'/>
                        </View>
                        
                  </View>
                  <View style={styles.row}>
                      <MusicalPreferenceCheckbox name='Otros' type='other'/>
                  </View>
            
                  

                  <Button 
                    mode='contained' 
                    style={styles.button}
                    onPress={handleSend}>
                      <Text style={styles.buttonText}>Enviar</Text>
                  </Button>
  
              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
        </MusicalPreferencesContext.Provider>
      )
    }
  
    const styles = StyleSheet.create(
       { input: {
           marginBottom: 15,
           marginTop: 15,
           backgroundColor: '#f5fcff',
           height: 60,
           width: 210,
           alignSelf: 'center',
           fontSize: 40,
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
            width: 150, 
            alignSelf: 'center', 
            marginTop: 30, 
            marginBottom:30,
            borderRadius: 10},
          description: {textAlign: 'center', fontSize: 13},
          buttonText: {textAlign: 'center', fontSize: 13},
          image:{height:  150, width: 150, borderRadius: 200, resizeMode: 'contain', paddingTop: 200, marginLeft: 84},
          row: { marginBottom: 30, alignSelf: 'center', flexDirection:'column',marginRight:30}}
    )