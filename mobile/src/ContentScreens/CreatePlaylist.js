import React, {useState, useEffect} from 'react'
import {validateFieldNotBlank} from "../others/utils";
import {ScrollView, StyleSheet, View} from "react-native";
import {buttonStyle, buttonTextStyle, containerStyle, inputStyle, titleStyle} from "../styles/genericStyles";
import {Button, RadioButton, Text, TextInput, Title} from "react-native-paper";
import MultiSelection from "../Components/MultiSelection";
import {createPlaylist, getAllSongs} from "../Services/MediaService";
import FilePicker from "../Components/FilePicker";
import {uploadFile} from "../Services/CloudStorageService";
import {useRoute} from "@react-navigation/native";

const CreatePlaylist = ({navigation}) => {
  const route = useRoute();
  const {userId} = route.params;
  const [title, setTitle] = useState({value: '', error: null});
  const [description, setDescription] = useState('');
  const [songs, setSongs] = useState({value: [], error: null});
  const [artworkFile, setArtworkFile] = useState();
  const [isPublic, setIsPublic] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(()=>{
    navigation.setOptions({ headerShown: true, headerTitle: 'Crear Playlist' });
  }, []);


  const resetState = () => {
    setTitle({value: '', error: null});
    setDescription('');
    setSongs({value: [], error: null});
    setArtworkFile(undefined);
    setIsPublic(false);
    setIsLoading(false);
  }

  const fieldsAreValid = () => {
    let ok = true;
    if (!validateFieldNotBlank('Título', title, setTitle)) ok = false;
    if (!validateFieldNotBlank('Canciones', songs, setSongs)) ok = false;
    return ok;
  }

  const handleUpload = async () => {
    if (!fieldsAreValid()) {
      return;
    }
    setIsLoading(true);
    try {
      const artworkUrlPromise = artworkFile?.contentPromise.then(res => {
        return uploadFile(res, `artwork-${title.value}`);
      })
      const song = await createPlaylist({
        title: title.value,
        description,
        owner: userId,
        songs: songs.value.map(s => s.id),
        artwork: artworkUrlPromise ? await artworkUrlPromise : null,
        // TODO: as a workaround, i'm using isCollaborative field as isPublic to avoid changing the backend
        isCollaborative: isPublic,
      }).catch(async e => {
        console.log(JSON.stringify(await e.json()));
        throw e;
      });
      console.log(`Playlist created: ${JSON.stringify(song)}`);
      resetState();
      alert('Playlist creada!');
      navigation.goBack();
    } catch (err) {
      console.log(JSON.stringify(err));
      alert('Ha ocurrido un error inesperado al crear la playlist, por favor intente más tarde');
    }
  }

  const filterSong = text => {
    text = text.toLowerCase();
    return s => s.title.toLowerCase().includes(text);
  }

  return (
    <View style={containerStyle}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Title style={titleStyle}>Nueva Playlist</Title>

        <TextInput
          name='Título'
          label='Título*'
          value={title.value}
          onChangeText={newText => setTitle({value: newText, error: null})}
          mode='outlined'
          error={title.error !== null}
          style={inputStyle}
        />
        {title.error && (<Text style={{color: 'red'}}>{title.error}</Text>)}
        <TextInput
          name='Descripción'
          label='Descripción'
          value={description}
          onChangeText={newText => setDescription(newText)}
          mode='outlined'/>
        <View style={{marginBottom: 10}}/>
        <MultiSelection selectedElements={songs.value}
                        searchPlaceholder={"Buscar canciones"}
                        buttonText={"Seleccionar canciones"}
                        icon={'music-box-multiple-outline'}
                        renderElement={song => (<Text>{`${song.title} - ${song.author}`}</Text>)}
                        getAllElements={getAllSongs}
                        elementFilter={filterSong}
                        elementCallback={{
                          add: song => setSongs({value: [...songs.value, song], error: null}),
                          remove: song => setSongs({value: songs.value.filter(s => s.id !== song.id), error: null}),
                          clear: () => setSongs({value: [], error: null}),
                        }}
        />
        {songs.error && (<Text style={{color: 'red'}}>{songs.error}</Text>)}
        <View style={{marginBottom: 5}}/>


        <FilePicker title={`${artworkFile ? 'Cambiar' : 'Elegir'} foto de portada`} mimeType={'image/*'} icon={'camera'}
                    setFileCallback={setArtworkFile}/>
        <RadioButton.Group onValueChange={value => setIsPublic(value)} value={isPublic}>
          <RadioButton.Item
            value={true}
            label="Pública"
            position='leading'
          />
          <RadioButton.Item
            value={false}
            label="Privada"
            position='leading'
          />
        </RadioButton.Group>
        <Button mode='contained'
                style={styles.button}
                onPress={handleUpload}
                loading={isLoading}
                disabled={isLoading}>
          <Text style={buttonTextStyle}>{isLoading ? 'Publicando...' : 'Publicar'}</Text>
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...containerStyle,
    paddingTop: 30
  },
  button: {
    ...buttonStyle,
    width: 200,
  }
})

export default CreatePlaylist;
