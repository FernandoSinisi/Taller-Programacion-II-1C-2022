import {ScrollView, StyleSheet, View} from 'react-native';
import React, {useState} from 'react'
import {validateFieldNotBlank} from '../others/utils';
import {buttonStyle, buttonTextStyle, containerStyle, titleStyle} from '../styles/genericStyles';
import {Button, Text, TextInput, Title} from 'react-native-paper';
import FilePicker from '../Components/FilePicker';
import {uploadFile} from '../Services/CloudStorageService';
import {createSong} from '../Services/MediaService';
import {getArtists} from '../Services/UsersService';
import MultiSelection from "../Components/MultiSelection";
import GenreDropDown from "../Components/GenreDropDown";
import SubscriptionDropDown from "../Components/SubscriptionDropDown";
import { useRoute } from '@react-navigation/native';


const UploadSongScreen = () => {
  const [title, setTitle] = useState({value: '', error: null});
  const [description, setDescription] = useState('');
  const [artists, setArtists] = useState([]);
  const [genre, setGenre] = useState({value: '', error: null});
  const [subscription, setSubscription] = useState({value: '', error: null});
  const [file, setFile] = useState();
  const [artworkFile, setArtworkFile] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const route = useRoute();

  const resetState = () => {
    setTitle({value: '', error: null});
    setDescription('');
    setArtists([]);
    setGenre({value: '', error: null});
    setSubscription({value: '', error: null});
    setFile(undefined);
    setArtworkFile(undefined);
    setIsLoading(false);
  }

  const validateFile = () => {
    if (file === null || file === undefined) {
      alert('Debe seleccionar un archivo');
      return false;
    }
    return true;
  }
  const filterArtist = text => {
    text = text.toLowerCase();
    return a => a.username.toLowerCase().includes(text);
  }

  const fieldsAreValid = () => {
    let ok = true;
    if (!validateFile()) ok = false;
    if (!validateFieldNotBlank('Título', title, setTitle)) ok = false;
    if (!validateFieldNotBlank('Genero', genre, setGenre)) ok = false;
    if (!validateFieldNotBlank('Subscripción', subscription, setSubscription)) ok = false;
    return ok;
  }

  const handleDocumentPick = (doc) => {
    if (title.value === '') {
      const name = doc.name.split('.')[0];
      setTitle({value: name, error: null});
    }
    setFile(doc);
  }
  const handleUpload = async () => {
    if (!fieldsAreValid()) {
      return;
    }
    setIsLoading(true);
    try {
      const name = file.name;
      const fileUrlPromise = file.contentPromise.then(res =>{
        return uploadFile(res, name);
      });
      const artworkUrlPromise = artworkFile?.contentPromise.then(res => {
        return uploadFile(res, `artwork-${title.value}`);
      })
      const song = await createSong({
        title: title.value,
        link: await fileUrlPromise,
        artists: artists.map(a => a.id),
        description,
        author: artists.map(a => `${a.username}`).join(', '),
        genre: genre.value,
        subscription: subscription.value,
        artwork: artworkUrlPromise ? await artworkUrlPromise : null,
      });
      console.log(`Song created: ${JSON.stringify(song)}`);
      resetState();
      alert('Canción subida!');
      route.params.navigation.goBack();
    } catch (err) {
      console.log(JSON.stringify(err));
      alert('Ha ocurrido un error inesperado al subir la canción, por favor intente más tarde');
    }
  }

  return (
    <View style={containerStyle}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Title style={styles.title}>Nueva Canción</Title>
        <TextInput
          name='Titulo'
          label='Titulo*'
          value={title.value}
          onChangeText={newText => setTitle({value: newText, error: null})}
          mode='outlined'
          error={title.error !== null}/>
        {title.error && (<Text style={{color: 'red'}}>{title.error}</Text>)}
        <TextInput
          name='Descripción'
          label='Descripción'
          value={description}
          onChangeText={newText => setDescription(newText)}
          mode='outlined'/>
        <GenreDropDown
          name='Género'
          value={genre.value}
          setValue={newGenre => setGenre({value: newGenre, error: null})}
        />
        {genre.error && (<Text style={{color: 'red'}}>{genre.error}</Text>)}
        <SubscriptionDropDown
          name='Suscripción'
          value={subscription.value}
          setValue={newSubscription => setSubscription({value: newSubscription, error: null})}
        />
        {subscription.error && (<Text style={{color: 'red'}}>{subscription.error}</Text>)}
        <View style={{marginBottom: 5}}/>
        <MultiSelection selectedElements={artists}
                        searchPlaceholder={"Buscar artistas"}
                        buttonText={"Seleccionar artistas"}
                        icon={'account-music'}
                        renderElement={artist => (<Text>{`${artist.username}`}</Text>)}
                        getAllElements={() => getArtists().then(b => b.list)}
                        elementFilter={filterArtist}
                        elementCallback={{
                          add: artist => setArtists([...artists, artist]),
                          remove: artist => setArtists(artists.filter(a => a.id !== artist.id)),
                          clear: () => setArtists([]),
                        }}
        />
        <View style={{marginBottom: 5}}/>
        <FilePicker title={`${file ? 'Cambiar' : 'Elegir'} canción`} mimeType={'audio/*'} icon={'file-music'}
                    setFileCallback={handleDocumentPick}/>
        <View style={{marginBottom: 5}}/>
        <FilePicker title={`${artworkFile ? 'Cambiar' : 'Elegir'} foto de portada`} mimeType={'image/*'} icon={'camera'}
                    setFileCallback={setArtworkFile}/>
        <Button mode='contained'
                style={styles.button}
                onPress={handleUpload}
                loading={isLoading}
                disabled={isLoading}>
          <Text style={styles.buttonText}>{isLoading ? 'Publicando...' : 'Publicar'}</Text>
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  title: titleStyle,
  button: {
    ...buttonStyle,
    width: 200,
  },
  buttonText: buttonTextStyle,
})
export default UploadSongScreen;
