export default class Post {
  constructor(client, data) {
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

  claim(token) {
    return this.client._request('post', '/posts/claim', [
      { id: this.id, token }
    ]);
    // TODO: handle errors
  }

  update(body, { title, font, lang, rtl } = {}) {
    return this.client
      ._request('POST', `/posts/${this.id}`, { body, title, font, lang, rtl })
      .then(post => new Post(this.client, post.data));
    // TODO: handle errors
  }

  unpublish() {
    return this.client._request('POST', `/posts/${this.id}`, { body: '' });
    // TODO: handle errors
  }

  delete(token = '') {
    return this.client._request('DELETE', `/posts/${this.id}`, { token });
    // TODO: handle errors
  }
}
