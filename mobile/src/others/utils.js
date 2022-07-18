import sjcl from 'sjcl';
import constants from './constants'
import * as Location from "expo-location";
import * as SecureStore from 'expo-secure-store';
import defaultArtwork from "../../assets/music-placeholder.png";


function getSHAOf(toHash) {
  const myBitArray = sjcl.hash.sha256.hash(toHash)
  const myHash = sjcl.codec.hex.fromBits(myBitArray)
  return myHash;
}

function getBiometricalMailAndPassword(biometricId) {

  const email = biometricId.slice(1, 19) + "@gmail.com";
  const password = biometricId.slice(20, 37);

  return {email: email, password: password};
}

async function requestLocation() {

  try {
    let {status} = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert("No es posible continuar con el registro si no habilita una ubicación");
      return null;
    }

    return await Location.getCurrentPositionAsync({});

  } catch (error) {
    alert("Error: no se pudo acceder a la ubicación del dispositivo. Por favor, habilítela para poder registrarse");
    return null
  }
}

const requestToGateway = (verb, redirectURL, body = {}) => {
  body.verbRedirect = verb;
  body.apiKey = constants.MY_API_KEY;
  body.redirectTo = redirectURL;

  return fetch(constants.SERVICES_HOST + constants.REDIRECT_URL, {
        method: "POST",
        headers: constants.JSON_HEADER,
        body: JSON.stringify(body)
      }
  );
}

// response.json() is a promise
const postToGateway = (body,
                       verb = "POST") => {
  body.verbRedirect = verb;
  body.apiKey = constants.MY_API_KEY;

  return fetch(constants.SERVICES_HOST + constants.REDIRECT_URL, {
        method: "POST",
        headers: constants.JSON_HEADER,
        body: JSON.stringify(body)
      }
  ).then(response => {
       return response.json()
      }
  ).catch(error => {
    let errorToShow = error.toString();

    if (errorToShow.includes("JSON")) {
      errorToShow = "La app no puede enviar la solicitud."
    }

    return {
      error: errorToShow
    };
  } );
}

const getToGateway = (destiny,
                      redirectParams) => {
  const body = {}
  body.redirectParams = redirectParams
  body.verbRedirect = "GET";
  body.redirectTo = destiny;
  body.apiKey = constants.MY_API_KEY;

  return fetch(constants.SERVICES_HOST + constants.REDIRECT_URL, {
        method: "POST",
        headers: constants.JSON_HEADER,
        body: JSON.stringify(body)
      }
  ).then(response => {
        return response.json()
      }
  ).catch(error => {
    return {
      error: error.toString()
    };
  } );
}

const validateFieldNotBlank = (fieldName, field, setField) => {
  const value = field.value;
  if (value === '' || value === null || value === undefined || value.length === 0) {
    setField({value, error: `El campo "${fieldName}" debe ser completado`});
    return false;
  }
  return true;
}

async function checkAuthTokenExpirationTime() {

  const begin = Number(await SecureStore.getItemAsync(constants.SS_TIMESTAMP_LABEL));
  const now = Date.now()
  const dif = now - begin;

  return (dif < 3600000);
}

function getChatId(idEmissor, idReceptor) {

  if (idEmissor < idReceptor)
    return `chat-${idEmissor}-${idReceptor}`;

  else
    return `chat-${idReceptor}-${idEmissor}`;
}

const songToTrack = (song) => {
  return {
    id: song.id,
    url: song.link,
    title: song.title,
    artist: song.author,
    artwork: song.artwork ? {uri: song.artwork} : defaultArtwork,
    subscription: song.subscription,
  };
};

const playlistToPlayable = playlist => {
  return {
    title: playlist.title,
    artwork: playlist.artwork ? {uri: playlist.artwork} : defaultArtwork,
  };
}

export {
  getSHAOf,
  getBiometricalMailAndPassword,
  requestLocation,
  requestToGateway,
  postToGateway,
  getToGateway,
  validateFieldNotBlank,
  checkAuthTokenExpirationTime,
  getChatId,
  songToTrack,
  playlistToPlayable,
}
