import {app} from '../Firebase/firebase';
import {getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage';

const storage = getStorage(app);

const uploadFile = (file, name) => {
  const fileRef = ref(storage, name);
  return uploadBytes(fileRef, file)
    .then(async () => {
      const url = await getDownloadURL(fileRef);
      console.log(`Uploaded to firebase: ${url}`);
      return url;
    });
}

export {uploadFile};
