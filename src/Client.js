// Modules
import fetch from 'node-fetch';
import Post from './Post';

// Config
import { endpoints } from './endpoints';
import Collection from './Collection';

import regeneratorRuntime from 'regenerator-runtime';

export default class Client {
  // When we do new Client() we can pass in a token or a type to have that client be able to perform actions on behalf of a user
  constructor(accessToken, type = 'https') {
    if (!endpoints[type]) {
      throw new Error('Invalid endpoint type');
    }

    this.endpoint = endpoints[type];
    this.accessToken = accessToken;
  }

  async authenticate(username, password, type) {
    const response = await this._request('POST', '/auth/login', {
      alias: username,
      pass: password
    });

    if (response.error_msg) {
      throw response;
    }

    this.accessToken = response.data.access_token;
  }

  logout() {
    return this._request('DELETE', '/auth/me').then(response => {
      if (response.code !== 204) {
        throw response;
      }

      return response;
    });
    // TODO: handle errors
  }

  getCurrentAuthenticatedUser() {
    return this._request('GET', '/me').then(response => {
      if (response.code !== 204) {
        throw response;
      }

      return response;
    });
  }

  // TODO: make this less awful
  async _request(method, path, data) {
    console.log(`${this.endpoint}${path}`, method);

    if (data && this.accessToken) {
      console.log('data and token');
      console.log('=======');
      console.log(method, path, data, this.accessToken);
      console.log('=======');

      try {
        const response = await fetch(`${this.endpoint}${path}`, {
          method,
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${this.accessToken}`
          }
        });

        // If we've got a delete request we're going to return early, as we don't get a response
        if (method === 'DELETE') {
          // TODO: figure out what to do here
          return { code: 204, message: '' };
        }

        return response.json();
      } catch (error) {
        return console.log(error);
      }
    } else if (data) {
      console.log('just data');

      const headers = {
        'Content-Type': 'application/json'
      };

      if (this.accessToken) {
        headers.Authorization = `Token ${this.accessToken}`;
      }

      try {
        const response = await fetch(`${this.endpoint}${path}`, {
          method,
          body: JSON.stringify(data),
          headers
        });
        return await response.json();
      } catch (error) {
        return console.log(error);
      }
    } else {
      console.log('no body');

      const headers = {
        'Content-Type': 'application/json'
      };

      if (this.accessToken) {
        console.log('NO BODY AUTH TOKEN ADDED');
        headers.Authorization = this.accessToken;
      }

      try {
        const response = await fetch(`${this.endpoint}${path}`, {
          method,
          headers
        });

        return await response.json();
      } catch (error) {
        return console.log(error);
      }
    }
  }

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
  createPost(
    body,
    { title, font, lang, rtl, created, crosspost } = {},
    token = ''
  ) {
    return this._request(
      'POST',
      '/posts',
      {
        body,
        title,
        font,
        lang,
        rtl,
        created,
        crosspost
      },
      token
    )
      .then(post => new Post(this, post.data))
      .catch(error => console.error(error));
  }

  /**
   * @param  {string} postID - ID of post to retreieve
   *
   * @returns {Promise} promise that resolves to post JSON
   */
  getPost(postID) {
    return this._request('GET', `/posts/${postID}`)
      .then(post => new Post(this, post.data))
      .catch(error => console.error(error));
  }

  /**
   * @param  {string} postID - ID of post to be updated
   * @param  {string} token - User authorization token of post to be updated
   */
  deletePost(postID, token) {
    if (!token) {
      throw new Error('Missing token');
    }

    return this._request('DELETE', `/posts/${postID}`, {}, token);
    // TODO: handle errors
  }

  /* === USER MANAGEMENT === */
  /* ===== COLLECTIONS ===== */
  getUserCollections() {
    return this._request('GET', `/me/collections`).then(collections =>
      collections.data.map(collection => new Collection(this, collection))
    );
    // TODO: handle errors
  }

  getCollectionByAlias(alias) {
    return this._request('GET', `/collections/${alias}`).then(collection => {
      new Collection(this, collection.data);
    });
    // TODO: handle errors
  }

  /* ===== POSTS ===== */
  getUserPosts() {
    return this._request('GET', '/me/posts').then(response => {
      return response.data.map(post => new Post(this, post));
    });
  }
}
