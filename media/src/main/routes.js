const express = require('express')
const router = express.Router()
const constants = require('../others/constants');
const SongService = require('../services/SongService');
const AlbumService = require('../services/AlbumService');
const ContentManagementService = require('../services/ContentManagementService');
const PlaylistService = require('../services/PlaylistService');
const Logger = require("../services/Logger");

/**
 * @swagger
 * tags:
 *    name: Health check
 * /health-check:
 *    get:
 *      tags: [Health check]
 *      summary: Health check.
 *      description: "Check the status of application."
 *      responses:
 *          "200":
 *              description: "Application up and running."
 *          "404":
 *               description: "Not found."
 *          "500":
 *              description: "Internal Server Error: Cannot response the request."
 */
router.get('/health-check', async (req, res) => {
  Logger.request("Health-check.");
  res.send('OK');
});

/**
 * @swagger
 * tags:
 *    name: Song
 * /songs:
 *    post:
 *      tags: [Song]
 *      summary: Create Song.
 *      description: "Create a new song."
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      requestBody:
 *          content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  required:
 *                    - title
 *                    - link
 *                    - artists
 *                  properties:
 *                    title:
 *                        type: string
 *                        description: "Title of song."
 *                        example : "paint it black"
 *                    description:
 *                        type: string
 *                        description: "Description of song."
 *                        example : "1966, Official Song"
 *                    author:
 *                        type: string
 *                        description: "Author of song."
 *                        example: "The Rolling Stones"
 *                    subscription:
 *                        type: string
 *                        description: "Minimum subscription to access the song."
 *                        example: "FREE"
 *                    genre:
 *                        type: string
 *                        description: "Genre of song."
 *                        example: "rock"
 *                    link:
 *                        type: string
 *                        description: "Link to song."
 *                        example: "https://firebasestorage.googleapis.com/xxxxxxxxxxx"
 *                    artists:
 *                        type: array
 *                        items:
 *                            type: string
 *                        description: "Artists of song."
 *                        example: ["artist1","artist2"]
 *      responses:
 *          "200":
 *              description: "returns created song."
 *          "400":
 *               description: "Could not create a song with this parameters."
 *          "404":
 *               description: "Not found."
 *          "500":
 *              description: "Internal Server Error: Cannot response the request."
 */
router.post(constants.SONG_URL, async (req, res) => {
  Logger.request("Crear nueva cancion.");
  await SongService.newSong(req, res);
});



/**
 * @swagger
 * /songs/{id}:
 *    get:
 *      tags: [Song]
 *      summary: Get Song.
 *      description: "Get song with id."
 *      parameters:
 *         - name: "id"
 *           in: path
 *           required: true
 *           description: "Id of song"
 *           schema:
 *              type: string
 *           example: 1
 *      responses:
 *          "200":
 *              description: "returns song with the id."
 *          "400":
 *               description: "Could not get song with this id"
 *          "404":
 *               description: "Not found."
 *          "500":
 *              description: "Internal Server Error: Cannot response the request"
 */
router.get(constants.SONG_URL + "/:id", async (req, res) => {
  Logger.request("Obtener cancion.");
  await SongService.getSong(req, res);
});

/**
 * @swagger
 * /songs:
 *    get:
 *      tags: [Song]
 *      summary: Get Songs.
 *      description: "Get a list of songs."
 *      parameters:
 *         - name: "title"
 *           in: query
 *           required: false
 *           description: "Name of the songs"
 *           schema:
 *              type: string
 *           example: "paint it black"
 *         - name: "artist"
 *           in: query
 *           required: false
 *           description: "Songs artist."
 *           schema:
 *              type: string
 *           example: artist1
 *         - name: "subscription"
 *           in: query
 *           required: false
 *           description: "Minimum subscription to access the songs."
 *           schema:
 *              type: string
 *           example: FREE
 *         - name: "genre"
 *           in: query
 *           required: false
 *           description: "Genre of the songs"
 *           schema:
 *              type: string
 *           example: rock
 *      responses:
 *          "200":
 *              description: "returns all songs that match the parameters."
 *          "400":
 *               description: "Could not get songs with this parameters"
 *          "404":
 *               description: "Not found."
 *          "500":
 *              description: "Internal Server Error: Cannot response the request"
 */
