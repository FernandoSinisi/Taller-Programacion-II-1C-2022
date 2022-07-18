import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Avatar} from 'react-native-paper'
import {updateProfilePhoto} from '../Firebase/firebase';
import {useAuthUser} from '../context/AuthContext';
import constants from "../others/constants";
import {postToGateway} from "../others/utils";
import {uploadFile} from "../Services/CloudStorageService"
import {pickFile} from "../Services/FilePickerService";


const ProfilePicture = (props) => {

  const {userState} = useAuthUser();

  const pickImage = async () => {

    const result = await pickFile('image/*');
    if (!result.cancelled) {
      const name = `${props.uid}.png`;
      const photoURL = await uploadFile(await result.contentPromise, name);
      updateProfilePhoto(photoURL);
      const requestBody = {
        redirectTo: constants.USERS_HOST
          + constants.PROFILE_PHOTO_URL
          + "?" + constants.USER_ID_QUERY_PARAM + props.uid,
          photoURL: photoURL,
      };
      postToGateway(requestBody, 'PATCH')
        .then(_ => console.log("Updated photo url"));
    }
  }

  return (
    <TouchableOpacity
      onPress={pickImage}
      mode='outlined'
      style={(props.photoUrl)? props.profilePicture: props.defaultImage}
      disabled={((props.uid !== userState.uid) || (props.disabled))}
    >
      {(props.photoUrl === null) ?
        (<Avatar.Text
          style={styles.avatar}
          size={props.pictureSize}
          label={`${props.username.charAt(0)}`}
        />)
        : (<Avatar.Image
          style={styles.avatar}
          size={props.pictureSize}
          source={{uri: props.photoUrl}}/>)}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create(
  {
    avatar: {
      alignSelf: 'center',
    }
  }
);

export default ProfilePicture;
