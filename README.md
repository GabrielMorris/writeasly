# writeasly

## Description

writeasly ("write-easily" - I know, I know, terrible!) is a Javascript library implementing the [write.as](https://write.as/) API. It is based on [writeas.js](https://github.com/devsnek/writeas.js) by [devsnek](https://github.com/devsnek).

## Installation

```
npm install writeasly
```

## Usage

### Client

#### Import the library

```
import Client from 'writeasly'; // ES6
const Client = require('writeasly').default; // CommonJS

const client = new Client();
```

### Authentication

#### Authenticate

Logs a user in and adds the user's access token to the client.

```
const client = new Client();

client.authenticate(username, password).catch(error => {
  // Handle authentication errors
})
```

#### Logout

Logs a user out and invalidates their current access token. Returns code 204 for success, 400 for missing auth token, and 404 for an invalid token.

```
client.authenticate(username, password)
  .then(() => client.logout())
  .then(response => {
    // Do things with response
  })
  .catch(error => {
    // Handle errors
  })
```

#### Get current authenticated user

Gets basic information on the currently authenticated user and returns an object of the current user's information.

```
client
  .authenticate(username, password)
  .then(() => {
    return client.getCurrentAuthenticatedUser();
  })
  .then(response => {
    // Do things with response
  })
  .catch(error => {
    // Handle errors
  });
```

### Posts

#### Create an anonymous post

An unauthenticated client will create an anonymous, unclaimed post that returns a Post object with the _post token_, which must be stored in order to claim or modify the post later, whereas an authenticated client will create an anonymous, claimed post that does not belong to any collection, but may be added to one with the `Post.addToCollection(alias)` method.

```
client.createPost(
  body,
  <{title, font, lang, rtl, crosspost}>
)
  .then(post => {
  // Do things with post
})
```

#### Get a post by ID

Fetches a post by its unique ID (as opposed to its slug) and returns a Post object of the post.

```
client.getPost(id)
  .then(post => {
  // Do things with post
})
```

#### Get a user's posts

Fetches and returns an array of a user's posts as Post objects.

```
client.getUserPosts()
  .then(posts => {
    // Do things with posts
})
```

#### Update a post by ID

Updates a given by its unique ID, with the body argument being required and the others being optional. This returns the updated Post object as it stands after the update.

```
client.getPost(postID)
  .then(post => post.update(body, {title, font, lang, rtl}))
  .then(updatedPost => {
  // Do things with updated post
})
```

#### Delete a post by ID

Sends a DELETE request for a post by its unique ID, returning either an object with a 204 status code or the error object if unsuccessful.

```
client.getPost(postID)
  .then(post => post.delete())
  .then(response => console.log(response))
```

#### Claim a post by ID

Claims an anonymous post. Note that the token is the post's update token that is returned upon publishing an anonymous post, and not the user's access token.

```
client.getPost(postID)
  .then(post => post.claim(token))
  .then(response => {
    // Do things with response
})
```

#### Add a post to a collection

Adds a previously created, claimed post to the collection that is provided via the alias argument. Returns an array with the status code and, if successful, the Post object of the post.

```
client.createPost('Hello there')
  .then(post => post.addToCollection(alias))
  .then(response => {
    // Do things with response
  })
  .catch(error => {
    // Do things with error
  })
```

#### Unpublish a post by ID

Returns status code 410 with an error_msg detailing successful unpublish.

```
client.getPost(postID)
  .then(post => post.unpublish())
  .then(response => console.log(response))

```

### Collections

#### Get a user's collections

Fetches and returns an array of a user's collections (blogs) as Collection objects.

```
client.authenticate(username, password);

client.getUserCollections()
  .then(collections => {
  // Do things with collections
})
```

#### Get a collection by alias (blog title)

Returns a collection object for a given blog.

```
client.getCollectionByAlias(alias)
  .then(collection => {
  // Do things with collection
})
```

#### Create a collection (blog)

**This requires a pro subscription to Write.as**. Returns a Collection object of the new collection if successful or throws an error object detailing the error.

```
client.createCollection(title, <alias>)
  .then(collection => {
    // Do things with collection
  })
  .catch(error => {
    // Do things with error
  })
```

#### Delete a collection (blog)

Deletes the collection object that the method is called on and returns either a success object with a 204 HTTP status and an empty body or an error and relevant error message.

```
client.getCollectionByAlias('my-blog')
  .then(collection => collection.deleteCollection())
  .then(response => {
    // Do things with response
  })
  .catch(error => {
    // Do things with error
  })
```

#### Get a collection's posts

Returns an array of Post objects of the posts from a given collection.

```
client.getCollectionByAlias(alias)
  .then(collection => collection.getPosts())
  .then(posts => {
  // Do things with posts
})
```

#### Get a collection's post by its slug (title)

Returns a post object for a post by its slug.

```
client.getCollectionByAlias(alias)
  .then(collection => collection.getPostBySlug(slug))
  .then(post => {
  // Do things with post
})
```

#### Create a new collection post

As opposed to client.createPost() this will create a post on a given collection (blog). Returns the post object.

```
client.getCollectionByAlias(alias)
  .then(collection => collection.createNewCollectionPost({
  title: 'Hello',
  body: 'I am a writer'
  }))
  .then(post => {
  // Do things with post
})
```

#### Pin a post to a collection

Pins a post to the top of a collection. If no position is provided the pinned post will be pinned to the end of the list of stickied posts, otherwise it will be pinned in the position that is provided as an argument. Returns the response object.

```
client.getCollectionByAlias('cocoa')
  .then(collection => {
  collection.pinPostOnCollection(postID, position);
  })
  .then(response => {
  // Do things with response
})
```

#### Unpin a post on a collection

Unpins a post from a collection. Returns the response object.

```
client.getCollectionByAlias('cocoa')
  .then(collection => collection.unpinPostOnCollection(postID)
  )
  .then(response => {
  // Do things with response
})
```

## Features

writeasly currently supports the vast majority of the write.as API, a complete list of currently supported/unsupported features:

### Posts

✅ Publish an anonymous post

✅ Retrieve a post

❌ Update an anonymous post

✅ Update a claimed post

✅ Unpublish a claimed post

✅ Delete an anonymous post

✅ Delete a claimed post

✅ Claim an anonymous post

### Collections (blogs)

✅ Create a collection

✅ Retrieve a collection

✅ Delete a collection

✅ Retrieve a collection post

✅ Publish a collection post

✅ Retrieve all collection posts

✅ Move a post to a collection

✅ Pin a post to a collection

✅ Unpin a post from a collection

### Users

✅ Authenticate a user

✅ Log a user out

✅ Retrieve authenticated user

✅ Get a user's posts

✅ Get a user's collections

### Integrations (crossposting)

✅ Crossposting
