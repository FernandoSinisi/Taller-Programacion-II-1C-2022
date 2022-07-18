import React, {useEffect, useState} from "react";
import {View, StyleSheet} from "react-native";
import {Text, Button} from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import MultiSelection from "../Components/MultiSelection";
import { getArtists } from "../Services/UsersService";
import {buttonTextStyle, buttonStyle} from '../styles/genericStyles';
import {validateFieldNotBlank} from "../others/utils";
import { postToGateway } from "../others/utils";
import constants from '../others/constants'
import { useAuthUser } from "../context/AuthContext";



const CreateBandScreen = ({navigation}) => {

    const [artists, setArtists] = useState({value: [], error: null});
    const {userState} = useAuthUser();

    useEffect(()=>{
        navigation.setOptions({ headerShown: true, headerTitle: 'Agregar Integrantes' });
      }, []);

    const filterArtist = text => {
        text = text.toLowerCase();
        return a => a.username.toLowerCase().includes(text);
      }

    const fieldsAreValid = () => {
        let ok = true;
        if (!validateFieldNotBlank('Artistas', artists, setArtists)) ok = false;
        return ok;
      }
    
    const resetState = () => {
        setArtists({value: [], error: null});
    }

    const handleCreateBand = async () => {
        if (!fieldsAreValid()) {
          return;
        }
        try {
          const request = {
            members: artists.value.map(a => a.id),
            bandId: userState.uid,
            redirectTo: constants.USERS_HOST + constants.BAND_URL
          };
          postToGateway(request, 'POST')
            .then(res =>{
                if ( res?.error !== undefined ){
                    alert(res.error);
                }
                else{
                    alert(`Integrantes agregados`);
                    resetState();
                    navigation.goBack();
                }
            })
          
        } catch (err) {
          alert('Ha ocurrido un error inesperado al agregar a los integrantes de la banda, por favor intente más tarde');
        }
      }
  

    return (
        
        <View style={styles.container}>
        <ScrollView>
            <View style={{...styles.button, marginTop: 15, marginBottom: 15}}>
                <MultiSelection selectedElements={artists.value}
                      searchPlaceholder={"Buscar artistas"}
                      buttonText={"Seleccionar integrantes"}
                      icon={'account-music'}
                      renderElement={artist => (<Text>{`${artist.username}`}</Text>)}
                      getAllElements={() => getArtists().then(b => b.list)}
                      elementFilter={filterArtist}
                      elementCallback={{
                      add: artist => setArtists({value: [...artists.value, artist], error: null}),
                      remove: artist => setArtists({
                          value: artists.value.filter(a => a.id !== artist.id),
                          error: null
                      }),
                      clear: () => setArtists({value: [], error: null}),
                      }}
                    />
            </View>


            <Button mode='contained'
                    style={styles.uploadButton}
                    onPress={handleCreateBand}>
                <Text style={buttonTextStyle}>Agregar</Text>
            </Button>
            
        </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'stretch',
    justifyContent: 'center',
    flexGrow: 1,
    backgroundColor: '#f5fcff',
  },
  title: {
    flex: 1,
    margin: 30,
    fontSize: 25,
    alignSelf: 'center',
  },
  button: {
    margin: 10,
    flex: 2,
    borderRadius: 5,
  },
  uploadButton: {
    ...buttonStyle,
    alignSelf: 'center',
    backgroundColor: 'lightblue',
    width: 160,
  }
});

export default CreateBandScreen;