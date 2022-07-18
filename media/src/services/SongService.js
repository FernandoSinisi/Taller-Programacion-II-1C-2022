const utils = require("../others/utils");
const Logger = require("./Logger");
const {postToGateway} = require("../others/utils");
const {Song} = require("../data/Media");
const {Op} = require('sequelize');
const constants = require('../others/constants');
const {FavSongs} = require("../data/Media");

async function newSong(req, res) {
  Logger.info("Creando nueva cancion.");
  const {title, description, artists, author, subscription, genre, link, artwork} = req.body;
  if (utils.areAnyUndefined([title, artists, link])) {
    Logger.error(`Error: title, artists y link son obligatorios.`);
    utils.setErrorResponse(`Error: title, artists y link son obligatorios.`, 400, res);
    return;
  }
  const saved = await Song.create(
    {
      title: title,
      description: description,
      artists: artists,
      author: author,
      subscription: subscription,
      genre: genre,
      link: link,
      artwork: artwork,
    }
  ).catch(error => {
    Logger.error(`Error al intentar guardar en la base de datos: ${error.toString()}`);
    utils.setErrorResponse(`Error tratando de crear la cancion.`, 500, res);
  });

  if (saved === undefined) {
    Logger.error(`Error al intentar guardar en la base de datos.`);
    utils.setErrorResponse(`Error tratando de crear la cancion.`, 500, res);
  }
  if (res.statusCode >= 400) return;
  Logger.info("Cancion guardada.")
  utils.setBodyResponse(saved, 200, res);
}

async function findSongs(queryLimit,
                         where) {
  const songs = await Song.findAll({
        where: where,
        limit: queryLimit,
        order: [['createdAt', 'ASC']],
      }
  ).catch(error => {
    throw utils.newError(500, 'Error al realizar la consulta de canciones');
  });

  return songs;
}

async function changeSongStatus(songId,
                                isBlocked) {
  await Song.update( {
        isBlocked: isBlocked
      },
      {
        where: {
        id: songId
      } })
      .catch(error => {
        throw utils.newError(500, 'Error al cambiar el estado de la canción.');
     });
}

async function getSongs(req, res) {
  Logger.info("Obteniendo las canciones")
  const {title, artist, genre, subscription} = req.query;

  const queryLimit = req.query.limit ? Number(req.query.limit)
                                     : constants.MAX_LIMIT;

  const where = {};

  where.isBlocked = false;

  if (title !== undefined) where.title = title
  if (artist !== undefined) where.artists = {[Op.contains]: [artist]}
  if (genre !== undefined) where.genre = genre
  if (subscription !== undefined) where.subscription = subscription

  let songs;

  try {
    songs = await findSongs(queryLimit,
                            where);
  } catch(e) {
    Logger.error(`No se pudieron obtener las canciones de la base de datos: ${error.toString()}`);
    utils.setErrorResponse("No se pudieron obtener las canciones", 500, res);
  }

  if (songs === null || songs === undefined) {
    Logger.error("No se pudieron obtener las canciones de la base de datos");
    utils.setErrorResponse("No se pudieron obtener las canciones", 500, res);
  }
  if (res.statusCode >= 400) return;
  Logger.info(`Canciones obtenidas: ${songs.length}`)
  utils.setBodyResponse(songs, 200, res);
}

async function getSong(req, res) {
  Logger.info("Get song by id");

  const id = req.params.id;

  const adminRequest = req.query
                          .adminRequest !== undefined &&
                       req.query
                           .adminRequest === "true";

  const whereCondition = adminRequest ?
                          {
                            id: id
                          }
                          : {
                            id: id,
                            isBlocked: false
                          }

  const song = await Song.findOne({
    where: whereCondition,
    attributes: ['id', 'title', 'description', 'artists', 'author', 'subscription', 'genre', 'link', 'artwork']
  } ).catch(error => {
    Logger.error(`No se pudo obtener la cancion de la base de datos: ${error.toString()}`);
    utils.setErrorResponse("No se pudo obtener la cancion", 500, res);
  });

  if (song === undefined || song === null) {
    Logger.error("No se pudo obtener la cancion de la base de datos");
    utils.setErrorResponse("No se pudo obtener la cancion", 500, res);
  }

  if (res.statusCode >= 400) return;

  const requestBody = {
    usersIds: song.artists,

    redirectTo: constants.USERS_HOST + constants.PARSE_USERS_URL
  }

  const response = await utils.postToGateway(requestBody);

  if (response.error !== undefined) {
    Logger.error("No se pudo obtener los artistas de la canción.");
    Logger.error(response.error);
    return utils.setErrorResponse("No se pudo obtener la cancion", 500, res);
  } else {
    song.artists = response;
  }

  Logger.info(`Cancion obtenida: ${song.title}`)
  utils.setBodyResponse(song, 200, res);
}

