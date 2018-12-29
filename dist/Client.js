'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // Modules


// Config


var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _Post = require('./Post');

var _Post2 = _interopRequireDefault(_Post);

var _endpoints = require('./endpoints');

var _Collection = require('./Collection');

var _Collection2 = _interopRequireDefault(_Collection);

var _regeneratorRuntime = require('regenerator-runtime');

var _regeneratorRuntime2 = _interopRequireDefault(_regeneratorRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Client = function () {
  // When we do new Client() we can pass in a token or a type to have that client be able to perform actions on behalf of a user
  function Client(accessToken) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'https';

    _classCallCheck(this, Client);

    if (!_endpoints.endpoints[type]) {
      throw new Error('Invalid endpoint type');
    }

    this.endpoint = _endpoints.endpoints[type];
    this.accessToken = accessToken;
  }

  _createClass(Client, [{
    key: 'authenticate',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime2.default.mark(function _callee(username, password, type) {
        var response;
        return _regeneratorRuntime2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this._request('POST', '/auth/login', {
                  alias: username,
                  pass: password
                });

              case 2:
                response = _context.sent;

                if (!response.error_msg) {
                  _context.next = 5;
                  break;
                }

                throw response;

              case 5:

                this.accessToken = response.data.access_token;

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function authenticate(_x2, _x3, _x4) {
        return _ref.apply(this, arguments);
      }

      return authenticate;
    }()
  }, {
    key: 'logout',
    value: function logout() {
      return this._request('DELETE', '/auth/me').then(function (response) {
        if (response.code !== 204) {
          throw response;
        }

        return response;
      });
      // TODO: handle errors
    }
  }, {
    key: 'getCurrentAuthenticatedUser',
    value: function getCurrentAuthenticatedUser() {
      return this._request('GET', '/me').then(function (response) {
        if (response.code !== 204) {
          throw response;
        }

        return response;
      });
    }

    // TODO: make this less awful

  }, {
    key: '_request',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime2.default.mark(function _callee2(method, path, data) {
        var response, headers, _response, _headers, _response2;

        return _regeneratorRuntime2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                console.log('' + this.endpoint + path, method);

                if (!(data && this.accessToken)) {
                  _context2.next = 20;
                  break;
                }

                console.log('data and token');
                console.log('=======');
                console.log(method, path, data, this.accessToken);
                console.log('=======');

                _context2.prev = 6;
                _context2.next = 9;
                return (0, _nodeFetch2.default)('' + this.endpoint + path, {
                  method: method,
                  body: JSON.stringify(data),
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Token ' + this.accessToken
                  }
                });

              case 9:
                response = _context2.sent;

                if (!(method === 'DELETE')) {
                  _context2.next = 12;
                  break;
                }

                return _context2.abrupt('return', { code: 204, message: '' });

              case 12:
                return _context2.abrupt('return', response.json());

              case 15:
                _context2.prev = 15;
                _context2.t0 = _context2['catch'](6);
                return _context2.abrupt('return', console.log(_context2.t0));

              case 18:
                _context2.next = 54;
                break;

              case 20:
                if (!data) {
                  _context2.next = 38;
                  break;
                }

                console.log('just data');

                headers = {
                  'Content-Type': 'application/json'
                };


                if (this.accessToken) {
                  headers.Authorization = 'Token ' + this.accessToken;
                }

                _context2.prev = 24;
                _context2.next = 27;
                return (0, _nodeFetch2.default)('' + this.endpoint + path, {
                  method: method,
                  body: JSON.stringify(data),
                  headers: headers
                });

              case 27:
                _response = _context2.sent;
                _context2.next = 30;
                return _response.json();

              case 30:
                return _context2.abrupt('return', _context2.sent);

              case 33:
                _context2.prev = 33;
                _context2.t1 = _context2['catch'](24);
                return _context2.abrupt('return', console.log(_context2.t1));

              case 36:
                _context2.next = 54;
                break;

              case 38:
                console.log('no body');

                _headers = {
                  'Content-Type': 'application/json'
                };


                if (this.accessToken) {
                  console.log('NO BODY AUTH TOKEN ADDED');
                  _headers.Authorization = this.accessToken;
                }

                _context2.prev = 41;
                _context2.next = 44;
                return (0, _nodeFetch2.default)('' + this.endpoint + path, {
                  method: method,
                  headers: _headers
                });

              case 44:
                _response2 = _context2.sent;


                console.log(_response2);
                _context2.next = 48;
                return _response2.json();

              case 48:
                return _context2.abrupt('return', _context2.sent);

              case 51:
                _context2.prev = 51;
                _context2.t2 = _context2['catch'](41);
                return _context2.abrupt('return', console.log(_context2.t2));

              case 54:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[6, 15], [24, 33], [41, 51]]);
      }));

      function _request(_x5, _x6, _x7) {
        return _ref2.apply(this, arguments);
      }

      return _request;
    }()

    /* === POST MANAGEMENT === */
    /**
     * @param  {object} body - Object of post body
     * @param  {string} title - String representation of post title
     * @param  {string} font - Post's font
     * @param  {string} lang - Language the post will be in
     * @param  {boolean} rtl - Boolean representing whether post language is left to right or right to left
     * @param  {date} created - Date the post was created on
     * @param  {array} crosspost - Array of integrations and usernames to use for crossposting
     * @param  {string} token - Optional token user authentication token
     */

  }, {
    key: 'createPost',
    value: function createPost(body) {
      var _this = this;

      var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          title = _ref3.title,
          font = _ref3.font,
          lang = _ref3.lang,
          rtl = _ref3.rtl,
          created = _ref3.created,
          crosspost = _ref3.crosspost;

      var token = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

      return this._request('POST', '/posts', {
        body: body,
        title: title,
        font: font,
        lang: lang,
        rtl: rtl,
        created: created,
        crosspost: crosspost
      }, token).then(function (post) {
        return new _Post2.default(_this, post.data);
      }).catch(function (error) {
        return console.error(error);
      });
    }

    /**
     * @param  {string} postID - ID of post to retreieve
     *
     * @returns {Promise} promise that resolves to post JSON
     */

  }, {
    key: 'getPost',
    value: function getPost(postID) {
      var _this2 = this;

      return this._request('GET', '/posts/' + postID).then(function (post) {
        return new _Post2.default(_this2, post.data);
      }).catch(function (error) {
        return console.error(error);
      });
    }

    /* === USER MANAGEMENT === */
    /* ===== COLLECTIONS ===== */

  }, {
    key: 'getUserCollections',
    value: function getUserCollections() {
      var _this3 = this;

      return this._request('GET', '/me/collections').then(function (collections) {
        return collections.data.map(function (collection) {
          return new _Collection2.default(_this3, collection);
        });
      });
      // TODO: handle errors
    }
  }, {
    key: 'getCollectionByAlias',
    value: function getCollectionByAlias(alias) {
      var _this4 = this;

      return this._request('GET', '/collections/' + alias).then(function (collection) {
        return new _Collection2.default(_this4, collection.data);
      });
      // TODO: handle errors
    }

    /* ===== POSTS ===== */

  }, {
    key: 'getUserPosts',
    value: function getUserPosts() {
      var _this5 = this;

      return this._request('GET', '/me/posts').then(function (response) {
        return response.data.map(function (post) {
          return new _Post2.default(_this5, post);
        });
      });
    }

    /* ===== CHANNELS/INTEGRATIONS ===== */
    // API endpoint seems to be busted
    // getUserChannels() {
    //   return this._request('GET', '/me/channels').then(response => {
    //     console.log(response);
    //   });
    // }

  }]);

  return Client;
}();

exports.default = Client;