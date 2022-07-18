import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

const pickFile = async (mimeType) => {
  let file;
  if (mimeType === 'image/*') {
    file = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (file.cancelled) return {cancelled: true};
  } else {
    file = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true, type: mimeType || '*/*', multiple: false,
    });
    if (file.type === 'cancel') return {cancelled: true};
  }
  const fileContent = fetch(file.uri).then(response => response.blob());
  return {contentPromise: fileContent, name: file.name, size: file.size, uri: file.uri, cancelled: false};
}

export {pickFile};
