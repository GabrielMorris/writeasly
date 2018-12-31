# writeasly

## Description

writeasly ("write-easily" - I know, I know, terrible!) is a Javascript library implementing the [write.as](https://write.as/) API. It is based on [writeas.js](https://github.com/devsnek/writeas.js) by [devsnek](https://github.com/devsnek).

## Installation

```
npm install writeasly

or

yarn add writeasly
```

## Usage

### Client

#### Import the library

```
import Client from 'writeasly'; // ES6
const Client = require('writeasly').default; // CommonJS

const client = new Client();
```

#### Authenticate

```
const client = new Client();

client.authenticate(username, password).catch(error => {
  // Handle authentication errors
})
```

#### Logout

Logs a user out. Returns code 204 for success, 400 for missing auth token, and 404 for an invalid token.

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

Gets basic information on the currently authenticated user.

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

#### Creating an anonymous post

An unauthenticated client will create an anonymous, unclaimed post, whereas an authenticated client will create an anonymous, claimed post that does not belong to a collection.

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

```
client.getPost(id)
  .then(post => {
  // Do things with post
})
```

#### Update a post by ID

```
client.updatePost(postID, data, token)
  .then(post => {
  // Do stuff with updated post object
})

client.getPost(postID)
  .then(post => post.update(body, {title, font, lang, rtl}))
  .then(updatedPost => {
  // Do things with updated post
})
```

#### Delete a post by ID

Returns a 204 status code upon deletion success

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

#### Get a user's collections

Returns an array of a user's collections (blogs).

```
client.authenticate(username, password);

client.getUserCollections()
  .then(collections => {
  // Do things with collections
})
```

#### Get a user's posts

Returns an array of a user's posts

```
client.getUserPosts()
  .then(posts => {
    // Do things with posts
})
```

#### Get a collection by alias (blog title)

Returns a collection object for a given blog

```
client.getCollectionByAlias(alias)
  .then(collection => {
  // Do things with collection
})
```

#### Create a collection (blog)

This requires a pro subscription to Write.as. Returns a Collection object of the new collection.

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

Returns an array of posts from a given collection

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

Pins a post to the top of a collection. Returns the response object

```
client.getCollectionByAlias('cocoa')
  .then(collection => {
  collection.pinPostOnCollection('ywlfu4gkyfbhrti5');
  })
  .then(response => {
  // Do things with response
})
```

#### Unpin a post on a collection

Unpins a post from a collection. Returns the response object

```
client.getCollectionByAlias('cocoa')
  .then(collection => collection.unpinPostOnCollection(postID)
  )
  .then(response => {
  // Do things with response
})
```

## Features

writeasly is a work in progress and is missing some features in the API. However, most functionality is implemented. List of supported endpoints:

writeasly currently supports the vast majority of the write.as API, a complete list of supported/unsupported features:

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
