const assert = require('assert');
const sinon = require('sinon');
const rewire = require('rewire');
const {mockResponse} = require('./utils');
const PlaylistService = rewire('../src/services/PlaylistService');

describe('PlaylistService', function() {
  describe('getPlaylist', function() {
    it('finds the playlist with the specified id', async function() {
      const playlist = {};
      const playlistFindOneFake = sinon.fake.returns(Promise.resolve(playlist))
      const revertRewire = PlaylistService.__set__({
        Playlist: {findOne: playlistFindOneFake},
      });
      const req = {params: {id: 1}};
      const res = mockResponse();

      await PlaylistService.getPlaylist(req, res);

      assert(res.status.calledWith(200));
      assert(res.json.calledWith(playlist));
      revertRewire();
    });

    it('returns status 404 if playlist is not found', async function() {
      const playlistFindOneFake = sinon.fake.returns(Promise.resolve(null))
      const revertRewire = PlaylistService.__set__({
        Playlist: {findOne: playlistFindOneFake},
      });
      const req = {params: {id: 1}};
      const res = mockResponse();

      await PlaylistService.getPlaylist(req, res);

      assert(res.status.calledWith(404));
      assert(res.json.calledWith(
        {error: `Playlist with id ${req.params.id} does not exist`}
      ));
      revertRewire();
    });
  });

  describe('getPlaylists', function () {
    it('returns a filtered list of playlists', async function () {
      const playlist = {};
      const playlists = [playlist, playlist, playlist];
      const playlistFindAll = sinon.fake.returns(Promise.resolve(playlists))
      const revertRewire = PlaylistService.__set__({
        Playlist: {findAll: playlistFindAll},
      });
      const ownerId = 'some owner id';
      const req = {query: {owner: ownerId}};
      const res = mockResponse();

      await PlaylistService.getPlaylists(req, res);

      assert(res.status.calledWith(200));
      assert(res.json.calledWith(playlists));
      assert(playlistFindAll.calledWith(sinon.match({where: {owner: ownerId}})));
      revertRewire();
    })
  });

  describe('newPlaylist', function () {
    it('creates a new playlist', async function() {
      const songIds = [1, 2, 3];
      const songs = [{}, {}, {}]
      const songFindAllFake = sinon.fake.returns(Promise.resolve(songs))
      const playlistAddSongsFake = sinon.fake.returns(Promise.resolve());
      const playlist = {
        addSongs: playlistAddSongsFake,
        title: 'some title',
        owner: 'the owner',
      };
      playlist.get = () => playlist;
      const playlistCreateFake = sinon.fake.returns(Promise.resolve(playlist));
      const revertRewire = PlaylistService.__set__({
        Song: {findAll: songFindAllFake},
        Playlist: {create: playlistCreateFake},
      });
      const req = {body: {
        title: 'some title',
        owner: 'the owner',
        isCollaborative: false,
        songs: songIds,
      }};
      const res = mockResponse();

      await PlaylistService.newPlaylist(req, res);

      assert(res.status.calledWith(200));
      assert(res.json.calledWith(sinon.match({
        title: 'some title',
        owner: 'the owner',
        songs: songs,
      })));
      assert(songFindAllFake.calledWith(sinon.match({where: {id: songIds}})));
      assert(playlistCreateFake.calledWith(sinon.match.has('title', 'some title')
        .and(sinon.match.has('owner', 'the owner'))));
      assert(playlistAddSongsFake.calledWith(songs));
      revertRewire();
    })
  });

  describe('changePlaylistStatus', function () {
    it('change playlist state from private to public', async function() {

      const updatePlaylistMock = sinon.fake.returns(Promise.resolve(1));
      const revertRewire = PlaylistService.__set__({
        Playlist: {update: updatePlaylistMock},
      });
      const req = {
        body: {
          id: 1,
          isPublic: true,
      }};
      const res = mockResponse();

      await PlaylistService.changePlaylistStatus(req, res);

      assert(res.status.calledWith(200));
      assert(res.json.calledWith(
        {msg: "Estado actualizado"}
      ));
      assert(updatePlaylistMock.calledWithMatch(
        {isCollaborative: req.body.isPublic},
        {where: {id: req.body.id}}));
      assert(updatePlaylistMock.calledOnce);
      revertRewire();
    })
  });

  describe('changePlayList', function () {
    it('changePlayList ok', async function() {

      const updatePlaylistMock = sinon.fake.returns(Promise.resolve(1));
      const revertRewire = PlaylistService.__set__({
        Playlist: {update: updatePlaylistMock},
      });
      const playlistId = 1;
      const isBlocked = true;

      await PlaylistService.changePlayList(playlistId, isBlocked);

      assert(updatePlaylistMock.calledWithMatch(
        {isBlocked: isBlocked},
        {where: {id: playlistId}}));
      assert(updatePlaylistMock.calledOnce);
      revertRewire();
    })
  });
});
