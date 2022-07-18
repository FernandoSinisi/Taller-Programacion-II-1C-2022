const database = require('./database');
const Sequelize = require('sequelize');
const constants = require("../others/constants");
const {Song,
       Playlist,
       Album,
       AlbumSong,
       PlaylistSong} = require("../data/Media");
const queryInterface = database.getQueryInterface();

async function runMigrations() {

  await queryInterface.addColumn(Song.tableName, 'title', {
    type: Sequelize.STRING(constants.MAX_STR_LEN),
    allowNull: false,
    validate: {notEmpty: true},
    unique: false
  }).catch(error => console.log(error.toString()));

  await queryInterface.addColumn(Song.tableName, 'description', {
    type: Sequelize.STRING(constants.MAX_STR_LEN),
    allowNull: true,
    unique: false,
    defaultValue: ''
  }).catch(error => console.log(error.toString()));

  await queryInterface.removeColumn(Song.tableName, 'artist')
    .catch(e => {
      console.log(e);
    });

  await queryInterface.addColumn(Song.tableName, 'artists', {
    type: Sequelize.ARRAY(Sequelize.STRING(constants.FIREBASE_MAX_LEN)),
    allowNull: false,
    validate: {notEmpty: true},
    unique: false
  }).catch(error => console.log(error.toString()));

  await queryInterface.addColumn(Song.tableName, 'author', {
    type: Sequelize.STRING(constants.MAX_STR_LEN),
    allowNull: true,
    unique: false,
    defaultValue: ''
  }).catch(error => console.log(error.toString()));

  await queryInterface.addColumn(Song.tableName, 'subscription', {
    type: Sequelize.STRING(constants.MAX_STR_LEN),
    allowNull: false,
    unique: false,
    defaultValue: 'FREE'
  }).catch(error => console.log(error.toString()));

  await queryInterface.addColumn(Song.tableName, 'genre', {
    type: Sequelize.STRING(constants.MAX_STR_LEN),
    allowNull: true,
    unique: false,
  }).catch(error => console.log(error.toString()));

  await queryInterface.addColumn(Song.tableName, 'link', {
    type: Sequelize.STRING(constants.MAX_STR_FIREBASE_LINK),
    allowNull: false,
    validate: {notEmpty: true},
    unique: false
  }).catch(error => console.log(error.toString()));

  await queryInterface.addColumn(Album.tableName, 'title', {
    type: Sequelize.STRING(constants.MAX_STR_LEN),
    allowNull: false,
    validate: {notEmpty: true},
    unique: false,
  }).catch(error => console.log(error.toString()));

  await queryInterface.addColumn(Album.tableName, 'genre', {
    type: Sequelize.STRING(constants.MAX_STR_LEN),
    allowNull: false,
    validate: {notEmpty: true},
    unique: false
  }).catch(error => console.log(error.toString()));

  await queryInterface.addColumn(Album.tableName, 'link', {
    type: Sequelize.STRING(constants.MAX_STR_FIREBASE_LINK),
    allowNull: true,
    unique: false
  }).catch(error => console.log(error.toString()));

  await queryInterface.removeColumn(Album.tableName, 'artist')
    .catch(e => {
      console.log(e);
    });

  await queryInterface.addColumn(Album.tableName, 'artists', {
    type: Sequelize.ARRAY(Sequelize.STRING(constants.FIREBASE_MAX_LEN)),
    allowNull: false,
    validate: {notEmpty: true},
    unique: false
  }).catch(error => console.log(error.toString()));

  await queryInterface.addColumn(Album.tableName, 'subscription', {
    type: Sequelize.STRING(constants.MAX_STR_LEN),
    allowNull: false,
    unique: false,
    defaultValue: 'FREE'
  }).catch(error => console.log(error.toString()));

  await queryInterface.addColumn(AlbumSong.tableName, 'albumId', {
    type: Sequelize.INTEGER,
    references: {
      model: Album.tableName,
      key: 'id'
    }
  }).catch(error => console.log(error.toString()));

  await queryInterface.addColumn(AlbumSong.tableName, 'songId', {
    type: Sequelize.INTEGER,
    references: {
      model: Song.tableName,
      key: 'id'
    }
  }).catch(error => console.log(error.toString()));

  await queryInterface.addColumn(Playlist.tableName, 'title', {
    type: Sequelize.STRING(constants.MAX_STR_LEN),
    allowNull: false,
    validate: {notEmpty: true},
    unique: false
  }).catch(error => console.log(error.toString()));

  await queryInterface.addColumn(Playlist.tableName, 'description', {
    type: Sequelize.STRING(constants.MAX_STR_LEN),
    allowNull: true,
    unique: false,
    defaultValue: ''
  }).catch(error => console.log(error.toString()));

  await queryInterface.addColumn(Playlist.tableName, 'owner', {
    type: Sequelize.STRING(constants.FIREBASE_MAX_LEN),
    allowNull: false,
    validate: {notEmpty: true},
    unique: false
  }).catch(error => console.log(error.toString()));

  await queryInterface.addColumn(Playlist.tableName, 'isCollaborative', {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  }).catch(error => console.log(error.toString()));

  await queryInterface.dropTable('album_playlist')
    .catch(error => console.log(error.toString()));

  await queryInterface.addColumn(PlaylistSong, 'playlistId', {
    type: Sequelize.INTEGER,
    references: {
      model: 'Playlist',
      key: 'id'
    }
  }).catch(error => console.log(error.toString()));

  await queryInterface.addColumn(PlaylistSong, 'songId', {
    type: Sequelize.INTEGER,
    references: {
      model: Song.tableName,
      key: 'id'
    }
  }).catch(error => console.log(error.toString()));

  await queryInterface.addColumn(Song.tableName,
      'isBlocked', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }).catch(error => console.log(error.toString()));

  await queryInterface.addColumn(Playlist.tableName,
      'isBlocked', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }).catch(error => console.log(error.toString()));

  await queryInterface.addColumn(Album.tableName,
      'isBlocked', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }).catch(error => console.log(error.toString()));

  await queryInterface.createTable('song_favs', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    songId: {
      type: Sequelize.INTEGER,
    },
    userId: {
      type: Sequelize.STRING(constants.MAX_STR_LEN),
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
  } ).catch(error => console.log(error.toString()));

  await queryInterface.createTable('album_favs', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    songId: {
      type: Sequelize.INTEGER,
    },
    userId: {
      type: Sequelize.STRING(constants.MAX_STR_LEN),
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
  } ).catch(error => console.log(error.toString()));

  await queryInterface.addColumn(Song.tableName, 'artwork',{
    type: Sequelize.STRING(constants.MAX_STR_FIREBASE_LINK),
    allowNull: true,
    unique: false,
  }).catch(e => console.log(e.toString()));

  await queryInterface.addColumn(Playlist.tableName, 'artwork',{
    type: Sequelize.STRING(constants.MAX_STR_FIREBASE_LINK),
    allowNull: true,
    unique: false,
  }).catch(e => console.log(e.toString()));

  await queryInterface.changeColumn(Song.tableName,
      'subscription', {
        type: Sequelize.STRING(constants.MAX_STR_LEN),
        allowNull: false,
        unique: false,
        defaultValue: 'free'
      },)
      .catch(error => {
        console.log(error.toString());
      });

  await queryInterface.changeColumn(Album.tableName,
      'subscription', {
        type: Sequelize.STRING(constants.MAX_STR_LEN),
        allowNull: false,
        unique: false,
        defaultValue: 'free'
      },)
      .catch(error => {
        console.log(error.toString());
      });
}

module.exports = {runMigrations}
