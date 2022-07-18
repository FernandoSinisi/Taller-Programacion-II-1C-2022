import {initializeApp} from 'firebase/app'
import {getAuth, signOut, updateProfile} from 'firebase/auth'
import {addDoc, collection, initializeFirestore, onSnapshot, orderBy} from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyCnDa9J7DKKtNv5crxZ4NrRGcW5c7nZTAg",
  authDomain: "fir-firebase-2-9eb22.firebaseapp.com",
  projectId: "fir-firebase-2-9eb22",
  storageBucket: "fir-firebase-2-9eb22.appspot.com",
  messagingSenderId: "701624425016",
  appId: "1:701624425016:web:6cb2157c5a2c0a34e1a4cd"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = initializeFirestore(app, {useFetchStreams: false, experimentalForceLongPolling: true});


const getCurrentUser = () => {
  return auth.currentUser;
}

const addDocIntoCollection = async (collectionName, newDoc) => {
  try {
    await addDoc(collection(db, collectionName), newDoc).then(r => console.log(JSON.stringify(r)));
  } catch (err) {
    alert(err);
  }
}

const getSnapshot = async (collectionName) => {

  const snapshot = onSnapshot(collection(db, collectionName),
    (querySnapshot) => {
      return querySnapshot
    });
  return snapshot;
}

const updateProfilePhoto = (photoUrl) => {
  updateProfile(auth.currentUser, {photoUrl});
}

export {
  auth,
  signOut,
  getCurrentUser,
  firebaseConfig,
  db,
  addDocIntoCollection,
  getSnapshot,
  orderBy,
  updateProfilePhoto
};
