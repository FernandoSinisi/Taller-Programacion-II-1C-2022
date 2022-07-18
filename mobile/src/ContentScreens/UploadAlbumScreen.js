import {ScrollView, StyleSheet, View} from "react-native";
import {Button, Text, TextInput, Title} from "react-native-paper";
import React, {useState} from "react";
import {buttonStyle, buttonTextStyle, containerStyle, inputStyle, titleStyle} from '../styles/genericStyles';
import FilePicker from "../Components/FilePicker";
import {uploadFile} from "../Services/CloudStorageService";
import {createAlbum, getSongsByArtist} from "../Services/MediaService";
import {getArtists} from '../Services/UsersService';
import {validateFieldNotBlank} from "../others/utils";
import GenreDropDown from "../Components/GenreDropDown";
import SubscriptionDropDown from "../Components/SubscriptionDropDown";
import {useAuthUser} from "../context/AuthContext";
import MultiSelection from "../Components/MultiSelection";
import { useRoute } from '@react-navigation/native';

const UploadAlbumScreen = () => {
  const [title, setTitle] = useState({value: '', error: null});
  const [genre, setGenre] = useState({value: '', error: null});
  const [subscription, setSubscription] = useState({value: '', error: null});
  const [artists, setArtists] = useState({value: [], error: null});
  const [songs, setSongs] = useState({value: [], error: null});
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState();
  const {userState} = useAuthUser();
  const route = useRoute();

  const resetState = () => {
    setTitle({value: '', error: null});
    setGenre({value: '', error: null});
    setSubscription({value: '', error: null});
    setArtists({value: [], error: null});
    setSongs({value: [], error: null});
    setIsLoading(false);
    setFile(undefined);
  }

  const fieldsAreValid = () => {
    let ok = true;
    if (!validateFieldNotBlank('Título', title, setTitle)) ok = false;
    if (!validateFieldNotBlank('Género', genre, setGenre)) ok = false;
    if (!validateFieldNotBlank('Suscripción', subscription, setSubscription)) ok = false;
    if (!validateFieldNotBlank('Artistas', artists, setArtists)) ok = false;
    if (!validateFieldNotBlank('Canciones', songs, setSongs)) ok = false;
    return ok;
  }

  const filterSong = text => {
    text = text.toLowerCase();
    return s => s.title.toLowerCase().includes(text);
  }

  const filterArtist = text => {
    text = text.toLowerCase();
    return a => a.username.toLowerCase().includes(text);
  }

  const handleUpload = async () => {
    if (!fieldsAreValid()) {
      return;
    }
    setIsLoading(true);
    let fileUrlPromise;
    console.log(JSON.stringify(file));
    if (file) {
      fileUrlPromise = file.contentPromise.then(res => {
        return uploadFile(res, `artwork-album-${title.value}`);
      });
      console.log(fileUrlPromise);
    }
    try {
      const album = await createAlbum({
        title: title.value,
        genre: genre.value,
        subscription: subscription.value,
        artists: artists.value.map(a => a.id),
        songs: songs.value.map(s => s.id),
        link: await fileUrlPromise,
      });
      console.log(`Album created: ${JSON.stringify(album)}`);
      resetState();
      alert('Album creado!');
      route.params.navigation.goBack();
    } catch (err) {
      console.log(JSON.stringify(err));
      alert('Ha ocurrido un error inesperado al crear el álbum, por favor intente más tarde');
    }
  }

  return (
    <View style={containerStyle}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Title style={titleStyle}>Nuevo Album</Title>

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
        <GenreDropDown
          name='Género'
          value={genre.value}
          setValue={newGenre => setGenre({value: newGenre, error: null})}
        />
        {genre.error && (<Text style={{color: 'red'}}>{genre.error}</Text>)}
        <View style={{marginBottom: 5}}/>
        <SubscriptionDropDown
          name='Suscripción'
          value={subscription.value}
          setValue={newSubscription => setSubscription({value: newSubscription, error: null})}
        />
        {subscription.error && (<Text style={{color: 'red'}}>{subscription.error}</Text>)}
        <View style={{marginBottom: 5}}/>
        <MultiSelection selectedElements={artists.value}
                        searchPlaceholder={"Buscar artistas"}
                        buttonText={"Seleccionar artistas"}
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
        {artists.error && (<Text style={{color: 'red'}}>{artists.error}</Text>)}
        <View style={{marginBottom: 5}}/>
        <MultiSelection selectedElements={songs.value}
                        searchPlaceholder={"Buscar canciones"}
                        buttonText={"Seleccionar canciones"}
                        icon={'music-box-multiple-outline'}
                        renderElement={song => (<Text>{`${song.title} - ${song.author}`}</Text>)}
                        getAllElements={() => getSongsByArtist(userState.uid)}
                        elementFilter={filterSong}
                        elementCallback={{
                          add: song => setSongs({value: [...songs.value, song], error: null}),
                          remove: song => setSongs({value: songs.value.filter(s => s.id !== song.id), error: null}),
                          clear: () => setSongs({value: [], error: null}),
                        }}
        />
        {songs.error && (<Text style={{color: 'red'}}>{songs.error}</Text>)}
        <View style={{marginBottom: 5}}/>


        <FilePicker title={`${file ? 'Cambiar' : 'Elegir'} foto de portada`} mimeType={'image/*'} icon={'camera'}
                    setFileCallback={setFile}/>

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
export default UploadAlbumScreen;
