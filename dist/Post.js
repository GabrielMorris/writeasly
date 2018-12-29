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

  _createClass(Post, [{
    key: 'claim',
    value: function claim(token) {
      return this.client._request('post', '/posts/claim', [{ id: this.id, token: token }]);
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
  }, {
    key: 'delete',
    value: function _delete() {
      var token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      return this.client._request('DELETE', '/posts/' + this.id, { token: token });
      // TODO: handle errors
    }
  }]);

  return Post;
}();

exports.default = Post;