const assert = require('assert');
const sinon = require('sinon');
const rewire = require('rewire');
const {mockResponse} = require('./utils');
const AlbumService = rewire('../src/services/AlbumService');
const {setBodyResponse, setErrorResponse} = require('../src/others/utils')

describe('AlbumService', function () {
  describe('getAlbum', function () {
    it('finds the album with the specified id', async function () {
      const album = {};
      const albumFindOneFake = sinon.fake.returns(Promise.resolve(album))
      const revertRewire = AlbumService.__set__({
        Album: {findOne: albumFindOneFake},
      });
      const req = {params: {id: 1}};
      const res = mockResponse();

      await AlbumService.getAlbum(req, res);

      assert(res.status.calledWith(200));
      assert(res.json.calledWith(album));
      revertRewire();
    });

    it('returns status 404 if album is not found', async function () {
      const albumFindOneFake = sinon.fake.returns(Promise.resolve(null))
      const revertRewire = AlbumService.__set__({
        Album: {findOne: albumFindOneFake},
      });
      const req = {params: {id: 1}};
      const res = mockResponse();

      await AlbumService.getAlbum(req, res);

      assert(res.status.calledWith(404));
      assert(res.json.called);
      revertRewire();
    });
  });

  describe('getAlbums', function () {
    it('returns a filtered list of albums', async function () {
      const album = {};
      const albums = [album, album, album];
      const albumFindAll = sinon.fake.returns(Promise.resolve(albums))
      const revertRewire = AlbumService.__set__({
        Album: {findAll: albumFindAll},
      });
      const genre = 'some genre';
      const req = {query: {genre: genre}};
      const res = mockResponse();

      await AlbumService.getAlbums(req, res);

      assert(res.status.calledWith(200));
      assert(res.json.calledWith(albums));
      assert(albumFindAll.calledWith(sinon.match({where: {genre: genre}})));
      revertRewire();
    })
  });

  describe('newAlbum', function () {
    it('creates a new album', async function () {
      const songIds = [1, 2, 3];
      const songs = [
        {artists: ["artist1"], id: 1},
        {artists: ["artist2"], id: 2},
        {artists: ["artist1", "artist2"], id: 3}
      ];
      const songFindAllFake = sinon.fake.returns(Promise.resolve(songs))
      const albumAddSongsFake = sinon.fake.returns(Promise.resolve());
      const album = {
        addSongs: albumAddSongsFake,
        title: 'some title',
        subscription: 'free',
        genre: 'rock',
        artists: ['artist1', 'artist2'],
      };
      album.get = () => album;
      const albumCreateFake = sinon.fake.returns(Promise.resolve(album));
      const revertRewire = AlbumService.__set__({
        Song: {findAll: songFindAllFake},
        Album: {create: albumCreateFake},
      });
      const req = {
        body: {
          title: 'some title',
          subscription: 'free',
          genre: 'rock',
          artists: ['artist1', 'artist2'],
          songs: songIds,
        }
      };
      const res = mockResponse();

      await AlbumService.newAlbum(req, res);

      assert(res.status.calledWith(200));
      assert(res.json.calledWith(sinon.match({
        title: 'some title',
        subscription: 'free',
        genre: 'rock',
        artists: ['artist1', 'artist2'],
        songs: songs,
      })));
      assert(songFindAllFake.calledWith(sinon.match({where: {id: songIds}})));
      assert(albumCreateFake.calledWith(sinon.match.has('title', 'some title')
        .and(sinon.match.has('subscription', 'free'))));
      assert(albumAddSongsFake.calledWith(songs));
      revertRewire();
    });
  });

  describe('favAlbum', function () {
    it('favAlbum ok', async function () {
      const createFavAlbumMock = sinon.fake.returns(Promise.resolve(1));
      const revertRewire = AlbumService.__set__({
        FavAlbums: {create: createFavAlbumMock},
      });
      const req = {
        body: {
          userId: 1,
          albumId: 2,
        },
      };
      const res = mockResponse();

      await AlbumService.favAlbum(req, res);

      assert(res.status.calledWith(200));
      assert(res.json.calledWith(sinon.match(
        { ok: 'ok'}
      )));
      assert(createFavAlbumMock.calledWith(sinon.match(
        {albumId: req.body.albumId, userId: req.body.userId}
      )));
      assert(createFavAlbumMock.calledOnce);
      revertRewire();
    });

    it('favAlbum error creating pair userId-albumId', async function () {
      const createFavAlbumMock = sinon.fake.returns(Promise.resolve({error: 'favalbums error'}));
      const revertRewire = AlbumService.__set__({
        FavAlbums: {create: createFavAlbumMock},
      });
      const req = {
        body: {
          userId: 1,
          albumId: 2,
        },
      };
      const res = mockResponse();

      await AlbumService.favAlbum(req, res);

      assert(res.status.calledWith(500));
      assert(res.json.calledWith(sinon.match(
        { error: 'No se pudo agregar el album a favoritos'}
      )));
      assert(createFavAlbumMock.calledWith(sinon.match(
        {albumId: req.body.albumId, userId: req.body.userId}
      )));
      assert(createFavAlbumMock.calledOnce);
      revertRewire();
    });
  });

  describe('unfavAlbum', function () {
    it('unfavAlbum ok', async function () {
      const destroyFavAlbumMock = sinon.fake.returns(Promise.resolve(1));
      const revertRewire = AlbumService.__set__({
        FavAlbums: {destroy: destroyFavAlbumMock},
      });
      const req = {
        body: {
          userId: 1,
          albumId: 2,
        },
      };
      const res = mockResponse();

      await AlbumService.unfavAlbum(req, res);

      assert(res.status.calledWith(200));
      assert(res.json.calledWith(sinon.match(
        {msg: "Album quitado a favoritos"}
      )));
      assert(destroyFavAlbumMock.calledWith(sinon.match(
        {where: 
          {albumId: req.body.albumId, userId: req.body.userId}
        },
      )));
      assert(destroyFavAlbumMock.calledOnce);
      revertRewire();
    });

    it('unfavAlbum error destroying pair userId-albumId', async function () {
      const destroyFavAlbumMock = sinon.fake.returns(Promise.resolve({error: 'favalbums error'}));
      const revertRewire = AlbumService.__set__({
        FavAlbums: {destroy: destroyFavAlbumMock},
      });
      const req = {
        body: {
          userId: 1,
          albumId: 2,
        },
      };
      const res = mockResponse();

      await AlbumService.unfavAlbum(req, res);

      assert(res.status.calledWith(500));
      assert(res.json.calledWith(sinon.match(
        { error: 'No se pudo quitar el album de favoritos'}
      )));
      assert(destroyFavAlbumMock.calledWith(sinon.match(
        {where: 
            {albumId: req.body.albumId, userId: req.body.userId}
          }
      )));
      assert(destroyFavAlbumMock.calledOnce);
      revertRewire();
    });
  });

  describe('checkFavAlbum', function () {
    it('checkFavAlbum ok', async function () {
      const favAlbums = [
        {dataValues: {userId: 1, albumId: 1}},
        {dataValues: {userId: 1, albumId: 2}},
        {dataValues: {userId: 1, albumId: 3}},
     ];

      const album1 = {
          dataValues:{
              id: 1,
              title: 'album 1',
              artists: ['artist1'],
              link: 'link 1',
              subcription: 'subcription 1',
              genre: 'genre 1',
          }
      };
      const album2 = {
          dataValues:{
              id: 2,
              title: 'album 2',
              artists: ['artist2'],
              link: 'link 2',
              subcription: 'subcription 2',
              genre: 'genre 2',
          }
      };
      const album3 = {
          dataValues:{
              id: 3,
              title: 'album 3',
              artists: ['artist3'],
              link: 'link 3',
              subcription: 'subcription 3',
              genre: 'genre 3',
          }
      }

      const findOneAlbumMock = sinon.stub();
      findOneAlbumMock.onCall(0).returns(Promise.resolve(album1));
      findOneAlbumMock.onCall(1).returns(Promise.resolve(album2));
      findOneAlbumMock.onCall(2).returns(Promise.resolve(album3));
      const findAllFavAlbumsMock = sinon.fake.returns(Promise.resolve(favAlbums));
      const revertRewire = AlbumService.__set__({
          FavAlbums: {findAll: findAllFavAlbumsMock},
          Album: {findOne: findOneAlbumMock },
          utils: {
              setErrorResponse: setErrorResponse, 
              setBodyResponse: setBodyResponse,
          }
      });
      const req = {
          query: {
                  userId: 1,
                  albumId: 2,
      }};
      const res = mockResponse();

      await AlbumService.checkFavAlbum(req, res);
      assert(findAllFavAlbumsMock.calledWith(
        {where: {userId: req.query.userId}, order: [['createdAt', 'ASC']],}
      ))
      assert(res.status.calledWith(200));
      assert(findAllFavAlbumsMock.calledOnce);
      assert(findOneAlbumMock.calledThrice);
      assert(res.json.calledWith(
          {hasSong: true}
      ));
      revertRewire();
    });

    it('checkFavAlbum ok', async function () {
      const favAlbums = [
        {dataValues: {userId: 1, albumId: 1}},
        {dataValues: {userId: 1, albumId: 2}},
        {dataValues: {userId: 1, albumId: 3}},
     ];

      const album1 = {
          dataValues:{
              id: 1,
              title: 'album 1',
              artists: ['artist1'],
              link: 'link 1',
              subcription: 'subcription 1',
              genre: 'genre 1',
          }
      };
      const album2 = {
          dataValues:{
              id: 2,
              title: 'album 2',
              artists: ['artist2'],
              link: 'link 2',
              subcription: 'subcription 2',
              genre: 'genre 2',
          }
      };
      const album3 = {
          dataValues:{
              id: 3,
              title: 'album 3',
              artists: ['artist3'],
              link: 'link 3',
              subcription: 'subcription 3',
              genre: 'genre 3',
          }
      }

      const findOneAlbumMock = sinon.stub();
      findOneAlbumMock.onCall(0).returns(Promise.resolve(album1));
      findOneAlbumMock.onCall(1).returns(Promise.resolve(album2));
      findOneAlbumMock.onCall(2).returns(Promise.resolve(album3));
      const findAllFavAlbumsMock = sinon.fake.returns(Promise.resolve(favAlbums));
      const revertRewire = AlbumService.__set__({
          FavAlbums: {findAll: findAllFavAlbumsMock},
          Album: {findOne: findOneAlbumMock },
          utils: {
              setErrorResponse: setErrorResponse, 
              setBodyResponse: setBodyResponse,
          }
      });
      const req = {
          query: {
                  userId: 1,
                  albumId: 4,
      }};
      const res = mockResponse();

      await AlbumService.checkFavAlbum(req, res);
      assert(findAllFavAlbumsMock.calledWith(
        {where: {userId: req.query.userId}, order: [['createdAt', 'ASC']],}
      ))
      assert(res.status.calledWith(200));
      assert(findAllFavAlbumsMock.calledOnce);
      assert(findOneAlbumMock.calledThrice);
      assert(res.json.calledWith(
          {hasSong: false}
      ));
      revertRewire();
    });

    it('checkFavAlbum error finding favourites', async function () {
      const album1 = {
          dataValues:{
              id: 1,
              title: 'album 1',
              artists: ['artist1'],
              link: 'link 1',
              subcription: 'subcription 1',
              genre: 'genre 1',
          }
      };
      const album2 = {
          dataValues:{
              id: 2,
              title: 'album 2',
              artists: ['artist2'],
              link: 'link 2',
              subcription: 'subcription 2',
              genre: 'genre 2',
          }
      };
      const album3 = {
          dataValues:{
              id: 3,
              title: 'album 3',
              artists: ['artist3'],
              link: 'link 3',
              subcription: 'subcription 3',
              genre: 'genre 3',
          }
      }

      const findOneAlbumMock = sinon.stub();
      findOneAlbumMock.onCall(0).returns(Promise.resolve(album1));
      findOneAlbumMock.onCall(1).returns(Promise.resolve(album2));
      findOneAlbumMock.onCall(2).returns(Promise.resolve(album3));
      const findAllFavAlbumsMock = sinon.fake.returns(Promise.resolve({error: 'favartists error'}));
      const revertRewire = AlbumService.__set__({
          FavAlbums: {findAll: findAllFavAlbumsMock},
          Album: {findOne: findOneAlbumMock },
          utils: {
              setErrorResponse: setErrorResponse, 
              setBodyResponse: setBodyResponse,
          }
      });
      const req = {
          query: {
                  userId: 1,
                  albumId: 2,
      }};
      const res = mockResponse();

      await AlbumService.checkFavAlbum(req, res);
      assert(findAllFavAlbumsMock.calledWith(
        {where: {userId: req.query.userId}, order: [['createdAt', 'ASC']],}
      ))
      assert(res.status.calledWith(500));
      assert(findAllFavAlbumsMock.calledOnce);
      assert(findOneAlbumMock.notCalled);
      assert(res.json.calledWith(
          {error: 'No se pudieron obtener los albumes favoritos.'}
      ));
      revertRewire();
    });
  });

  describe('getFavoriteAlbums', function () {
    it('getFavoriteAlbums ok', async function () {
      const favAlbums = [
        {dataValues: {userId: 1, albumId: 1}},
        {dataValues: {userId: 1, albumId: 2}},
        {dataValues: {userId: 1, albumId: undefined}},
     ];

      const album1 = {
          id: 1,
          title: 'album 1',
          artists: ['artist1'],
          link: 'link 1',
          subcription: 'subcription 1',
          genre: 'genre 1',
      };
      const album2 = {
          id: 2,
          title: 'album 2',
          artists: ['artist2'],
          link: 'link 2',
          subcription: 'subcription 2',
          genre: 'genre 2',
      };
      const album3 = {
          id: undefined,
          title: 'album 3',
          artists: ['artist3'],
          link: 'link 3',
          subcription: 'subcription 3',
          genre: 'genre 3',
      }

      const findOneAlbumMock = sinon.stub();
      findOneAlbumMock.onCall(0).returns(Promise.resolve(album1));
      findOneAlbumMock.onCall(1).returns(Promise.resolve(album2));
      findOneAlbumMock.onCall(2).returns(Promise.resolve(album3));
      const findAllFavAlbumsMock = sinon.fake.returns(Promise.resolve(favAlbums));
      const revertRewire = AlbumService.__set__({
          FavAlbums: {findAll: findAllFavAlbumsMock},
          Album: {findOne: findOneAlbumMock },
          utils: {
              setErrorResponse: setErrorResponse, 
              setBodyResponse: setBodyResponse,
          }
      });
      const req = {
          query: {
                  userId: 1,
                  limit: 3,
      }};
      const res = mockResponse();

      await AlbumService.getFavoriteAlbums(req, res);
      assert(findAllFavAlbumsMock.calledWith(
        {
          where: {userId: req.query.userId}, 
          order: [['createdAt', 'ASC']],
          limit: req.query.limit,
        }
      ))
      assert(res.status.calledWith(200));
      assert(findAllFavAlbumsMock.calledOnce);
      assert(findOneAlbumMock.calledThrice);
      assert(res.json.calledWith(
          [
            {
              id: 1,
              title: 'album 1',
              artists: ['artist1'],
              link: 'link 1',
              subcription: 'subcription 1',
              genre: 'genre 1',
            },
            {
              id: 2,
              title: 'album 2',
              artists: ['artist2'],
              link: 'link 2',
              subcription: 'subcription 2',
              genre: 'genre 2',
            }
          ]
      ));
      revertRewire();
    });

    it('getFavoriteAlbums error finding favAlbums', async function () {
      const favAlbums = [
        {dataValues: {userId: 1, albumId: 1}},
        {dataValues: {userId: 1, albumId: 2}},
        {dataValues: {userId: 1, albumId: undefined}},
     ];

      const album1 = {
          id: 1,
          title: 'album 1',
          artists: ['artist1'],
          link: 'link 1',
          subcription: 'subcription 1',
          genre: 'genre 1',
      };
      const album2 = {
          id: 2,
          title: 'album 2',
          artists: ['artist2'],
          link: 'link 2',
          subcription: 'subcription 2',
          genre: 'genre 2',
      };
      const album3 = {
          id: undefined,
          title: 'album 3',
          artists: ['artist3'],
          link: 'link 3',
          subcription: 'subcription 3',
          genre: 'genre 3',
      }

      const findOneAlbumMock = sinon.stub();
      findOneAlbumMock.onCall(0).returns(Promise.resolve(album1));
      findOneAlbumMock.onCall(1).returns(Promise.resolve(album2));
      findOneAlbumMock.onCall(2).returns(Promise.resolve(album3));
      const findAllFavAlbumsMock = sinon.fake.returns(Promise.resolve({error: 'favartists error'}));
      const revertRewire = AlbumService.__set__({
          FavAlbums: {findAll: findAllFavAlbumsMock},
          Album: {findOne: findOneAlbumMock },
          utils: {
              setErrorResponse: setErrorResponse, 
              setBodyResponse: setBodyResponse,
          }
      });
      const req = {
          query: {
                  userId: 1,
                  limit: 3,
      }};
      const res = mockResponse();

      await AlbumService.getFavoriteAlbums(req, res);
      assert(findAllFavAlbumsMock.calledWith(
        {
          where: {userId: req.query.userId}, 
          order: [['createdAt', 'ASC']],
          limit: req.query.limit,
        }
      ))
      assert(res.status.calledWith(500));
      assert(findAllFavAlbumsMock.calledOnce);
      assert(findOneAlbumMock.notCalled);
      assert(res.json.calledWith(
          { error: 'No se pudieron traer los albumes.'}
      ));
      revertRewire();
    });

  });
});
