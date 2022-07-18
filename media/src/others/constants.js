require('dotenv').config({
  path: `.env${process.env.MY_ENV}`
});

const MAX_STR_LEN = 254;
const FIREBASE_MAX_LEN = 36;
const MAX_STR_FIREBASE_LINK = 1000;

const DATE_FORMAT = "YYYY-M-D H:mm:ss.SS";
const TIMEZONE = "America/Buenos_Aires";

const LOG_LEVEL = process.env.LOG_LEVEL;

const RESET_DATABASE = false;

const JSON_HEADER = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
}

/* Frontend hosts */
const BACKOFFICE_HOST = process.env
                               .BACKOFFICE_HOST;

const AUTH_FRONT = process.env
                          .AUTH_FRONT;

const USERS_HOST = process.env
                          .USERS_HOST;

const SERVICES_HOST = process.env
                             .SERVICES_HOST;

/* Backends paths */
const SONG_URL = "/songs";
const ALBUM_URL = "/albums";
const PLAYLIST_URL = "/playlists";

const CHECK_URL = "/check";
const PARSE_USERS_URL= "/parse";
const FAVORITE_SONGS = "/favoritesongs";
const FAV_SONG = "/favsong";
const UNFAV_SONG = "/unfavsong";
const CHECK_FAV_SONG = "/checkfav";
const FAV_ALBUM = "/favalbum";
const UNFAV_ALBUM = "/unfavalbum";
const CHECK_FAV_ALBUM = "/checkfavalbum";
const FAVORITE_ALBUMS = "/favoritealbums";

const PLAYLIST_STATUS_URL = "/playliststatus";

const CONTENT_URL = "/content";
const ENABLE_CONTENT_URL = "/enablecontent";
const DISABLE_CONTENT_URL = "/disablecontent";

const MSG_NO_AUTORIZADO = "No autorizado"

/* ====== Production vs Development config ====== */
const isDevelopment = process.env.PRODUCTION === undefined;
let databaseUrl;

const DB_DIALECT = "postgres";
let DB_USER;
let DB_PASSWORD;
let DB_HOST;
let DB_PORT;
let POSTGRES_DB;

if (isDevelopment) {
  if (process.env.DATABASE_URL === undefined) {
    DB_USER = process.env.POSTGRES_USER;
    DB_PASSWORD = process.env.POSTGRES_PASSWORD;
    DB_HOST = process.env.DB_HOST;
    DB_PORT = process.env.DB_PORT;
    POSTGRES_DB = process.env.POSTGRES_DB;

    databaseUrl = `${process.env.DB || 'postgres'}`
      .concat(`://${DB_USER}`)
      .concat(`:${DB_PASSWORD}`)
      .concat(`@${DB_HOST}`)
      .concat(`:${DB_PORT}`)
      .concat(`/${POSTGRES_DB}`);
  } else {
    databaseUrl = process.env.DATABASE_URL;
  }
} else {
  // Heroku
  // DATABASE_URL=${DB}://${POSTGRES_USER}:${POSTGRES_PASSWORD}
  //              @${DB_CONTAINER_NAME}:${DB_PORT}/${POSTGRES_DB}
  databaseUrl = process.env.DATABASE_URL;

  // ONLY use it on migrations (they may change)
  DB_USER = databaseUrl.split("@")[0]
    .split("://")[0]
    .split(":")[0];

  DB_PASSWORD = databaseUrl.split("@")[0]
    .split("://")[0]
    .split(":")[1];

  DB_HOST = databaseUrl.split("@")[1]
    .split(":")[0];

  DB_PORT = databaseUrl.split("@")[1]
    .split(":")[1]
    .split("/")[0];

  POSTGRES_DB = databaseUrl.split("@")[1]
    .split(":")[1]
    .split("/")[1];
}

const MY_API_KEY = "938187f0c06221997960c36a7a85a30b2da2cb6e9a91962287a278c4ac1c7f8a";

const MAX_LIMIT = 1000000;

module.exports = {
  DB_USER, DB_PASSWORD, DB_HOST, DB_PORT,
  POSTGRES_DB, DB_DIALECT, USERS_HOST, NODE_PORT: process.env.PORT,
  DATABASE_URL: databaseUrl, BACKOFFICE_HOST, MAX_STR_LEN, FIREBASE_MAX_LEN,
  DATE_FORMAT, TIMEZONE, MAX_STR_FIREBASE_LINK, RESET_DATABASE, MY_API_KEY,
  isDevelopment,
  LOG_LEVEL,
  AUTH_FRONT,
  SONG_URL,
  ALBUM_URL,
  PLAYLIST_URL,
  PARSE_USERS_URL,
  SERVICES_HOST,
  JSON_HEADER,
  FAVORITE_SONGS,
  FAV_SONG,
  UNFAV_SONG,
  CHECK_FAV_SONG,
  CONTENT_URL,
  ENABLE_CONTENT_URL,
  DISABLE_CONTENT_URL,
  FAV_ALBUM,
  UNFAV_ALBUM, CHECK_FAV_ALBUM, FAVORITE_ALBUMS, MAX_LIMIT,
  CHECK_URL, MSG_NO_AUTORIZADO, PLAYLIST_STATUS_URL
}
