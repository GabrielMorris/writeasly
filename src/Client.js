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

  /**
   *
   * @param {String} username - Username of the user to be logged in
   * @param {String} password - Password of the user to be logged in
   * @param {String} type - Type of request to be made. Currently only supports HTTPS authentication
   */
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

  /**
   * Logs the currently authenticated user out, if client is authenticated, and invalidates their current authentication token.
   */
  logout() {
    return this._request('DELETE', '/auth/me').then(response => {
      if (response.code !== 204) {
        throw response;
      }

      return response;
    });
    // TODO: handle errors
  }

  /**
   * Returns the currently authenticated user, if the client is authenticated and the token is valid, or throws an authentication error.
   */
  getCurrentAuthenticatedUser() {
    return this._request('GET', '/me').then(response => response);
  }

  // TODO: make this less awful
  /**
   *
   * @param {String} method - HTTP method of the request to be made (GET, POST, DELETE are supported)
   * @param {String} path - API endpoint location. '/api/' is implicit and should not be included
   * @param {Object} data - Object of data to be passed in as the JSON body of the request
   */
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
        if (response.status === 204) {
          return { code: 204, body: '' };
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

        console.log(response);

        if (response.status === 204) {
          return { code: 204, body: '' };
        }

        return await response.json();
      } catch (error) {
        return console.log(error);
      }
    }
  }

  /* === POST MANAGEMENT === */
  /**
   * Creates an anonymous post that is either truly anonymous (not tied to a user's account) or pseudoanonymous (tied to a user's account, but not connected to any collection)
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
   * Returns the post that corresponds to the postID that is passed to it.
   * @param  {string} postID - ID of post to retreieve
   *
   * @returns {Promise} promise that resolves to post JSON
   */
  getPost(postID) {
    return this._request('GET', `/posts/${postID}`)
      .then(post => new Post(this, post.data))
      .catch(error => console.error(error));
  }

  /* === USER MANAGEMENT === */
  /* ===== COLLECTIONS ===== */
  /**
   * Returns an array of all of the the currently authenticated user's collections. Requires client to be authenticated.
   */
  getUserCollections() {
    return this._request('GET', `/me/collections`).then(collections =>
      collections.data.map(collection => new Collection(this, collection))
    );
    // TODO: handle errors
  }

  /**
   * Returns a collection (blog) object based on its name (title).
   */
  getCollectionByAlias(alias) {
    return this._request('GET', `/collections/${alias}`).then(collection => {
      return new Collection(this, collection.data);
    });
    // TODO: handle errors
  }

  createCollection(title, alias) {
    return this._request('POST', '/collections', { title, alias }).then(
      response => {
        if (response.error_msg) {
          throw response;
        }

        return new Collection(this, response.data);
      }
    );
  }

  /* ===== POSTS ===== */
  /**
   * Gets all of the currently authenticated user's posts and returns an array of Post objects. Requires client to be authenticated.
   */
  getUserPosts() {
    return this._request('GET', '/me/posts').then(response => {
      return response.data.map(post => new Post(this, post));
    });
  }
}
