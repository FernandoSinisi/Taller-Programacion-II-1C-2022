import {SafeAreaView, StyleSheet, ScrollView, View} from 'react-native';
import React, {useEffect, useState} from 'react'
import constants from '../others/constants'
import {getToGateway} from "../others/utils";
import UserChip from '../Components/UserChip';
import {containerStyle} from "../styles/genericStyles";
import {Searchbar} from "react-native-paper";
import LoaderScreen from '../Components/LoaderScreen';

const ArtistListScreen = ({navigation}) => {
  const [artistList, setList] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    function getAllArtist() {

      getToGateway(constants.USERS_HOST + constants.APP_ARTIST_LIST_URL,
        "").then(res => {
        if (res.error !== undefined) {
          alert(res.error);
        } else {
          setList(res.list);
          setLoading(false);
        }
      });
    }

    return navigation.addListener('focus',
      () => {
        getAllArtist();
      });

  }, [navigation]);


  const filterArtists = text => {
    text = text.toLowerCase();
    return a => a.username.toLowerCase().includes(text);
  }

  if (loading) {
    return <LoaderScreen/>;
  }
  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        <Searchbar onChangeText={setText}
                   placeholder={"Buscar artistas"}
                   inputStyle={{}}
                   containerStyle={{}}
                   inputContainerStyle={{}}
        />
        <View style={{marginBottom: 10, marginTop: 10}}>
          {
            artistList.filter(filterArtists(text)).map((artist, id) => {
                return <UserChip id={id} key={id} user={artist} navigation={navigation}/>
              }
            )
          }
        </View>
      </SafeAreaView>
    </ScrollView>
  )
}

const styles = StyleSheet.create(
  {
    container: {
      ...containerStyle,
      backgroundColor: '#f5fcff',
      paddingTop: 5
    }
  }
)

export default ArtistListScreen;
