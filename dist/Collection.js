'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Post = require('./Post');

var _Post2 = _interopRequireDefault(_Post);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Collection = function () {
  function Collection(client, data) {
    _classCallCheck(this, Collection);

    this.client = client;
    this.alias = data.alias || null;
    this.title = data.title;
    this.description = data.description;
    this.stylesheet = data.style_sheet;
    this.public = data.public;
    this.views = data.views;
    this.email = data.email || null;
    this.totalPosts = data.total_posts || null;
  }
  /**
   * Gets all posts from a given collection and returns an array of Post objects
   */


  _createClass(Collection, [{
    key: 'getPosts',
    value: function getPosts() {
      var _this = this;

      return this.client._request('GET', '/collections/' + this.alias + '/posts').then(function (response) {
        return response.data.posts.map(function (post) {
          return new _Post2.default(_this.client, post);
        });
      })
      // TODO: do something with this error
      .catch(function (error) {
        return console.error(error);
      });
    }
    /**
     * Returns a post from a given collection by its post slug (title)
     * @param  {String} slug - String of a post's slug (URL title)
     */

  }, {
    key: 'getPostBySlug',
    value: function getPostBySlug(slug) {
      var _this2 = this;

      return this.client._request('GET', '/collections/' + this.alias + '/posts/' + slug).then(function (response) {
        return new _Post2.default(_this2.client, response.data);
      });
      // TODO: handle erros
    }

    /**
     * Deletes the collection and returns a 204 if successful or an error if unsuccessful
     */

  }, {
    key: 'deleteCollection',
    value: function deleteCollection() {
      return this.client._request('DELETE', '/collections/' + this.alias).then(function (response) {
        return response;
      });
    }

    /**
     * Creates a new post in a given collection.
     * @param  {String} dataObject - Object containing the properties of a post (body - required, title, font, lang, rtl - optional)
     */

  }, {
    key: 'createNewCollectionPost',
    value: function createNewCollectionPost(dataObject) {
      var _this3 = this;

      return this.client._request('POST', '/collections/' + this.alias + '/posts', dataObject).then(function (response) {
        return new _Post2.default(_this3.client, response.data);
      });
      // TODO: handle errors
    }
    /**
     * Pins a post to the top of a collection, equivalent to stickying a post.
     * @param  {String} postID - ID of the post to be pinned to a collection
     * @param  {Integer} position - Numeric position of a given post in the pin hierarchy. Defaults to end of the list.
     */

  }, {
    key: 'pinPostOnCollection',
    value: function pinPostOnCollection(postID, position) {
      return this.client._request('POST', '/collections/' + this.alias + '/pin', [{
        postID: postID,
        position: position
      }]).then(function (response) {
        return response;
      });
      // TODO: handle errors
    }
    /**
     * Unpins a given post from its collection, restoring it to its normal location within the chronological flow of your posts.
     * @param  {String} postID - ID of the post that will be unpinned
     */

  }, {
    key: 'unpinPostOnCollection',
    value: function unpinPostOnCollection(postID) {
      return this.client._request('POST', '/collections/' + this.alias + '/pin', [{ postID: postID }]).then(function (response) {
        return response;
      });
      // TODO: handle errors
    }
  }]);

  return Collection;
}();

exports.default = Collection;