import React, {useEffect, useState} from "react";
import * as constants from "../others/constants";
import {getToGateway} from "../others/utils";
import {Box, Container, createTheme, CssBaseline} from "@mui/material";
import {ThemeProvider} from "@emotion/react";
import {TextRow} from "./components/TextRow";
import defaultImage from '../media/default_content_image.png'
import {boxStyle} from "../style/profileStyles";

const getAlbumDetail = async (rawId) => {
  const albumId = rawId.split("album_")[1];

  const response = await getToGateway( constants.MEDIA_HOST + constants.ALBUM_URL
                                       + "/"
                                       + albumId );

  if (response.error !== undefined) {
    alert(response.error);
  }

  return response;
}

const AlbumDetail = (props) => {
  const contentId = window.location
                          .href
                          .split("/")[5];

  const [content, setContent] = useState({});

  const [theme] = useState(createTheme());

  useEffect( () => {
    ( async () => {
      const response = await getAlbumDetail(contentId)
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
                    src = {content.link ? content.link : defaultImage}
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

              <TextRow text={"Canciones:"}/>

          <div>
              {
                (content.songs !== undefined) && (
                  content.songs
                      .map( (song, idx) =>
                          <a  key={idx}
                              href={constants.SONG_DETAIL_URL + "/"
                          + "song_" + song.id}>
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
  AlbumDetail
}
