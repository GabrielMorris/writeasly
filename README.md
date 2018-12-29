# writeas.js

## Description

writeas.js is a Javascript library implementing the [write.as](https://write.as/) API.

## Installation

### npm

```
npm install writeas
```

### yarn

```
yarn add writeas
```

## Usage

### Client

#### Import the library

```
import Client from 'writeas';

const client = new Client();
```

#### Authenticate

```
import Client from 'writeas';

const client = new Client();

client.authenticate(<username>, <password>).catch(error => {
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

const client = new Client();

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

const client = new Client();

client.getPost(id)
.then(post => {
// Do things with post
})

```

#### Update a post by ID

```

const client = new Client();

client.updatePost(postID, data, token)
.then(post => {
// Do stuff with updated post object
})

client.getPost(postID)
.then(post => post.update(body, <{title, font, lang, rtl}>))
.then(updatedPost => {
// Do things with updated post
})

```

#### Delete a post by ID

Returns a 204 status code upon deletion success

```

const client = new Client();

client.getPost(postID)
.then(post => post.delete())
.then(response => console.log(response))

```

#### Claim a post by ID

WIP

#### Unpublish a post by ID

Returns status code 410 with an error_msg detailing successful unpublish.

```

const client = new Client();

client.getPost(postID)
.then(post => post.unpublish())
.then(response => console.log(response))

```

#### Get a user's collections

Returns an array of a user's collections (blogs).

```

const client = new Client();

client.authenticate(username, password);

client.getUserCollections()
.then(collections => {
// Do things with collections
})

```

#### Get a collection by alias (blog title)

Returns a collection object for a given blog

```

const client = new Client();

client.getCollectionByAlias(alias)
.then(collection => {
// Do things with collection
})

```

#### Get a collection's posts

Returns an array of posts from a given collection

```

const client = new Client();

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

```

```
