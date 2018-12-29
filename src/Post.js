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

  // TODO: Update all of these to use the .request function from Client.js. The function belongs to the client class, so we will be able to use it here which will provide the context of the endpoint and such, but we will also be in the *post* class, and therefore have access to the post's information (id, etc)
  claim(token) {
    return this.client._req('post', '/posts/claim', { id: this.id, token });
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

  // TODO: This should be updated so that we don't need to pass an empty object. Issue is that we end up going for generic no body _request without it
  delete(token = '') {
    return this.client._request('DELETE', `/posts/${this.id}`, { token });
    // TODO: handle errors
  }
}
