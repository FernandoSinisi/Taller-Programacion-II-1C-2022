import React, {useEffect, useState} from "react";
import * as constants from "../others/constants";
import {getToGateway} from "../others/utils";
import {Box, Container, createTheme, CssBaseline} from "@mui/material";
import {ThemeProvider} from "@emotion/react";
import {TextRow} from "./components/TextRow";
import defaultImage from '../media/default_content_image.png'
import {boxStyle} from "../style/profileStyles";

const getSongDetail = async (rawId) => {
  const songId = rawId.split("song_")[1];

  const response = await getToGateway( constants.MEDIA_HOST + constants.SONGS_URL
                                       + "/"
                                       + songId
                                       + "?"
                                       + constants.CONTENT_ADM_REQUEST_PARAM );

  if (response.error !== undefined) {
    alert(response.error);
  }

  return response;
}

const SongDetail = (props) => {
  const contentId = window.location
                          .href
                          .split("/")[5];

  const [content, setContent] = useState({});

  const [theme] = useState(createTheme());

  useEffect(() => {
    ( async () => {
      const response = await getSongDetail(contentId)
      setContent(response);
     } )();

    return () => {
    };
  }, [contentId]);

  return (
    <div style={{backgroundColor: '#E1F5FE', height: '91vh'}}>
      <ThemeProvider theme={theme}>
        <div style={{flex: 1, flexDirection: 'row', justifyContent: 'center', display: 'flex', flexWrap: 'wrap'}}>
          <div style={{flex: 1, alignItems: 'center'}}>
            <Container component="main" maxWidth="sx" style={{width: 700,}}>
              <CssBaseline/>
              <Box sx={boxStyle}>
                <div style = {{
                  padding: 30
                } } >

                  <img
                    src = {content.artwork ? content.artwork : defaultImage}
                    style = { {
                            height: 250,
                            width: 250,
                            borderRadius: '50%'}
                            }
                    alt = "Sin Imagen">
                  </img>
                </div>

                <div>
                  <TextRow text={"Nombre: " + content.title}/>

                  <TextRow text={"Descripción: " + content.description}/>

                  <TextRow text={"Género: " + content.genre}/>

                  <TextRow text={"Suscripción: " + content.subscription}/>
                </div>
              </Box>

              <TextRow text={"Artistas:"}/>

          <div>
              {
                (content.artists !== undefined) && (
                  content.artists
                      .map( (artist, idx) =>
                          <a  key={idx}
                              href={constants.PROFILE_URL + "/"
                          + artist.id}>
                            <TextRow text={artist.username}/>
                           </a> )
                )
              }
            </div>

            </Container>
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}

export {
  SongDetail
}
