const Logger = require("./Logger");
const utils = require("../others/utils");
const {changePlayList} = require("./PlaylistService");
const {changeAlbumStatus} = require("./AlbumService");
const {changeSongStatus} = require("./SongService");
const {findSongs} = require("./SongService");
const {findAlbums} = require("./AlbumService");
const {findPlaylists} = require("./PlaylistService");
const constants = require('../others/constants');

const getContent = async (req,
                          res) => {
   let songs;

   let albums;

   let playlists;

   let content = [];

   try {
       const response =  await findSongs(constants.MAX_LIMIT,
                                         {} );

        songs = response.map(song => {
            return {
                id: "song_" + song.id,
                name: song.title,
                description: song.description,
                genre: song.genre,
                subscription: song.subscription,
                creationDate: utils.getDateFromCreatedAtAttribute(song.createdAt),
                type: "canción",
                blocked: song.isBlocked
            } } );

        albums = ( await findAlbums(constants.MAX_LIMIT,
                                    {} ) ).map(album => {
            return {
                id: "album_" + album.id,
                name: album.title,
                description: album.description,
                genre: album.genre,
                subscription: album.subscription,
                creationDate: utils.getDateFromCreatedAtAttribute(album.createdAt),
                type: "album",
                blocked: album.isBlocked
            } } );

        playlists = ( await findPlaylists({}) ).map(playlist => {
            return {
                id: "playlist_" + playlist.id,
                name: playlist.title,
                description: playlist.title,
                creationDate: utils.getDateFromCreatedAtAttribute(playlist.createdAt),
                type: "playlist",
                blocked: playlist.isBlocked
            } } );
    } catch(e) {
       Logger.request("Error al obtener contenido.");

       return utils.setErrorResponse(`Error al obtener contenido`,
                                     500,
                                     res);
   }

    content = content.concat(songs)
                     .concat(albums)
                     .concat(playlists);

    return utils.setBodyResponse(content,
                                 200,
                                 res);
}

const handleContentChange = async (req,
                                   res,
                                   condition) => {
    const type = req.body
                    .contentType;

    const contentId = req.body
                         .contentId;

    const disableFns = {
        "song": changeSongStatus,
        "album": changeAlbumStatus,
        "playlist": changePlayList
    };

    try {
        disableFns[type](contentId,
                        condition);
    } catch(e) {
        Logger.request("Error al deshabilitar contenido.");

        return utils.setErrorResponse(`Error al deshabilitar contenido`,
            500,
            res);
    }

    const response = {
        ok: "ok"
    };

    return utils.setBodyResponse(response,
                                200,
                                res);
}

const disableContent = async (req,
                              res) => {
    return handleContentChange(req,
                               res,
                               true);
}

const enableContent = async (req,
                             res) => {
    return handleContentChange(req,
                               res,
                               false);
}

module.exports = {
    getContent,
    disableContent,
    enableContent
};
