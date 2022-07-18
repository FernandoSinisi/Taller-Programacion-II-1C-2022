const assert = require('assert');
const sinon = require('sinon');
const rewire = require('rewire');
const {mockResponse} = require('./utils');
const SongService = rewire('../src/services/SongService');
const {setErrorResponse, setBodyResponse, areAnyUndefined, postToGateway} = require('../src/others/utils')

describe('SongService', function () {
  describe('newSong', function () {
    it('newSong ok', async function () {
        const createSongsMock = sinon.fake.returns(Promise.resolve({message: 'song created'}))
        const revertRewire = SongService.__set__({
            Song: {create: createSongsMock},
            utils: {
                setErrorResponse: setErrorResponse, 
                setBodyResponse:setBodyResponse,
                areAnyUndefined: areAnyUndefined
            }
        });
        const req = {
            body: {
                    title: 'title',
                    description: 'description',
                    artists: ['artist1'],
                    author: 'artist1',
                    subcription: 'subcription',
                    link: 'link',
                    genre: 'genre',
                    artwork: 'artwork'}};
        const res = mockResponse();

        await SongService.newSong(req, res);

        assert(res.status.calledWith(200));
        assert(createSongsMock.calledOnce);
        assert(res.json.calledWith({message: 'song created'}));
        revertRewire();
    });

    it('newSong error title, artist or link required', async function () {
        const createSongsMock = sinon.fake.returns(Promise.resolve({message: 'song created'}))
        const revertRewire = SongService.__set__({
            Song: {create: createSongsMock},
            utils: {
                setErrorResponse: setErrorResponse, 
                setBodyResponse:setBodyResponse,
                areAnyUndefined: areAnyUndefined
            }
        });
        const req = {
            body: {
                    description: 'description',
                    artists: ['artist1'],
                    author: 'artist1',
                    subcription: 'subcription',
                    link: 'link',
                    genre: 'genre',
                    artwork: 'artwork'}};
        const res = mockResponse();

        await SongService.newSong(req, res);

        assert(res.status.calledWith(400));
        assert(createSongsMock.notCalled);
        assert(res.json.calledWith({error: 'Error: title, artists y link son obligatorios.'}));
        revertRewire();
    });

    it('newSong error title, artist or link required', async function () {
        const createSongsMock = sinon.fake.returns(Promise.resolve(undefined))
        const revertRewire = SongService.__set__({
            Song: {create: createSongsMock},
            utils: {
                setErrorResponse: setErrorResponse, 
                setBodyResponse:setBodyResponse,
                areAnyUndefined: areAnyUndefined
            }
        });
        const req = {
            body: {
                    title: 'title',
                    description: 'description',
                    artists: ['artist1'],
                    author: 'artist1',
                    subcription: 'subcription',
                    link: 'link',
                    genre: 'genre',
                    artwork: 'artwork'}};
        const res = mockResponse();

        await SongService.newSong(req, res);

        assert(res.status.calledWith(500));
        assert(createSongsMock.calledOnce);
        assert(res.json.calledWith({error: 'Error tratando de crear la cancion.'}));
        revertRewire();
    });

  });

  describe('findSongs', function () {
    it('findSongs ok', async function () {

        const where = {
            title: 'title',
            artists: ['artist1'],
            genre: 'genre',
            subcription: 'subcription',
        };
        const queryLimit = 3;

        const allSongs =  [
            {
                title: 'song1',
                author: 'artists1',
                artists: ['artists1'],
                subcription: 'subcription1',
                genre: 'genre1',
                link: 'link1',
            },
            {
                title: 'song2',
                author: 'artists2',
                artists: ['artists2'],
                subcription: 'subcription2',
                genre: 'genre2',
                link: 'link2',
            }
        ];

        const findAllSongsMock = sinon.fake.returns(Promise.resolve(allSongs))
        const revertRewire = SongService.__set__({
            Song: {findAll: findAllSongsMock},
            utils: {
                setErrorResponse: setErrorResponse, 
                setBodyResponse:setBodyResponse,
                areAnyUndefined: areAnyUndefined
            }
        });

        const res = await SongService.findSongs(queryLimit, where);

        assert(findAllSongsMock.calledOnce);
        assert.deepStrictEqual(res, allSongs);
        revertRewire();
    });

  });

  describe('getSongs', function () {
    it('getSongs ok', async function () {

        const allSongs =  [
            {
                title: 'song',
                author: 'artists1',
                artists: ['artists1'],
                subcription: 'subcription',
                genre: 'genre',
                link: 'link1',
            },
            {
                title: 'song',
                author: 'artists2',
                artists: ['artists2'],
                subcription: 'subcription',
                genre: 'genre',
                link: 'link2',
            }
        ];
        const findAllSongsMock = sinon.fake.returns(Promise.resolve(allSongs));
        const revertRewire = SongService.__set__({
            Song: {findAll: findAllSongsMock},
            utils: {
                setErrorResponse: setErrorResponse, 
                setBodyResponse:setBodyResponse,
                areAnyUndefined: areAnyUndefined
            }
        });
        const req = {
            query: {
                    title: 'song',
                    limit: 2,
                    artists: ['artists1'],
                    subcription: 'subcription',
                    genre: 'genre',
        }};
        const res = mockResponse();

        await SongService.getSongs(req, res);

        assert(res.status.calledWith(200));
        assert(findAllSongsMock.calledOnce);
        assert(res.json.calledWith(allSongs));
        revertRewire();
    });

    it('getSongs error finding songs', async function () {

        const findAllSongsMock = sinon.fake.returns(Promise.resolve(null));
        const revertRewire = SongService.__set__({
            Song: {findAll: findAllSongsMock},
            utils: {
                setErrorResponse: setErrorResponse, 
                setBodyResponse: setBodyResponse,
                areAnyUndefined: areAnyUndefined
            }
        });
        const req = {
            query: {
                    title: 'song',
                    limit: 2,
                    artists: ['artists1'],
                    subcription: 'subcription',
                    genre: 'genre',
        }};
        const res = mockResponse(500);

        await SongService.getSongs(req, res);

        assert(res.status.calledWith(500));
        assert(findAllSongsMock.calledOnce);
        assert(res.json.calledWith(
            {error: 'No se pudieron obtener las canciones'}
        ));
        revertRewire();
    });
  });

  describe('getSong', function () {
    it('getSong ok', async function () {

        const song =
            {
                id: 1,
                title: 'song',
                description: 'description',
                author: 'artists',
                artists: ['artists'],
                subcription: 'subcription',
                genre: 'genre',
                link: 'link',
                artwork: 'artwork'
            };

        const artists = [{
            id: 2,
            email: 'email@email.com',
            username: 'username',
            isArtist: true,
            isListener: false,
            isBand: false,
            photoUrl: 'url',

        }];
        const findOneSongsMock = sinon.fake.returns(Promise.resolve(song));
        const postToGatewayMock = sinon.fake.returns(Promise.resolve(artists));
        const revertRewire = SongService.__set__({
            Song: {findOne: findOneSongsMock},
            utils: {
                setErrorResponse: setErrorResponse, 
                setBodyResponse:setBodyResponse,
                areAnyUndefined: areAnyUndefined,
                postToGateway: postToGatewayMock,
            }
        });
        const req = {
            params: {
                    id: 1,
            },
            query: {
                adminRequest: false,
            },
        };
        const res = mockResponse();

        await SongService.getSong(req, res);

        assert(res.status.calledWith(200));
        assert(findOneSongsMock.calledOnce);
        assert(postToGatewayMock.calledOnce)
        assert(res.json.calledWith(
            {
                id: 1,
                title: 'song',
                description: 'description',
                author: 'artists',
                subcription: 'subcription',
                genre: 'genre',
                link: 'link',
                artwork: 'artwork',
                artists: artists,
            }
        ));
        revertRewire();
    });

    it('getSong error song not found', async function () {

        const artists = [{
            id: 2,
            email: 'email@email.com',
            username: 'username',
            isArtist: true,
            isListener: false,
            isBand: false,
            photoUrl: 'url',

        }];
        const findOneSongsMock = sinon.fake.returns(Promise.resolve(null));
        const postToGatewayMock = sinon.fake.returns(Promise.resolve(artists));
        const revertRewire = SongService.__set__({
            Song: {findOne: findOneSongsMock},
            utils: {
                setErrorResponse: setErrorResponse, 
                setBodyResponse:setBodyResponse,
                areAnyUndefined: areAnyUndefined,
                postToGateway: postToGatewayMock,
            }
        });
        const req = {
            params: {
                    id: 1,
            },
            query: {
                adminRequest: false,
            },
        };
        const res = mockResponse(500);

        await SongService.getSong(req, res);

        assert(res.status.calledWith(500));
        assert(findOneSongsMock.calledOnce);
        assert(postToGatewayMock.notCalled)
        assert(res.json.calledWith(
            {
                error: 'No se pudo obtener la cancion',
            }
        ));
        revertRewire();
    });

    it('getSong ok', async function () {

        const song =
            {
                id: 1,
                title: 'song',
                description: 'description',
                author: 'artist1',
                artists: ['artist1'],
                subcription: 'subcription',
                genre: 'genre',
                link: 'link',
                artwork: 'artwork'
            };

        
        const findOneSongsMock = sinon.fake.returns(Promise.resolve(song));
        const postToGatewayMock = sinon.fake.returns(Promise.resolve({error: 'users service error'}));
        const revertRewire = SongService.__set__({
            Song: {findOne: findOneSongsMock},
            utils: {
                setErrorResponse: setErrorResponse, 
                setBodyResponse:setBodyResponse,
                areAnyUndefined: areAnyUndefined,
                postToGateway: postToGatewayMock,
            }
        });
        const req = {
            params: {
                    id: 1,
            },
            query: {
                adminRequest: false,
            },
        };
        const res = mockResponse();

        await SongService.getSong(req, res);

        assert(res.status.calledWith(500));
        assert(findOneSongsMock.calledOnce);
        assert(postToGatewayMock.calledOnce)
        assert(res.json.calledWith(
            {
                error: 'No se pudo obtener la cancion'
            }
        ));
        revertRewire();
    });

  });

  describe('favSong', function () {
    it('favSong ok', async function () {

        const createSongsMock = sinon.fake.returns(Promise.resolve(1));
        const revertRewire = SongService.__set__({
            FavSongs: {create: createSongsMock},
            utils: {
                setErrorResponse: setErrorResponse, 
                setBodyResponse:setBodyResponse,
                areAnyUndefined: areAnyUndefined,
            }
        });
        const req = {
            body: {
                    userId: 1,
                    songId: 2,
        }};
        const res = mockResponse();

        await SongService.favSong(req, res);

        assert(res.status.calledWith(200));
        assert(createSongsMock.calledOnce);
        assert(res.json.calledWith(
            {msg: "Canción agregada a favoritos"}
        ));
        revertRewire();
    });

    it('favSong error creating favsong', async function () {

        const createSongsMock = sinon.fake.returns(Promise.resolve({error: 'favsongs error'}));
        const revertRewire = SongService.__set__({
            FavSongs: {create: createSongsMock},
            utils: {
                setErrorResponse: setErrorResponse, 
                setBodyResponse:setBodyResponse,
                areAnyUndefined: areAnyUndefined,
            }
        });
        const req = {
            body: {
                    userId: 1,
                    songId: 2,
        }};
        const res = mockResponse();

        await SongService.favSong(req, res);

        assert(res.status.calledWith(500));
        assert(createSongsMock.calledOnce);
        assert(res.json.calledWith(
            {error: "No se pudo guardar la cancion"}
        ));
        revertRewire();
    });

  });

  describe('unfavSong', function () {
    it('unfavSong ok', async function () {

        const destroySongsMock = sinon.fake.returns(Promise.resolve(1));
        const revertRewire = SongService.__set__({
            FavSongs: {destroy: destroySongsMock},
            utils: {
                setErrorResponse: setErrorResponse, 
                setBodyResponse:setBodyResponse,
            }
        });
        const req = {
            body: {
                    userId: 1,
                    songId: 2,
        }};
        const res = mockResponse();

        await SongService.unfavSong(req, res);

        assert(res.status.calledWith(200));
        assert(destroySongsMock.calledOnce);
        assert(res.json.calledWith(
            {msg: "Canción quitada a favoritos"}
        ));
        revertRewire();
    });

    it('unfavSong error destroying favsong', async function () {

        const destroySongsMock = sinon.fake.returns(Promise.resolve({error: 'favsongs error'}));
        const revertRewire = SongService.__set__({
            FavSongs: {destroy: destroySongsMock},
            utils: {
                setErrorResponse: setErrorResponse, 
                setBodyResponse:setBodyResponse,
                areAnyUndefined: areAnyUndefined,
            }
        });
        const req = {
            body: {
                    userId: 1,
                    songId: 2,
        }};
        const res = mockResponse();

        await SongService.unfavSong(req, res);

        assert(res.status.calledWith(500));
        assert(destroySongsMock.calledOnce);
        assert(res.json.calledWith(
            {error: "No se pudo quitar la canción a favoritos"}
        ));
        revertRewire();
    });

  });

  describe('getFavoriteSongs', function () {
    it('getFavoriteSongs ok', async function () {

        const favSongs = [
            {dataValues: {userId: 1, songId: 1}},
            {dataValues: {userId: 1, songId: 2}},
            {dataValues: {userId: 1, songId: undefined}},
         ];

        const song1 = {
            dataValues:{
                id: 1,
                title: 'song 1',
                description: 'description 1',
                author: 'artist1',
                artists: ['artist1'],
                link: 'link 1',
                subcription: 'subcription 1',
                genre: 'genre 1',
            }
        };
        const song2 = {
            dataValues:{
                id: 2,
                title: 'song 2',
                description: 'description 2',
                author: 'artist2',
                artists: ['artist2'],
                link: 'link 2',
                subcription: 'subcription 2',
                genre: 'genre 2',
            }
        };
        const song3 = {
            dataValues:{
                id: undefined,
                title: 'song 3',
                description: 'description 3',
                author: 'artist3',
                artists: ['artist3'],
                link: 'link 3',
                subcription: 'subcription 3',
                genre: 'genre 3',
            }
        }

        const findOneSongMock = sinon.stub();
        findOneSongMock.onCall(0).returns(Promise.resolve(song1));
        findOneSongMock.onCall(1).returns(Promise.resolve(song2));
        findOneSongMock.onCall(2).returns(Promise.resolve(song3));
        const findAllFavSongsMock = sinon.fake.returns(Promise.resolve(favSongs));
        const revertRewire = SongService.__set__({
            FavSongs: {findAll: findAllFavSongsMock},
            Song: {findOne: findOneSongMock },
            utils: {
                setErrorResponse: setErrorResponse, 
                setBodyResponse:setBodyResponse,
            }
        });
        const req = {
            query: {
                    userId: 1,
                    limit: 3,
        }};
        const res = mockResponse();

        await SongService.getFavoriteSongs(req, res);

        assert(res.status.calledWith(200));
        assert(findAllFavSongsMock.calledOnce);
        assert(findOneSongMock.calledThrice);
        assert(res.json.calledWith(
            [
                {
                    id: 1,
                    title: 'song 1',
                    description: 'description 1',
                    author: 'artist1',
                    artists: ['artist1'],
                    link: 'link 1',
                    subcription: 'subcription 1',
                    genre: 'genre 1',
                },
                {
                    id: 2,
                    title: 'song 2',
                    description: 'description 2',
                    author: 'artist2',
                    artists: ['artist2'],
                    link: 'link 2',
                    subcription: 'subcription 2',
                    genre: 'genre 2',
                },
            ]
        ));
        revertRewire();
    });

    it('getFavoriteSongs error finding favsongs', async function () {
        const song1 = {
            dataValues:{
                id: 1,
                title: 'song 1',
                description: 'description 1',
                author: 'artist1',
                artists: ['artist1'],
                link: 'link 1',
                subcription: 'subcription 1',
                genre: 'genre 1',
            }
        };
        const song2 = {
            dataValues:{
                id: 2,
                title: 'song 2',
                description: 'description 2',
                author: 'artist2',
                artists: ['artist2'],
                link: 'link 2',
                subcription: 'subcription 2',
                genre: 'genre 2',
            }
        };
        const song3 = {
            dataValues:{
                id: undefined,
                title: 'song 3',
                description: 'description 3',
                author: 'artist3',
                artists: ['artist3'],
                link: 'link 3',
                subcription: 'subcription 3',
                genre: 'genre 3',
            }
        }

        const findOneSongMock = sinon.stub();
        findOneSongMock.onCall(0).returns(Promise.resolve(song1));
        findOneSongMock.onCall(1).returns(Promise.resolve(song2));
        findOneSongMock.onCall(2).returns(Promise.resolve(song3));
        const findAllFavSongsMock = sinon.fake.returns(Promise.resolve(null));
        const revertRewire = SongService.__set__({
            FavSongs: {findAll: findAllFavSongsMock},
            Song: {findOne: findOneSongMock },
            utils: {
                setErrorResponse: setErrorResponse, 
                setBodyResponse:setBodyResponse,
            }
        });
        const req = {
            query: {
                    userId: 1,
                    limit: 3,
        }};
        const res = mockResponse();

        await SongService.getFavoriteSongs(req, res);

        assert(res.status.calledWith(500));
        assert(findAllFavSongsMock.calledOnce);
        assert(findOneSongMock.notCalled);
        assert(res.json.calledWith(
            {error: 'No se pudieron traer las canciones.'}
        ));
        revertRewire();
    });

  });

  describe('checkFavSong', function () {
    it('checkFavSong ok user has song', async function () {

        const favSongs = [
            {dataValues: {userId: 1, songId: 1}},
            {dataValues: {userId: 1, songId: 2}},
            {dataValues: {userId: 1, songId: 3}},
         ];

        const song1 = {
            dataValues:{
                id: 1,
                title: 'song 1',
                description: 'description 1',
                author: 'artist1',
                artists: ['artist1'],
                link: 'link 1',
                subcription: 'subcription 1',
                genre: 'genre 1',
            }
        };
        const song2 = {
            dataValues:{
                id: 2,
                title: 'song 2',
                description: 'description 2',
                author: 'artist2',
                artists: ['artist2'],
                link: 'link 2',
                subcription: 'subcription 2',
                genre: 'genre 2',
            }
        };
        const song3 = {
            dataValues:{
                id: 3,
                title: 'song 3',
                description: 'description 3',
                author: 'artist3',
                artists: ['artist3'],
                link: 'link 3',
                subcription: 'subcription 3',
                genre: 'genre 3',
            }
        }

        const findOneSongMock = sinon.stub();
        findOneSongMock.onCall(0).returns(Promise.resolve(song1));
        findOneSongMock.onCall(1).returns(Promise.resolve(song2));
        findOneSongMock.onCall(2).returns(Promise.resolve(song3));
        const findAllFavSongsMock = sinon.fake.returns(Promise.resolve(favSongs));
        const revertRewire = SongService.__set__({
            FavSongs: {findAll: findAllFavSongsMock},
            Song: {findOne: findOneSongMock },
            utils: {
                setErrorResponse: setErrorResponse, 
                setBodyResponse:setBodyResponse,
            }
        });
        const req = {
            query: {
                    userId: 1,
                    songId: 2,
        }};
        const res = mockResponse();

        await SongService.checkFavSong(req, res);

        assert(res.status.calledWith(200));
        assert(findAllFavSongsMock.calledOnce);
        assert(findOneSongMock.calledThrice);
        assert(res.json.calledWith(
            {hasSong: true}
        ));
        revertRewire();
    });

    it("checkFavSong ok user don't  have song", async function () {

        const favSongs = [
            {dataValues: {userId: 1, songId: 1}},
            {dataValues: {userId: 1, songId: 2}},
            {dataValues: {userId: 1, songId: 3}},
         ];

        const song1 = {
            dataValues:{
                id: 1,
                title: 'song 1',
                description: 'description 1',
                author: 'artist1',
                artists: ['artist1'],
                link: 'link 1',
                subcription: 'subcription 1',
                genre: 'genre 1',
            }
        };
        const song2 = {
            dataValues:{
                id: 2,
                title: 'song 2',
                description: 'description 2',
                author: 'artist2',
                artists: ['artist2'],
                link: 'link 2',
                subcription: 'subcription 2',
                genre: 'genre 2',
            }
        };
        const song3 = {
            dataValues:{
                id: 3,
                title: 'song 3',
                description: 'description 3',
                author: 'artist3',
                artists: ['artist3'],
                link: 'link 3',
                subcription: 'subcription 3',
                genre: 'genre 3',
            }
        }

        const findOneSongMock = sinon.stub();
        findOneSongMock.onCall(0).returns(Promise.resolve(song1));
        findOneSongMock.onCall(1).returns(Promise.resolve(song2));
        findOneSongMock.onCall(2).returns(Promise.resolve(song3));
        const findAllFavSongsMock = sinon.fake.returns(Promise.resolve(favSongs));
        const revertRewire = SongService.__set__({
            FavSongs: {findAll: findAllFavSongsMock},
            Song: {findOne: findOneSongMock },
            utils: {
                setErrorResponse: setErrorResponse, 
                setBodyResponse:setBodyResponse,
            }
        });
        const req = {
            query: {
                    userId: 1,
                    songId: 4,
        }};
        const res = mockResponse();

        await SongService.checkFavSong(req, res);

        assert(res.status.calledWith(200));
        assert(findAllFavSongsMock.calledOnce);
        assert(findOneSongMock.calledThrice);
        assert(res.json.calledWith(
            {hasSong: false}
        ));
        revertRewire();
    });

    it("checkFavSong error finding favsongs", async function () {

        const song1 = {
            dataValues:{
                id: 1,
                title: 'song 1',
                description: 'description 1',
                author: 'artist1',
                artists: ['artist1'],
                link: 'link 1',
                subcription: 'subcription 1',
                genre: 'genre 1',
            }
        };
        const song2 = {
            dataValues:{
                id: 2,
                title: 'song 2',
                description: 'description 2',
                author: 'artist2',
                artists: ['artist2'],
                link: 'link 2',
                subcription: 'subcription 2',
                genre: 'genre 2',
            }
        };
        const song3 = {
            dataValues:{
                id: 3,
                title: 'song 3',
                description: 'description 3',
                author: 'artist3',
                artists: ['artist3'],
                link: 'link 3',
                subcription: 'subcription 3',
                genre: 'genre 3',
            }
        }

        const findOneSongMock = sinon.stub();
        findOneSongMock.onCall(0).returns(Promise.resolve(song1));
        findOneSongMock.onCall(1).returns(Promise.resolve(song2));
        findOneSongMock.onCall(2).returns(Promise.resolve(song3));
        const findAllFavSongsMock = sinon.fake.returns(Promise.resolve(null));
        const revertRewire = SongService.__set__({
            FavSongs: {findAll: findAllFavSongsMock},
            Song: {findOne: findOneSongMock },
            utils: {
                setErrorResponse: setErrorResponse, 
                setBodyResponse:setBodyResponse,
            }
        });
        const req = {
            query: {
                    userId: 1,
                    songId: 4,
        }};
        const res = mockResponse();

        await SongService.checkFavSong(req, res);

        assert(res.status.calledWith(500));
        assert(findAllFavSongsMock.calledOnce);
        assert(findOneSongMock.notCalled);
        assert(res.json.calledWith(
            {error: 'No se pudieron traer las canciones.'}
        ));
        revertRewire();
    });

  });

});
