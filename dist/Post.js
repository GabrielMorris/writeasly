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

  // TODO: Update all of these to use the .request function from Client.js. The function belongs to the client class, so we will be able to use it here which will provide the context of the endpoint and such, but we will also be in the *post* class, and therefore have access to the post's information (id, etc)


  _createClass(Post, [{
    key: 'claim',
    value: function claim(token) {
      return this.client._req('post', '/posts/claim', { id: this.id, token: token });
      // TODO: handle errors
    }
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
  }, {
    key: 'unpublish',
    value: function unpublish() {
      return this.client._request('POST', '/posts/' + this.id, { body: '' });
      // TODO: handle errors
    }

    // TODO: This should be updated so that we don't need to pass an empty object. Issue is that we end up going for generic no body _request without it

  }, {
    key: 'delete',
    value: function _delete() {
      return this.client._request('DELETE', '/posts/' + this.id, {});
      // TODO: handle errors
    }
  }]);

  return Post;
}();

exports.default = Post;