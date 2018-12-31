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
  /**
   * Gets all posts from a given collection and returns an array of Post objects
   */
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
  /**
   * Returns a post from a given collection by its post slug (title)
   * @param  {String} slug - String of a post's slug (URL title)
   */
  getPostBySlug(slug) {
    return this.client
      ._request('GET', `/collections/${this.alias}/posts/${slug}`)
      .then(response => new Post(this.client, response.data));
    // TODO: handle erros
  }

  /**
   * Deletes the collection and returns a 204 if successful or an error if unsuccessful
   */
  deleteCollection() {
    return this.client
      ._request('DELETE', `/collections/${this.alias}`)
      .then(response => response);
  }

  /**
   * Creates a new post in a given collection.
   * @param  {String} dataObject - Object containing the properties of a post (body - required, title, font, lang, rtl - optional)
   */
  createNewCollectionPost(dataObject) {
    return this.client
      ._request('POST', `/collections/${this.alias}/posts`, dataObject)
      .then(response => new Post(this.client, response.data));
    // TODO: handle errors
  }
  /**
   * Pins a post to the top of a collection, equivalent to stickying a post.
   * @param  {String} postID - ID of the post to be pinned to a collection
   * @param  {Integer} position - Numeric position of a given post in the pin hierarchy. Defaults to end of the list.
   */
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
  /**
   * Unpins a given post from its collection, restoring it to its normal location within the chronological flow of your posts.
   * @param  {String} postID - ID of the post that will be unpinned
   */
  unpinPostOnCollection(postID) {
    return this.client
      ._request('POST', `/collections/${this.alias}/pin`, [{ postID }])
      .then(response => response);
    // TODO: handle errors
  }
}