router.get(constants.SONG_URL, async (req, res) => {
  Logger.request("Obtener canciones.");
  await SongService.getSongs(req, res);
});

/**
 * @swagger
 * /favsong:
 *    post:
 *      tags: [Song]
 *      summary: Add song to favorites.
 *      description: "Add song to favorites."
 *      parameters:
 *         - name: "userId"
 *           in: body
 *           description: "User id"
 *           schema:
 *              type: string
 *         - name: "songId"
 *           in: body
 *           description: "Song id."
 *           schema:
 *              type: string
 *      responses:
 *          "200":
 *              description: "Song added to favorites."
 *          "400":
 *               description: "Could not get songs with this parameters"
 *          "404":
 *               description: "Not found."
 *          "500":
 *              description: "Internal Server Error: Cannot response the request"
 */
router.post(constants.FAV_SONG, async (req, res) => {
  Logger.request("Agregar canción a favoritos.");
  await SongService.favSong(req, res);
});

/**
 * @swagger
 * /unfavsong:
 *    post:
 *      tags: [Song]
 *      summary: Remove song from favorites.
 *      description: "Remove song to favorites."
 *      parameters:
 *         - name: "userId"
 *           in: body
 *           description: "User id"
 *           schema:
 *              type: string
 *         - name: "songId"
 *           in: body
 *           description: "Song id."
 *           schema:
 *              type: string
 *      responses:
 *          "200":
 *              description: "Song removed from favorites."
 *          "500":
 *              description: "Internal Server Error: Cannot response the request"
 */
router.post(constants.UNFAV_SONG, async (req, res) => {
  Logger.request("Quitar una canción a favoritos.");
  await SongService.unfavSong(req, res);
});

/**
 * @swagger
 * /checkfav:
 *    get:
 *      tags: [Song]
 *      summary: Check if song is in favorites.
 *      description: "Remove song to favorites."
 *      parameters:
 *         - name: "userId"
 *           in: query
 *           description: "User id"
 *           schema:
 *              type: string
 *         - name: "songId"
 *           in: query
 *           description: "Song id."
 *           schema:
 *              type: string
 *      responses:
 *          "200":
 *              description: "Song removed from favorites."
 *          "500":
 *              description: "Internal Server Error: Cannot response the request"
 */
router.get(constants.CHECK_FAV_SONG, async (req, res) => {
  Logger.request("Chequear si está en favoritos.");
  await SongService.checkFavSong(req, res);
});

/**
 * @swagger
 * /songs/favorites/:userId:
 *    get:
 *      tags: [Song]
 *      summary: Get favorite songs of the user.
 *      description: Get favorite songs of the user.
 *      parameters:
 *         - name: "userId"
 *           in: query
 *           description: "User id"
 *           schema:
 *              type: string
 *      responses:
 *          "200":
 *              description: "returns all songs that match the parameters."
 *          "400":
 *               description: "Could not get songs with this parameters"
 *          "404":
 *               description: "Not found."
 *          "500":
 *              description: "Internal Server Error: Cannot response the request"
 */
router.get(constants.FAVORITE_SONGS, async (req, res) => {
  Logger.request("Ver favoritos.");

  await SongService.getFavoriteSongs(req, res);
});



/**
 * @swagger
 * /favalbum:
 *    post:
 *      tags: [Album]
 *      summary: Add album to favorites.
 *      description: "Add album to favorites."
 *      parameters:
 *         - name: "userId"
 *           in: body
 *           description: "User id"
 *           schema:
 *              type: string
 *         - name: "songId"
 *           in: body
 *           description: "Song id."
 *           schema:
 *              type: string
 *      responses:
 *          "200":
 *              description: "Album added to favorites."
 *          "500":
 *              description: "Internal Server Error: Cannot response the request"
 */
