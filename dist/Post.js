'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Post = function () {
  function Post(client, data) {
    _classCallCheck(this, Post);

    this.client = client;
    this.id = data.id;
    this.slug = data.slug;
    this.appearance = data.appearance;
    this.language = data.language;
    this.rtl = data.rtl;
    this.createdAt = new Date(data.created);
    this.title = data.title;
    this.body = data.body;
    this.tags = data.tags;
    this.views = data.views;
    this.token = data.token || null;
  }

  /**
   * Takes an anonymous post and adds it to a user's account. This requires knowledge of a post's update token, which is different from the user's account access token.
   * @param {String} token - Update token of post that is being claimed
   * @returns Promise - Promise of request to claim post. Always status code 200 in response
   */


  _createClass(Post, [{
    key: 'claim',
    value: function claim(token) {
      return this.client._request('post', '/posts/claim', [{ id: this.id, token: token }]);
    }

    /**
     * Updates a post with the provided arguments. Optional arguments (title, font, lang, rtl) are provided through an object, while the body argument is a string.
     * @param  {String} body - String of post's body text.
     * @param {String} title - String of post's title.
     * @param {String} font - String of post's font (sans, serif, wrap (monospace), mono, code)
     * @param {String} lang - ISO 639-1 language code
     * @param {Boolean} rtl - Determines whether text is rendered left-to-right or right-to-left
     */

  }, {
    key: 'update',
    value: function update(body) {
      var _this = this;

      var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          title = _ref.title,
          font = _ref.font,
          lang = _ref.lang,
          rtl = _ref.rtl;

      return this.client._request('POST', '/posts/' + this.id, { body: body, title: title, font: font, lang: lang, rtl: rtl }).then(function (post) {
        return new Post(_this.client, post.data);
      });
      // TODO: handle errors
    }

    /**
     * Unpublishes a post by setting its body text to an empty string. This is not reversible.
     */

  }, {
    key: 'unpublish',
    value: function unpublish() {
      return this.client._request('POST', '/posts/' + this.id, { body: '' });
      // TODO: handle errors
    }

    /**
     * Deletes a post from a user's account or, if a token is provided, an anonymous post.
     * @param  {String} token - Optional update token of a post (for anonymous posts)
     */

  }, {
    key: 'delete',
    value: function _delete() {
      var token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      return this.client._request('DELETE', '/posts/' + this.id, { token: token });
      // TODO: handle errors
    }

    /**
     * Adds the post to the collection of which's alias is passed as an argument to the function. Returns status code 200 with an array 'data' with the Post object, or an error_msg. Requires authentication.
     * @param {String} alias - Alias (title) of the collection to add the post to
     */

  }, {
    key: 'addToCollection',
    value: function addToCollection(alias) {
      return this.client._request('POST', '/collections/' + alias + '/collect', [{
        id: this.id
      }]);
    }
  }]);

  return Post;
}();

exports.default = Post;