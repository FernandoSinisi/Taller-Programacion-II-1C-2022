require('dotenv').config();

/* Frontend paths */

/* Backend hosts */
const USERS_HOST = process.env
                          .REACT_APP_USERS_HOST;

const SERVICES_HOST = process.env
                             .REACT_APP_SERVICES_HOST;

const MEDIA_HOST = process.env
                          .REACT_APP_MEDIA_HOST;

const PAYMENTS_HOST = process.env
                             .REACT_APP_PAYMENT_HOST;

/* Paths */
const DATADOG_DASHBOARD_URL = "https://p.datadoghq.com/sb/463d20a2-daba-11eb-acf2-da7ad0900002-" +
                              "6134ee8888fd07dd3f05a1499b83adec?from_ts=1650918160437&to_ts=" +
                              "1650932560437&live=true";

/* Backends paths */
const USER_PROFILE_ADM_REQUEST = "adminRequest=";
const CONTENT_URL = "/content";
const ENABLE_CONTENT_URL = "/enablecontent";
const DISABLE_CONTENT_URL = "/disablecontent";
const DEPOSITS_URL = "/deposit";

const CHECK_URL = "/check";
const REDIRECT_URL = "/redirect";
const API_KEY_URL = "/apikeys";
const API_KEY_DOWN_URL = API_KEY_URL + "/down";
const API_KEY_UP_URL = API_KEY_URL + "/up";
const API_KEY_CREATE_SERVICE_URL = API_KEY_URL + "/createservice";
const API_KEY_QUERY_PARAM = "apiKey=";
const USER_ID_QUERY_PARAM = "userId=";
const CONTENT_ADM_REQUEST_PARAM = "adminRequest=true";
const WALLET_ID_PARAM = "walletId=";

const SONGS_URL = "/songs";
const ALBUMS_URL = "/albums";
const ALBUM_URL = "/albums";
const PLAYLISTS_URL = "/playlists";
const PLAYLIST_URL = "/playlist";

/* Frontend paths */
const SIGN_UP_URL = "/signup";
const SIGN_IN_URL = "/signin";
const SIGN_UP_END_URL = SIGN_UP_URL + "/end";
const FORGOT_PASSWORD_URL = "/forgotpassword";
const USERS_URL = "/users";
const SERVICES_URL = "/services";
const USERS_LIST_URL = USERS_URL + "/list";
const USERS_BLOCK_URL = USERS_URL + "/block";
const USERS_UNLOCK_URL = USERS_URL + "/unlock";
const USERS_CREATE_ADMIN_URL = USERS_URL + "/createadmin";
const USERS_VERIFIED_URL = USERS_URL + "/verified";
const USERS_UNVERIFIED_URL = USERS_URL + "/unverified";
const PROFILE_URL = USERS_URL + "/profile";
const METRICS_URL = "/metrics";
const TRANSACTIONS_URL = "/transactions";
const SONG_DETAIL_URL = CONTENT_URL + "/song";
const ALBUM_DETAIL_URL = CONTENT_URL + "/album";
const PLAYLIST_DETAIL_URL = CONTENT_URL + "/playlist";
const USER_WITH_WALLET_URL = "/userwithwallet";

const JSON_HEADER = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
}

/* ====== Production vs Development config ====== */
const isDevelopment = process.env
                             .REACT_APP_PRODUCTION === "false";

const firebaseConfig = {
  apiKey: "AIzaSyCnDa9J7DKKtNv5crxZ4NrRGcW5c7nZTAg",
  authDomain: "fir-firebase-2-9eb22.firebaseapp.com",
  projectId: "fir-firebase-2-9eb22",
  storageBucket: "fir-firebase-2-9eb22.appspot.com",
  messagingSenderId: "701624425016",
  appId: "1:701624425016:web:6cb2157c5a2c0a34e1a4cd"
};

const PASSWORD_MIN_LEN = 10;

const FIREBASE_ISSUES = false;

const MY_API_KEY = "645d293cdffe45a8674aa17b58157181a1a3127c3db705d9021307b678e7856b";

const ONE_HOUR_DIFFERENCE = 3600000;

module.exports = {
  USERS_HOST, SIGN_UP_URL, SIGN_IN_URL, JSON_HEADER,
  SIGN_UP_END_URL,  FORGOT_PASSWORD_URL, USERS_URL, isDevelopment,
  firebaseConfig, PASSWORD_MIN_LEN, FIREBASE_ISSUES, SERVICES_URL,
  SERVICES_HOST, MY_API_KEY, API_KEY_DOWN_URL, API_KEY_QUERY_PARAM,
  API_KEY_UP_URL,
  ONE_HOUR_DIFFERENCE,
  USERS_LIST_URL,
  USERS_BLOCK_URL,
  USERS_UNLOCK_URL,
  PROFILE_URL,
  USER_ID_QUERY_PARAM,
  DATADOG_DASHBOARD_URL,
  METRICS_URL,
  USERS_CREATE_ADMIN_URL,
  USERS_VERIFIED_URL,
  USERS_UNVERIFIED_URL,
  API_KEY_CREATE_SERVICE_URL,
  USER_PROFILE_ADM_REQUEST,
  CONTENT_URL,
  MEDIA_HOST, ENABLE_CONTENT_URL, DISABLE_CONTENT_URL, CHECK_URL,
  SONGS_URL, ALBUMS_URL, PLAYLISTS_URL, SONG_DETAIL_URL,
  ALBUM_DETAIL_URL, PLAYLIST_DETAIL_URL, CONTENT_ADM_REQUEST_PARAM, ALBUM_URL,
  PLAYLIST_URL, REDIRECT_URL, TRANSACTIONS_URL, PAYMENTS_HOST,
  DEPOSITS_URL, USER_WITH_WALLET_URL, WALLET_ID_PARAM
}
