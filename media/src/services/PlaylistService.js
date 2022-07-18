const utils = require("../others/utils");
const Logger = require("./Logger");
const {Song, Playlist} = require("../data/Media");

const getPlaylist = async (req, res) => {
  try {
    const playlist = await findPlaylist(req.params.id);
    res.status(200).json(playlist);
  } catch (error) {
    res.status(error.status).json(error.body);
  }
}

const findPlaylist = async id => {
  return Playlist.findOne({where: {id}, include: {model: Song, through: {attributes: []}}})
    .catch(error => {
      Logger.error(`Error al intentar obtener la playlist en la base de datos: ${error.toString()}`);
      throw utils.newError(500, 'Error tratando de obtener la playlist.');
    })
    .then(playlist => {
      if (playlist == null) {
        const message = `Playlist with id ${id} does not exist`;
        Logger.error(message);
        throw utils.newError(404, message);
      }
      return playlist;
    })
}

async function changePlayList(playlistId,
                              isBlocked) {
  await Playlist.update( {
        isBlocked: isBlocked
      },
      {
        where: {
          id: playlistId
        } })
      .catch(error => {
        throw utils.newError(500, 'Error al cambiar el estado de la playlist.');
      });
}

const newPlaylist = async (req, res) => {
  const {title, description, owner, isCollaborative, songs, artwork} = req.body;

  if (utils.areAnyUndefined([title, owner, songs, isCollaborative])) {
    Logger.error('Error: title, owner, isCollaborative y songs son obligatorios.');
    utils.setErrorResponse('title, owner, isCollaborative y songs son obligatorios.', 400, res);
    return;
  }

  try {
    const playlist = await createPlaylist({title, description, owner, isCollaborative, songs, artwork});
    res.status(200).json(playlist);
  } catch (error) {
    res.status(error.status).json(error.body);
  }
}

const createPlaylist = async (playlistData) => {
  const songs = await findSongs(playlistData.songs);

  return Playlist.create(
    {
      title: playlistData.title,
      description: playlistData.description,
      owner: playlistData.owner,
      isCollaborative: playlistData.isCollaborative || false,
      artwork: playlistData.artwork,
    }
  ).then(async playlist => {
    await playlist.addSongs(songs);
    return {...playlist.get({plain: true}), songs: songs};
  }).catch(error => {
    Logger.error(`Error al intentar guardar en la base de datos: ${error.toString()}`);
    throw utils.newError(500, 'Error tratando de crear la playlist.');
  });
}

const findSongs = async ids => {
  const savedSongs = await Song.findAll({
    attributes: ['id', 'title', 'description', 'artists', 'author', 'genre', 'subscription', 'link', 'artwork'], where: {id: ids},
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

const findPlaylists = (filters) => {
  return Playlist.findAll({
    where: filters,
    include: {model: Song, through: {attributes: []}}
  }).catch(error => {
    Logger.error(`Error al obtener playlists de la base de datos: ${error.toString()}`);
    throw utils.newError(500, 'Error al obtener las playlists');
  });
}

const getPlaylists = async (req, res) => {
  const title = req.query.title;
  const owner = req.query.owner;
  let filters = {};
  filters.isBlocked = false;

  if (title !== undefined) {
    filters.title = title;
  }
  if (owner !== undefined) {
    filters.owner = owner;
  }

  try {
    const playlists = await findPlaylists(filters)
    res.status(200).json(playlists);
  } catch (error) {
    res.status(error.status).json(error.body);
  }
}

const changePlaylistStatus = async (req, res) => {
  const data = req.body;

  await Playlist.update( {
        isCollaborative: data.isPublic
      },
      {
        where: {
          id: data.id
        } })
      .catch(error => {
        return utils.setErrorResponse("No se pudo guardar la cancion", 500, res);
      } );

  return utils.setBodyResponse({msg:
            "Estado actualizado"},
      200,
      res);
}

module.exports = {
  getPlaylist,
  getPlaylists,
  newPlaylist,
  findPlaylists,
  changePlayList, changePlaylistStatus
}
