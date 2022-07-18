import {
    View,
    Text

} from 'react-native';
  
import React, {useState, useEffect} from 'react'
import { Button } from 'react-native-paper'
import { getToGateway, postToGateway } from '../others/utils';
import constants from '../others/constants'

  
export default FollowArtistButton = (props) =>{
    
    const [followed, setFollowed] = useState(false);

    useEffect(()=>{
      function getButtonState(){
        
        const url = constants.USERS_HOST + constants.APP_FAV_ARTIST_URL 
              + "?" + constants.LISTENER_ID_QUERY_PARAM + props.idListener
              + "&" + constants.ARTIST_ID_QUERY_PARAM + props.idArtist;


        const res = getToGateway(url)
            .then(res=>{
              if( res.error === undefined ){
                setFollowed(res.status);
              }
            })
      }

      getButtonState()
    },[])


    let handlePress =()=>{

      if ( ! followed ){

        const requestBody = {
          idListener: props.idListener,
          idArtist: props.idArtist,
          redirectTo: constants.USERS_HOST + constants.APP_FAV_ARTIST_URL 
        }

        postToGateway(requestBody)
          .then(res =>{
              if (res.error === undefined)
                setFollowed(true)
                props.follow();
              }
            )
      }
      else{
        const requestBody = {
          redirectTo: constants.USERS_HOST + constants.APP_FAV_ARTIST_URL 
            + "?" + constants.LISTENER_ID_QUERY_PARAM + props.idListener
            + "&" + constants.ARTIST_ID_QUERY_PARAM + props.idArtist
        }

        postToGateway(requestBody, 'DELETE')
          .then(res => {
            if (res.error === undefined)
              setFollowed(false);
              props.unFollow();
            }
          )
        
      }


    }


    return(
      <>
        {
          props.openAsListener &&
            (<View style={{marginTop: 30, alignSelf: 'center'}}>
            <Button
              mode="contained"
              color={followed? "#18A8D8":"#AFEEEE"}
              style={{marginBottom: 10, width: 163}}
              onPress={handlePress}
              >
              
              <Text>{followed?  "Dejar de Seguir": "Seguir"}</Text>
            </Button>
          </View>)
        }
      </>
      )
    
    }

  
