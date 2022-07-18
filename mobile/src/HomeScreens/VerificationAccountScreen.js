import React, {useState, useEffect} from "react";
import {ScrollView, StyleSheet, View} from "react-native";
import {Button, Text} from "react-native-paper";
import FilePicker from "../Components/FilePicker";
import {buttonStyle, buttonTextStyle, containerStyle} from "../styles/genericStyles";
import {uploadFile} from "../Services/CloudStorageService";
import {useAuthUser} from "../context/AuthContext";
import {uploadVerificationVideo} from '../Services/UsersService'

const VerificationAccountScreen = ({navigation}) => {

  const [file, setFile] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const {userState, setUserType} = useAuthUser();

  useEffect(()=>{
    navigation.setOptions({ headerShown: true, headerTitle: 'Verificar Cuenta' });
  }, []);

  const validateFile = () => {
    if (file === null || file === undefined) {
      alert('Debe seleccionar un archivo');
      return false;
    }
    return true;
  }

  const handleDocumentPick = (doc) => {
    setFile(doc);
  }

  const handleUpload = async () => {
    if (!validateFile()) {
      return;
    }
    setIsLoading(true);
    try {
      const name = file.name;
      const fileUrl = await file.contentPromise.then(res =>{
        return uploadFile(res, name)
      });
      await uploadVerificationVideo({
        userId: userState.uid,
        verificationVideoUrl: fileUrl,
      });
      alert('Video de verificacion subido!');
    } catch (err) {
      console.log(JSON.stringify(err));
      alert('Ha ocurrido un error inesperado al subir el video de verificacion, por favor intente más tarde');
    }
    setIsLoading(false);
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <FilePicker title={`${file ? 'Cambiar' : 'Elegir'} video de verificación`} mimeType={'video/*'} icon={'file-video'}
                    setFileCallback={handleDocumentPick}/>
        <Button mode='contained'
                style={styles.button}
                onPress={handleUpload}
                loading={isLoading}
                disabled={isLoading}>
          <Text style={styles.buttonText}>{isLoading ? 'Subiendo...' : 'Subir'}</Text>
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
  },
  buttonText: buttonTextStyle
});

export default VerificationAccountScreen;
