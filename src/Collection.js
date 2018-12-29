import Post from './Post';

export default class Collection {
  constructor(client, data) {
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

  getPosts() {
    return (
      this.client
        ._request('GET', `/collections/${this.alias}/posts`)
        .then(response =>
          response.data.posts.map(post => new Post(this.client, post))
        )
        // TODO: do something with this error
        .catch(error => console.error(error))
    );
  }

  getPostBySlug(slug) {
    return this.client
      ._request('GET', `/collections/${this.alias}/posts/${slug}`)
      .then(response => new Post(this.client, response.data));
    // TODO: handle erros
  }

  // TODO: Write this. Use a dummy account, dummy ;)
  deleteCollection() {}

  createNewCollectionPost(dataObject) {
    return this.client
      ._request('POST', `/collections/${this.alias}/posts`, dataObject)
      .then(response => new Post(this.client, response.data));
    // TODO: handle errors
  }

  pinPostOnCollection(postID, position) {
    return this.client
      ._request('POST', `/collections/${this.alias}/pin`, [
        {
          postID,
          position
        }
      ])
      .then(response => response);
    // TODO: handle errors
  }

  unpinPostOnCollection(postID) {
    return this.client
      ._request('POST', `/collections/${this.alias}/pin`, [{ postID }])
      .then(response => response);
    // TODO: handle errors
  }
}