router.post(constants.FAV_ALBUM, async (req, res) => {
  Logger.request("Agregar album a favoritos.");
  await AlbumService.favAlbum(req, res);
});

/**
 * @swagger
 * /unfavalbum:
 *    post:
 *      tags: [Album]
 *      summary: Remove album from favorites.
 *      description: "Remove album from favorites."
 *      parameters:
 *         - name: "userId"
 *           in: body
 *           description: "User id"
 *           schema:
 *              type: string
 *         - name: "songId"
 *           in: body
 *           description: "Song id."
 *           schema:
 *              type: string
 *      responses:
 *          "200":
 *              description: "Song removed from favorites."
 *          "500":
 *              description: "Internal Server Error: Cannot response the request"
 */
router.post(constants.UNFAV_ALBUM, async (req, res) => {
  Logger.request("Quitar un album de favoritos.");
  await AlbumService.unfavAlbum(req, res);
});

/**
 * @swagger
 * /checkfavalbum:
 *    get:
 *      tags: [Album]
 *      summary: Check if album is in favorites.
 *      description: Check if album is in favorites.
 *      parameters:
 *         - name: "userId"
 *           in: query
 *           description: "User id"
 *           schema:
 *              type: string
 *         - name: "songId"
 *           in: query
 *           description: "Song id."
 *           schema:
 *              type: string
 *      responses:
 *          "200":
 *              description: "Returns if the album is or not in favorites for the user."
 *          "500":
 *              description: "Internal Server Error: Cannot response the request"
 */
router.get(constants.CHECK_FAV_ALBUM, async (req, res) => {
  Logger.request("Chequear si está en favoritos.");
  await AlbumService.checkFavAlbum(req, res);
});

/**
 * @swagger
 * /favoritealbums:
 *    get:
 *      tags: [Album]
 *      summary: Get favorite albums.
 *      description: "Get favorite albums of the user with the given id."
 *      parameters:
 *         - name: "id"
 *           in: path
 *           required: true
 *           description: "Id of the user"
 *           schema:
 *              type: string
 *           example: 1
 *      responses:
 *          "200":
 *              description: "returns albums."
 *          "500":
 *              description: "Internal Server Error: Cannot response the request"
 */
router.get(constants.FAVORITE_ALBUMS , async (req, res) => {
  Logger.info("Request a " + constants.FAVORITE_ALBUMS);
  await AlbumService.getFavoriteAlbums(req, res);
});

/**
 * @swagger
 * tags:
 *    name: Album
 * /albums:
 *    post:
 *      tags: [Album]
 *      summary: Create Album.
 *      description: "Create a new album."
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      requestBody:
 *          content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  required:
 *                    - title
 *                    - artists
 *                    - subscription
 *                    - genre
 *                    - songs
 *                  properties:
 *                     title:
 *                        required: true
 *                        description: "Name of album."
 *                        type: string
 *                        example:  "Aftermath"
 *                     artists:
 *                        required: true
 *                        description: "Artists of album."
 *                        type: array
 *                        items:
 *                            type: string
 *                        example: ["artist1"]
 *                     subscription:
 *                          required: true
 *                          description: "Minimum subscription to access the album."
 *                          type: string
 *                          example: FREE
 *                     genre:
 *                          required: true
 *                          description: "Genre of album."
 *                          type: string
 *                          example: rock
 *                     link:
 *                          required: false
 *                          description: "Link to album cover."
 *                          type: string
 *                          example: "https://firebasestorage.googleapis.com/yyyyyyyyyy"
 *                     songs:
 *                          required: true
 *                          description: "Songs of album."
 *                          type: array
 *                          items:
 *                              type: integer
 *                          example: [1,7]
 *      responses:
 *          "200":
 *              description: "returns created album."
 *          "400":
 *               description: "Could not create an album with this parameters."
 *          "404":
 *               description: "Not found."
 *          "500":
 *              description: "Internal Server Error: Cannot response the request."
 */