async function favSong(req,
                       res) {
  const {userId,
         songId} = req.body;

  const response = await FavSongs.create({
    userId: userId,
    songId: songId,
  }).catch(error => {
    return {
      error: error
    }
  });

  if (response === null || response.error !== undefined) {
    Logger.error(`No se pudo agregar la canción a favoritos: ${response.error}`);
    return utils.setErrorResponse("No se pudo guardar la cancion", 500, res);
  }

  return utils.setBodyResponse({msg:
                        "Canción agregada a favoritos"},
                        200,
                        res);
}

async function unfavSong(req,
                       res) {
  const {userId,
        songId} = req.body;

  const response = await FavSongs.destroy({
                          where: {
                            userId: userId,
                            songId: songId
                            }
                          }).catch(error => {
                            return {
                              error: error
                            }
                          });

  if (response === null || response.error !== undefined) {
    Logger.error(`No se pudo quitar la canción a favoritos: ${response.error}`);
    return utils.setErrorResponse("No se pudo quitar la canción a favoritos", 500, res);
  }

  return utils.setBodyResponse({msg:
            "Canción quitada a favoritos"},
              200,
              res);
}

async function getFavoriteSongs(req,
                                res) {
  const userId = req.query
                    .userId;

  const queryLimit = req.query.limit ? Number(req.query.limit)
      : constants.MAX_LIMIT;

  const response = await FavSongs.findAll( {
    where: {
      userId: userId,
    },
    limit: queryLimit,
    order: [['createdAt', 'ASC']],
    }).catch(error => {
    return {
      error: error
    }
  });

  if (response === null || response.error !== undefined) {
    Logger.error(`No se pudo obtener las canciones favoritas: ${response?.error}`);
    return utils.setErrorResponse("No se pudieron traer las canciones.", 500, res);
  }

  const mapedSongs = response.map( async (element) => {
    const pair = element.dataValues;

    const song = await Song.findOne( {
      where: {
        id: pair.songId,
        isBlocked: false
      }
    } ).then()
        .catch(error => {
          return {
            error: error
          }
        } );

    // Song is blocked
    if (song === null) {
      return {};
    }

    return song.dataValues;
  } );

  const solvedSongs = ( await Promise.all(mapedSongs) )
                      .filter(song => song.id !== undefined);

  return utils.setBodyResponse(solvedSongs,
      200,
      res);
}

async function checkFavSong(req,
                            res) {
  const userId = req.query
                    .userId;

  const songId = req.query
                    .songId;

  const response = await FavSongs.findAll( {
    where: {
      userId: userId
    },
    order: [['createdAt', 'ASC']],
  } ).catch(error => {
    return {
      error: error
    }
  });

  if (response === null || response.error !== undefined) {
    Logger.error(`No se pudo obtener las canciones favoritas: ${response?.error}`);
    return utils.setErrorResponse("No se pudieron traer las canciones.", 500, res);
  }

  const mapedSongs = response.map( async (element) => {
    const pair = element.dataValues;

    const song = await Song.findOne( {
      where: {
        id: pair.songId
      }
    } ).then()
        .catch(error => {
          return {
            error: error
          }
        } );

    return song.dataValues;
  } );

  const solvedSongs = await Promise.all(mapedSongs);

  const songIds = solvedSongs.map(song => song.id);

  return utils.setBodyResponse( {
        hasSong: songIds.includes( parseInt(songId)
        ) },
        200,
        res);
}

module.exports = {
  newSong,
  getSongs,
  getSong,
  favSong,
  getFavoriteSongs,
  unfavSong,
  checkFavSong,
  findSongs,
  changeSongStatus
};
