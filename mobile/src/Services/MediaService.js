import {requestToGateway} from '../others/utils';
import constants from '../others/constants';

const getBodyOrThrow = (response) => {
  console.log(response);

  if (response.status !== 200) {
    console.log(`Response error with status ${response.status}`);
    throw response;
  }

  return response.json();
}

const createSong = song => {
  console.log(`Song: ${JSON.stringify(song)}`);
  return requestToGateway('POST', `${constants.MEDIA_HOST}${constants.SONGS_URL}`, song)
    .then(getBodyOrThrow);
}

const createAlbum = album => {
  return requestToGateway('POST', `${constants.MEDIA_HOST}${constants.ALBUM_URL}`, album)
    .then(getBodyOrThrow);
}

const getSongsByArtist = (artistId) => {
  return requestToGateway('GET', `${constants.MEDIA_HOST}${constants.SONGS_URL}?artist=${artistId}`)
    .then(getBodyOrThrow);
}

const getAllSongs = () => {
  return requestToGateway('GET', constants.MEDIA_HOST + constants.SONGS_URL)
    .then(getBodyOrThrow);
}

const getAlbum = (albumId) => {
  return requestToGateway('GET', `${constants.MEDIA_HOST}${constants.ALBUM_URL}/${albumId}`)
    .then(getBodyOrThrow);
}

const getAllAlbums = () => {
  return requestToGateway('GET', constants.MEDIA_HOST + constants.ALBUM_URL)
    .then(getBodyOrThrow);
}

const getFavouriteSongs = (userId) => {
  return requestToGateway('GET', `${constants.MEDIA_HOST}${constants.FAVORITE_SONGS}?userId=${userId}`)
    .then(getBodyOrThrow);
}

const addFavouriteSong = (songId, userId) => {
  return requestToGateway('POST', `${constants.MEDIA_HOST}${constants.FAV_SONG}`,
    {songId, userId})
    .then(getBodyOrThrow);
}

const removeFavouriteSong = (songId, userId) => {
  return requestToGateway('POST', `${constants.MEDIA_HOST}${constants.UNFAV_SONG}`,
    {songId, userId})
    .then(getBodyOrThrow);
}

const getFavoriteAlbums = (userId) => {
  return requestToGateway('GET', `${constants.MEDIA_HOST}${constants.FAVORITE_ALBUMS}?userId=${userId}`)
      .then(getBodyOrThrow);
}

const addFavoriteAlbum = (albumId, userId) => {
  return requestToGateway('POST', `${constants.MEDIA_HOST}${constants.FAV_ALBUM}`,
      {albumId, userId})
      .then(getBodyOrThrow);
}

const removeFavoriteAlbum = (albumId, userId) => {
  return requestToGateway('POST', `${constants.MEDIA_HOST}${constants.UNFAV_ALBUM}`,
      {albumId, userId})
      .then(getBodyOrThrow);
}

const getGenreAlbums = (genre) => {
  return requestToGateway('GET', `${constants.MEDIA_HOST}${constants.ALBUM_URL}?genre=${genre}`)
    .then(getBodyOrThrow);
}

const getGenreSongs = (genre) => {
  return requestToGateway('GET', `${constants.MEDIA_HOST}${constants.SONGS_URL}?genre=${genre}`)
    .then(getBodyOrThrow);
}

const createPlaylist = (playlist) => {
  return requestToGateway('POST', `${constants.MEDIA_HOST}${constants.PLAYLIST_URL}`,
    playlist)
    .then(getBodyOrThrow);
}

const getPublicPlaylists = () => {
  return requestToGateway('GET', `${constants.MEDIA_HOST}${constants.PLAYLIST_URL}`)
    .then(getBodyOrThrow)
    .then(playlists => playlists.filter(p => p.isCollaborative));
}

const getPlaylist = (id) => {
  return requestToGateway('GET', `${constants.MEDIA_HOST}${constants.PLAYLIST_URL}/${id}`)
    .then(getBodyOrThrow);
}

const setPlaylistStatus = (data) => {
  return requestToGateway('POST', `${constants.MEDIA_HOST}${constants.PLAYLIST_STATUS_URL}`, data)
      .then(getBodyOrThrow);
}

const getPlaylistsByOwner = userId => {
  return requestToGateway('GET', `${constants.MEDIA_HOST}${constants.PLAYLIST_URL}?owner=${userId}`)
    .then(getBodyOrThrow);
}

export {
  createSong,
  createAlbum,
  getSongsByArtist,
  getAllSongs,
  getAlbum,
  getAllAlbums,
  getFavouriteSongs,
  addFavouriteSong,
  removeFavouriteSong,
  getFavoriteAlbums,
  addFavoriteAlbum,
  removeFavoriteAlbum,
  getGenreSongs,
  getGenreAlbums, createPlaylist, getPublicPlaylists, getPlaylist,
  getPlaylistsByOwner, setPlaylistStatus
};