router.post(constants.ALBUM_URL, async (req, res) => {
  Logger.request("Crear nuevo album.");
  await AlbumService.newAlbum(req, res);
});

/**
 * @swagger
 * /albums/{id}:
 *    get:
 *      tags: [Album]
 *      summary: Get Album.
 *      description: "Get album with id."
 *      parameters:
 *         - name: "id"
 *           in: path
 *           required: true
 *           description: "id of album"
 *           schema:
 *              type: string
 *           example: 1
 *      responses:
 *          "200":
 *              description: "returns album with the id."
 *          "400":
 *               description: "Could not get album with this id"
 *          "404":
 *               description: "Not found."
 *          "500":
 *              description: "Internal Server Error: Cannot response the request"
 */
router.get(constants.ALBUM_URL + "/:id", async (req, res) => {
  Logger.request("Obtener album.");
  await AlbumService.getAlbum(req, res);
});

/**
 * @swagger
 * /albums:
 *    get:
 *      tags: [Album]
 *      summary: Get Albums.
 *      description: "Get a list of albums."
 *      parameters:
 *         - name: "title"
 *           in: query
 *           required: false
 *           description: "Name of the albums"
 *           schema:
 *              type: string
 *           example:  "Aftermath"
 *         - name: "artist"
 *           in: query
 *           required: false
 *           description: "Albums artist."
 *           schema:
 *              type: string
 *           example:  "artist1"
 *         - name: "subscription"
 *           in: query
 *           required: false
 *           description: "Minimum subscription to access the albums."
 *           schema:
 *              type: string
 *           example:  "FREE"
 *         - name: "genre"
 *           in: query
 *           required: false
 *           description: "Genre of the albums"
 *           schema:
 *              type: string
 *           example:  "rock"
 *      responses:
 *          "200":
 *              description: "returns all albums that match the parameters."
 *          "400":
 *               description: "Could not get albums with this parameters"
 *          "404":
 *               description: "Not found."
 *          "500":
 *              description: "Internal Server Error: Cannot response the request"
 */
router.get(constants.ALBUM_URL, async (req, res) => {
  Logger.request("Obtener albumes.");
  await AlbumService.getAlbums(req, res);
});

/**
 * @swagger
 * tags:
 *    name: Playlist
 * /playlists:
 *    post:
 *      tags: [Playlist]
 *      summary: Create Playlist.
 *      description: "Create a new playlist."
 *      consumes:
 *        - application/json
 *      produces:
 *        - application/json
 *      requestBody:
 *          content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  required:
 *                    - title
 *                    - owner
 *                    - songs
 *                    - isCollaborative
 *                  properties:
 *                      title:
 *                          type: string
 *                          description: "Name of playlist."
 *                          example : "Domingo de asadito"
 *                      description:
 *                          type: string
 *                          description: "Description of playlist."
 *                          example : "Musica para escuchar comiendo un rico asado"
 *                      songs:
 *                          type: array
 *                          description: "Songs of playlist."
 *                          items:
 *                              type: integer
 *                          example : [1,2,7]
 *                      owner:
 *                          type: string
 *                          description: "Playlist owner."
 *                          example : "artist1"
 *                      isCollaborative:
 *                          type: string
 *                          description: "The playlist can be modified by others."
 *                          example : true
 *      responses:
 *          "200":
 *              description: "returns created playlist."
 *          "400":
 *               description: "Could not create an playlist with this parameters."
 *          "404":
 *               description: "Not found."
 *          "500":
 *              description: "Internal Server Error: Cannot response the request."
 */
router.post(constants.PLAYLIST_URL, async (req, res) => {
  Logger.request("Crear nueva playlist.");
  await PlaylistService.newPlaylist(req, res);
});

