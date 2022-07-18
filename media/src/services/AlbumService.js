const {MSG_NO_AUTORIZADO} = require("../others/constants");

const utils = require("../others/utils");
const Logger = require("./Logger");
const {MAX_LIMIT} = require("../others/constants");
const {Song, Album} = require("../data/Media");
const {Op} = require("sequelize");
const {FavAlbums} = require("../data/Media");

const newAlbum = async (req, res) => {
  const {title, artists, genre, subscription, link, songs} = req.body;
  if (utils.areAnyUndefined([title, artists, genre, subscription, songs])) {
    Logger.error(`Error: title, artists, genre, subscription y songs son campos obligatorios.`);
    utils.setErrorResponse(`Error: title, artists, genre, subscription y songs son campos obligatorios.`, 400, res);
    return;
  }
  try {
    const album = await createAlbum({title, artists, genre, subscription, link, songs});
    Logger.info("Album Creado");
    res.status(200).json(album);
  } catch (error) {
    res.status(error.status).json(error.body);
  }
}

const createAlbum = async (albumData) => {
  const songs = await findSongs(albumData.songs);

  if (!songs.every(song => {
    return song.artists.some(a => {
      return albumData.artists.includes(a)
    })
  })) {
    Logger.error('Se quieren agregar canciones de terceros al album');
    throw utils.newError(400, 'Se quieren agregar canciones de terceros al album');
  }

  return Album.create(
    {
      title: albumData.title,
      artists: albumData.artists,
      genre: albumData.genre,
      subscription: albumData.subscription,
      link: albumData.link,
    }
  ).then(async album => {
    await album.addSongs(songs);
    return {...album.get({plain: true}), songs: songs};
  }).catch(error => {
    Logger.error(`Error al intentar guardar en la base de datos: ${error.toString()}`);
    throw utils.newError(500, 'Error tratando de crear el album.');
  });
}

async function changeAlbumStatus(albumId,
                                 isBlocked) {
  await Album.update( {
        isBlocked: isBlocked
      },
      {
        where: {
          id: albumId
        } })
      .catch(error => {
        throw utils.newError(500, 'Error al cambiar el estado del album.');
      });
}

const findSongs = async ids => {
  const savedSongs = await Song.findAll({
    attributes: ['id', 'title', 'description', 'artists', 'author', 'genre', 'subscription', 'link'], 
    where: {id: ids},
    order: [['createdAt', 'ASC']],
  }).catch(error => {
    Logger.error(`Error al obtener canciones de la base de datos: ${error.toString()}`);
    throw utils.newError(500, 'Error al obtener las canciones');
  });
  if (ids.length !== savedSongs.length) {
    Logger.error('Hay canciones invalidas o no existentes');
    throw utils.newError(400, 'Hay canciones invalidas o no existentes');
  }
  return savedSongs;
}

const getAlbum = async (req, res) => {
  try {
    const album = await findAlbum(req.params.id);
    Logger.info("Album obtenido");
    res.status(200).json(album);
  } catch (error) {
    res.status(error.status).json(error.body);
  }
}

const findAlbum = async id => {
  return Album.findOne({where: {id}, include: {model: Song, through: {attributes: []}}})
    .catch(error => {
      Logger.error(`Error al intentar obtener el album en la base de datos: ${error.toString()}`);
      throw utils.newError(500, 'Error tratando de obtener el album.');
    })
    .then(album => {
      if (album === null || album === undefined) {
        const message = `Album con id: ${id} no existe`;
        Logger.error(message);
        throw utils.newError(404, message);
      }
      return album;
    })
}

const findAlbums = (queryLimit,
                    filters) => {
  return Album.findAll({
    where: filters,
    include: {model: Song, through: {attributes: []}},
    limit: queryLimit,
    order: [['createdAt', 'ASC']],
  }).catch(error => {
    Logger.error(`Error al obtener albums de la base de datos: ${error.toString()}`);
    throw utils.newError(500, 'Error al obtener las albums');
  });
}

