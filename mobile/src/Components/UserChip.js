import {StyleSheet, View, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react'
import {Avatar, Text} from 'react-native-paper';
import ProfilePicture from './ProfilePicture'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const UserChip = props => {

  useEffect(() => {
  }, []);

  return (
    <TouchableOpacity style={styles.chip} onPress={() => {
      props.navigation.navigate('ProfileScreen', {uid: props.user.id, usingList: true})
    }}>
      <View style={{flexDirection: 'row'}}>
          <ProfilePicture
                    uid={props.user.id}
                    username={props.user.username}
                    pictureSize={56}
                    photoUrl={props.user.photoUrl}
                    disabled={true}
                    defaultImage={{margin: 13}}
                    profilePicture={{margin: 13}}
                  />

          <View style={{flexDirection: 'column', marginTop: 15}}>
            <Text style={styles.name}>{props.user.username}</Text>
            <View style={{flexDirection: 'row'}}>
              <MaterialCommunityIcons
                name={props.user.isBand? 'account-group': (props.user.isArtist? 'account-music': 'headphones')}
                size={30}
                color='#388AD6'/>
              {
                props.user.isVerified && props.user.isArtist &&
                  (
                    <>
                      <Avatar.Icon icon="check-decagram" size={30} color={'green'} style={styles.icon}/>
                    </>)
                
              }
            </View>
          </View>
          
          
        </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create(
  {
    chip: {
      backgroundColor: '#9acef8',
      marginTop: 5,
      height: 80,
      borderRadius: 10,
    },
    name: {
      fontSize: 19,
      color: 'darkblue',
      paddingLeft: 5
    },
    email: {
      color: 'black',
      paddingLeft: 5
    },
    icon: {
      backgroundColor: 'transparent'
    },
    picture: {
      marginStart: 150,
    }
  }
)
export default UserChip;