/**
 * @swagger
 * /playlists:
 *    get:
 *      tags: [Playlist]
 *      summary: Get Playlists.
 *      description: "Get a list of playlists."
 *      parameters:
 *         - name: "title"
 *           in: query
 *           required: false
 *           description: "Name of the playlist"
 *           schema:
 *              type: string
 *           example:  "Domingo de asadito"
 *         - name: "owner"
 *           in: query
 *           required: false
 *           description: "Playlist owner."
 *           schema:
 *              type: string
 *           example:  "artist1"
 *      responses:
 *          "200":
 *              description: "returns all playlists that match the parameters."
 *          "400":
 *               description: "Could not get playlists with this parameters"
 *          "404":
 *               description: "Not found."
 *          "500":
 *              description: "Internal Server Error: Cannot response the request"
 */
router.get(constants.PLAYLIST_URL, async (req, res) => {
  Logger.request("Obtener listado de playlists.");
  await PlaylistService.getPlaylists(req, res);
});

/**
 * @swagger
 * /playlists/{id}:
 *    get:
 *      tags: [Playlist]
 *      summary: Get Playlist.
 *      description: "Get playlist with id."
 *      parameters:
 *         - name: "id"
 *           in: path
 *           required: true
 *           description: "Playlist Id."
 *           schema:
 *              type: string
 *           example: 1
 *      responses:
 *          "200":
 *              description: "returns playlist with the id."
 *          "400":
 *               description: "Could not get playlist with this id"
 *          "404":
 *               description: "Not found."
 *          "500":
 *              description: "Internal Server Error: Cannot response the request"
 */
router.get(`${constants.PLAYLIST_URL}/:id`, async (req, res) => {
  Logger.request('Obtener playlist.')
  await PlaylistService.getPlaylist(req, res);
})

/**
 * @swagger
 * /playlists:
 *    post:
 *      tags: [Playlist]
 *      summary: Change playlist status.
 *      description: "Get playlist status with id."
 *      parameters:
 *         - name: "id"
 *           in: body
 *           required: true
 *           description: "Playlist Id."
 *           schema:
 *              type: string
 *         - name: "isPublic"
 *           in: body
 *           required: true
 *           description: "Playlist status (if is public or not)."
 *           schema:
 *              type: boolean
 *      responses:
 *          "200":
 *              description: "returns playlist with the id."
 *          "500":
 *              description: "Internal Server Error: Cannot response the request"
 */
router.post(`${constants.PLAYLIST_STATUS_URL}`, async (req, res) => {
  Logger.request('Cambiar estado de la playlist.')
  await PlaylistService.changePlaylistStatus(req, res);
})

/**
 * @swagger
 * /content:
 *    get:
 *      tags: [Content]
 *      summary: Get content.
 *      description: "Get a list of songs, albums and playlists."
 *      responses:
 *          "200":
 *              description: "returns all songs content."
 *          "500":
 *              description: "Internal Server Error: Cannot answer the request."
 */
router.get(constants.CONTENT_URL, async (req,
                                         res) => {
  Logger.request("Obtener contenido.");

  await ContentManagementService.getContent(req,
                                            res);
});

/**
 * @swagger
 * /disablecontent:
 *    post:
 *      tags: [Content]
 *      summary: Disable content.
 *      description: "Disable song, album or playlist."
 *      responses:
 *          "200":
 *              description: "Content disabled."
 *          "500":
 *              description: "Internal Server Error: Cannot answer the request."
 */
router.post(constants.DISABLE_CONTENT_URL, async (req,
                                                 res) => {
  Logger.request("Deshabilitar contenido.");

  await ContentManagementService.disableContent(req,
                                                res);
});

/**
 * @swagger
 * /enablecontent:
 *    post:
 *      tags: [Content]
 *      summary: Enable content.
 *      description: "Disable song, album or playlist."
 *      responses:
 *          "200":
 *              description: "Content enabled."
 *          "500":
 *              description: "Internal Server Error: Cannot answer the request."
 */
router.post(constants.ENABLE_CONTENT_URL, async (req,
                                                 res) => {
  Logger.request("Habilitar contenido.");

  await ContentManagementService.enableContent(req,
                                               res);
});

module.exports = router;