const getAlbums = async (req, res) => {
  const {title, artist, genre, subscription} = req.query;

  const queryLimit = req.query.limit ? Number(req.query.limit)
      : MAX_LIMIT;

  const where = {};

  where.isBlocked = false;

  if (title !== undefined) where.title = title
  if (artist !== undefined) where.artists = {[Op.contains]: [artist]}
  if (genre !== undefined) where.genre = genre
  if (subscription !== undefined) where.subscription = subscription

  try {
    const albums = await findAlbums(queryLimit,
                                    where);
    Logger.info(`Albumes obtenidos: ${albums.length}`);
    res.status(200).json(albums);
  } catch (error) {
    res.status(error.status).json(error.body);
  }
}

const favAlbum = async (req, res) => {
    const {userId,
           albumId} = req.body;

    const response = await FavAlbums.create({
      userId: userId,
      albumId: albumId,
    }).catch(error => {
      return {
        error: error
      }
    });

    if (response === null || response.error !== undefined) {
      Logger.error(`No se pudo agregar el album a favoritos: ${response?.error}`);
      return utils.setErrorResponse("No se pudo agregar el album a favoritos", 500, res);
    }

    return utils.setBodyResponse({ok:
                                 "ok"},
                                 200,
                                 res);
}

async function unfavAlbum(req, res) {
  const {userId,
         albumId} = req.body;

  const response = await FavAlbums.destroy({
    where: {
      userId: userId,
      albumId: albumId
    }
  }).catch(error => {
    return {
      error: error
    }
  });

  if (response === null || response.error !== undefined) {
    Logger.error(`No se pudo quitar el album de favoritos: ${response.error}`);
    return utils.setErrorResponse("No se pudo quitar el album de favoritos", 500, res);
  }

  return utils.setBodyResponse({msg:
            "Album quitado a favoritos"},
      200,
      res);
}

async function checkFavAlbum(req, res) {
  const userId = req.query
                    .userId;

  const albumId = req.query
                     .albumId;

  const response = await FavAlbums.findAll( {
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
    Logger.error(`No se pudieron obtener los albumes favoritos: ${response?.error}`);
    return utils.setErrorResponse("No se pudieron obtener los albumes favoritos.", 500, res);
  }

  const mapedAlbums = response.map( async (element) => {
    const pair = element.dataValues;

    const album = await Album.findOne( {
      where: {
        id: pair.albumId
      }
    } ).then()
        .catch(error => {
          return {
            error: error
          }
        } );

    return album.dataValues;
  } );

  const solvedAlbums = await Promise.all(mapedAlbums);

  const albumIds = solvedAlbums.map(album => album.id);

  return utils.setBodyResponse( {
        hasSong: albumIds.includes( parseInt(albumId) ) },
      200,
      res);
}

async function getFavoriteAlbums(req, res) {
  const userId = req.query
                    .userId;

  const queryLimit = req.query.limit ? Number(req.query.limit)
      : MAX_LIMIT;

  const response = await FavAlbums.findAll( {
    where: {
      userId: userId
    },
    limit: queryLimit,
    order: [['createdAt', 'ASC']],
  } ).catch(error => {
    return {
      error: error
    }
  });

  if (response === null || response.error !== undefined) {
    Logger.error(`No se pudo obtener los albumes favoritas: ${response.error}`);
    return utils.setErrorResponse("No se pudieron traer los albumes.", 500, res);
  }

  const mapedAlbums = response.map( async (element) => {
    const pair = element.dataValues;

    const album = await Album.findOne( {
      where: {
        id: pair.albumId,
        isBlocked: false
      },
      include: {model: Song, through: {attributes: []}}
    } ).then()
        .catch(error => {
          return {
            error: error
          }
        } );

    // Album is blocked
    if (album === null) {
      return {};
    }

    return album;
  } );

  const solvedAlbums = ( await Promise.all(mapedAlbums) )
                      .filter(album => album.id !== undefined);

  return utils.setBodyResponse(solvedAlbums,
      200,
      res);
}


module.exports = {
  newAlbum,
  getAlbum,
  getAlbums,
  findAlbums,
  findSongs,
  changeAlbumStatus,
  favAlbum,
  unfavAlbum,
  checkFavAlbum,
  getFavoriteAlbums
};
