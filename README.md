# Saltiest Hacker Backend

This repository provides an API for use by Saltiest Hacker.

The server runs in a Node.js environment and is built using the Express.js framework.

It connects to a Postgres database hosted on Heroku.

## Getting Started (Online)

The base URL is:

```
 https://only-salty-hackers.herokuapp.com/
```

## Getting Started (Local)

- run `npm i && npm i -D` in order to install all dependencies
- create two databases on your local device 'saltiest' and 'saltiest-test'
- `createdb saltiest && createdb saltiest-test`
- create database tables with `[npx] knex migrate:latest --env=development && [npx] knex migrate:latest --env=test`
- seed database with `[npx] knex seed:run --env=development && [npx] knex seed:run --env=test`
- use the command `npm run dev` to run the server locally using the 'development' environment settings
- use the command `npm run test` to run the test files using the 'test' environment settings

## Endpoints

Quick Links: [ Error overview](#error-overview) | [Onboarding Overview](#onboarding-overview) | [Users Overview](#users-overview) | [Favorites Overview](#favorites-overview)

### Onboarding Overview

| Method | Endpoint         | Requires                                                              | Description                                                                                         |
| ------ | ---------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| POST   | `/api/register/` | `email address`- req.body, `username`- req.body, `password`- req.body | Used for adding a new user to the database. Returns an object containing user data and a JWT token. |
| POST   | `/api/login/`    | `username` - req.body, `password`- req.body                           | Used to log a user in. Returns an object containing user data and a JWT token.                      |

---

### Error Overview

#### Using Axios

When making requests to this API with Axios error messages can found on `error.response.data.errors`.

Example POST request:

```
axios
      .post("https://only-salty-hackers.herokuapp.com/api/login", {
         username,
        password
      })
      .then(res => console.log(res.data))
      .catch(err => {
        console.log(err.response.data.errors)
        });
```

#### Using Fetch

When making requests with the Fetch API error messages can be found on `response.errors`.

```
fetch("https://only-salty-hackers.herokuapp.com/api/login",{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password})
        }).then(res => res.json())
        .then( data => {
          if(data.errors){
            console.log(data.errors)
            }
          console.log(data)
          })
        .catch(err => console.log('Network Error',err))
```

---

### User Registration

Method used: **[POST]** `/api/register`

On Success: Returns an object containing user data and a JWT token.

Parameters:

| Parameter Name | Location | Type   | Required | Restrictions                                                                                                                                     |
| -------------- | -------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| username       | req.body | string | yes      | Unique: true, Min-Length: 2, Max-Length: 50 , May only contain letters, numbers, and underscores                                                 |
| password       | req.body | string | yes      | Min-Length: 6, Max-Length: 60 , Must contain at least one number, one word character, and one special character from this list: [ %,^,*,$,@,#,!] |
| email          | req.body | string | yes      | Will be checked for valid format.                                                                                                                |

#### Example Request:

```
{
    username: "salty_Dud3",
    password: "n4J3%Lp",
    email: "imsosalty@saltymail.com"
}
```

#### Example Response:

```
{
    username: "salty_Dud3",
    id: 1,
    favorites: [],
    token: "fjbifjlbia4335.4534vsla32w.fwlfj4sfsarasafd8",
}
```

#### Possible Errors:

Missing username, password , or email in req.body

```
{
    "errors": {
       username: "A username is required to register.",
       email: "An email is required to register.",
       password: "A password is required to register.",
    }
}
```

_Invalid characters in username_

```
{
    "errors": {
       username: "Username may only contain letters, numbers, and underscores."
    }
}
```

_Username taken._

```
{
    "errors": {
        username:"Sorry, that username is unavailable."
    }
}
```

_Invalid email address format_

```
{
"errors": {
email:"Please provide a valid email address."
}
}
```

_Email taken_

```
{
"errors": {
email: "An account has already been registered with that email address."
}
}
```

---

### User Login

Method used: **[POST]** `/api/login/`

On Success: Returns an object containing a token, as well as the following user information: Id, firstName, lastName, instructor status, client status.

Parameters:

| Parameter Name | Location | Type   | Required |
| -------------- | -------- | ------ | -------- |
| username       | req.body | string | yes      |
| password       | req.body | string | yes      |

#### Example Request:

req.body

```

{
username: "salty_Dud3",
password: "n4J3%Lp",
}

```

#### Example Response:

```

{
username: "salty_Dud3",
id: 1,
favorites: [
342,673, 122, 560
],
token: "fjbifjlbia4335.4534vsla32w.fwlfj4sfsarasafd8",
}

```

#### Possible Errors:

_Invalid Username and/or Password_

```

{
"errors": [
"Invalid Credentials."
]
}

```

_No Username and/or Password in req.body_

```

{
"errors": {
username: "A username is required to log in.",
password: "A password is required to log in.",

}
}

```

---

### Users Overview

| Method | Endpoint         | Requires             | Description                                          |
| ------ | ---------------- | -------------------- | ---------------------------------------------------- |
| GET    | `/api/users/:id` | Authentication Token | Returns user data.                                   |
| DELETE | `/api/users/:id` | Authentication Token | Used to delete the user that is currently logged in. |

---

### Get User Data

Method used: **[GET]** `/api/users/:id`

On Success: Returns an object containing the user's data.

Parameters:

| Parameter Name | Location                  | Type   | Required |
| -------------- | ------------------------- | ------ | -------- |
| Auth Token     | req.headers.authorization | string | yes      |

#### Example Response:

```

{
  username: "salty_Dud3",
id: 1,
favorites: [
342,673, 122, 560
],
}

```

#### Possible Errors:

_Invalid Token_

```

{
"errors": [
"invalid token"
]
}

```

_Not Authorized_

```

{
"errors": [
"Not Authorized"
]
}

```

### Delete User

Method used: **[DELETE]** `/api/users/:id`

On Success: Returns a message.

Parameters:

| Parameter Name | Location                  | Type   | Required |
| -------------- | ------------------------- | ------ | -------- |
| Auth Token     | req.headers.authorization | string | yes      |

#### Example Response:

```

{
  message: "User account successfully deleted."
}

```

#### Possible Errors:

_Invalid Token_

```

{
"errors": [
"invalid token"
]
}

```

_Not Authorized_

```

{
"errors": [
"Not Authorized"
]
}

```

---

---

### Favorites Overview

| Method | Endpoint                   | Requires                                 | Description                                              |
| ------ | -------------------------- | ---------------------------------------- | -------------------------------------------------------- |
| GET    | `/api/users/:id/favorites` | Authentication Token                     | Returns user's favorite comments.                        |
| DELETE | `/api/users/:id/favorites` | Authentication Token, comment - req.body | Used to delete a comment from the list of user favorites |
| POST   | `/api/users/:id/favorites` | Authentication Token, comment - req.body | Used to add a comment to the user's favorites.           |

---

### Get User Favorites

Method used: **[GET]** `/api/users/:id/favorites`

On Success: Returns an object containing the user's favorite comments.

Parameters:

| Parameter Name | Location                  | Type   | Required |
| -------------- | ------------------------- | ------ | -------- |
| Auth Token     | req.headers.authorization | string | yes      |

#### Example Response:

```

{
favorites: [
  342,673, 122, 560
],
}

```

#### Possible Errors:

_Invalid Token_

```

{
"errors": [
"invalid token"
]
}

```

_Not Authorized_

```

{
"errors": [
"Not Authorized"
]
}

```

---

### Add Favorite

Method used: **[POST]** `/api/users/:id/favorites`

On Success: Returns an updated list of the user's favorites.

Parameters:

| Parameter Name | Location | Type    | Required |
| -------------- | -------- | ------- | -------- |
| comment        | req.body | integer | yes      |

#### Example Request:

req.body

```

{
  comment: 5,
}

```

#### Example Response:

```

{
  favorites: [1,2,3,4,5],
}

```

#### Possible Errors:

_Invalid Token_

```

{
"errors": [
"invalid token"
]
}

```

_Comment ID was not provided_

```

{
"errors": {
  comment : " A comment ID is required."
}
}

```

_Comment ID is not an integer_

```

{
"errors": {
  comment : "Comment must be an integer."
}
}

```

---

### Delete Favorite

Method used: **[DELETE]** `/api/users/:id/favorites`

On Success: Returns an updated list of the user's favorites.

Parameters:

| Parameter Name | Location | Type    | Required |
| -------------- | -------- | ------- | -------- |
| comment        | req.body | integer | yes      |

#### Example Request:

req.body

```

{
comment: 3,
}

```

#### Example Response:

```

{
favorites: [ 1,2,4],
}

```

#### Possible Errors:

_Invalid Token_

```

{
errors: [
"invalid token"
]
}

```

_Comment ID was not provided_

```

{
"errors": {
  comment : " A comment ID is required."
}
}

```

_Comment ID is not an integer_

```

{
"errors": {
  comment : "Comment must be an integer."
}
}

```

---
