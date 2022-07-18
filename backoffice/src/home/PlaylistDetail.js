import React, {useEffect, useState} from "react";
import * as constants from "../others/constants";
import {getToGateway} from "../others/utils";
import {Box, Container, createTheme, CssBaseline} from "@mui/material";
import {ThemeProvider} from "@emotion/react";
import {TextRow} from "./components/TextRow";
import defaultImage from '../media/default_content_image.png'
import {boxStyle} from "../style/profileStyles";

const getPlayListDetail = async (rawId) => {
  const playlistId = rawId.split("playlist_")[1];

  const response = await getToGateway( constants.MEDIA_HOST + constants.PLAYLISTS_URL
                                       + "/"
                                       + playlistId
                                       + "?"
                                       + constants.CONTENT_ADM_REQUEST_PARAM );

  if (response.error !== undefined) {
    alert(response.error);
  }

  return response;
}

const PlayListDetail = (props) => {
  const contentId = window.location
                          .href
                          .split("/")[5];

  const [content, setContent] = useState({});

  const [theme] = useState(createTheme());

  useEffect(() => {
    ( async () => {
      const response = await getPlayListDetail(contentId)
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
                </div>
              </Box>

              <TextRow text={"Canciones:"}/>

          <div>
              {
                (content.songs !== undefined) && (
                  content.songs
                         .map( (song,
                                idx) =>
                              <a key={idx}
                                 href={constants.SONG_DETAIL_URL + "/"
                                                                 + song.id}>
                                <TextRow text={song.title}/>
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
  PlayListDetail
}
