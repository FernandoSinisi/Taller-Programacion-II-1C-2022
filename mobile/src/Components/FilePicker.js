import React from 'react'
import {Button} from "react-native-paper";
import {pickFile} from "../Services/FilePickerService";

const FilePicker = (props) => {
  const handleFilePicker = async () => {
    const file = await pickFile(props.mimeType);
    console.log(`File selected: ${JSON.stringify(file)}`);
    if (!file.cancelled) {
      props.setFileCallback(file);
    }
  }
  return (<Button
    icon={props.icon}
    onPress={() => handleFilePicker()}
    style={{
      alignSelf: 'center', width: '80%', paddingTop: 5, paddingBottom: 5, marginBottom: 5, backgroundColor: 'skyblue'
    }}
  >
    {props.title}
  </Button>)
}

export default FilePicker;
