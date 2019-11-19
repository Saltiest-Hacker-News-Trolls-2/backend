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

Quick Links: [Onboarding Overview](#onboarding-overview) | [Users Overview](#users-overview) | [Favorites Overview](#favorites-overview)

### Onboarding Overview

| Method | Endpoint         | Requires                                                              | Description                                                                                         |
| ------ | ---------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| POST   | `/api/register/` | `email address`- req.body, `username`- req.body, `password`- req.body | Used for adding a new user to the database. Returns an object containing user data and a JWT token. |
| POST   | `/api/login/`    | `username` - req.body, `password`- req.body                           | Used to log a user in. Returns an object containing user data and a JWT token.                      |

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

Example Request:

```
{
    username: "salty_Dud3",
    password: "n4J3%Lp",
    email: "imsosalty@saltymail.com"
}
```

Example Response:

```
{
    username: "salty_Dud3",
    id: 1,
    favorites: [],
    token: "fjbifjlbia4335.4534vsla32w.fwlfj4sfsarasafd8",
}
```

Possible Errors:

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

Invalid characters in username

```
{
    "errors": {
       username: "Username may only contain letters, numbers, and underscores."
    }
}
```

Username taken.

```
{
    "errors": {
        username:"Sorry, that username is unavailable."
    }
}
```

Invalid email address format

```
{
"errors": {
email:"Please provide a valid email address."
}
}
```

Email taken

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

Example Request:

req.body

```

{
username: "salty_Dud3",
password: "n4J3%Lp",
}

```

Example Response:

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

Possible Errors:

Invalid Username and/or Password

```

{
"errors": [
"Invalid Credentials."
]
}

```

No Username and/or Password in req.body

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

Example Response:

```

{
  username: "salty_Dud3",
id: 1,
favorites: [
342,673, 122, 560
],
}

```

Possible Errors:

Invalid Token

```

{
"errors": [
"invalid token"
]
}

```

Not Authorized

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

Example Response:

```

{
  message: "User account successfully deleted."
}

```

Possible Errors:

Invalid Token

```

{
"errors": [
"invalid token"
]
}

```

Not Authorized

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

Example Response:

```

{
favorites: [
  342,673, 122, 560
],
}

```

Possible Errors:

Invalid Token

```

{
"errors": [
"invalid token"
]
}

```

Not Authorized

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

On Success: Returns an object containing the ID of the added comment.

Parameters:

| Parameter Name | Location | Type    | Required |
| -------------- | -------- | ------- | -------- |
| comment        | req.body | integer | yes      |

Example Request:

req.body

```

{
comment: 5,
}

```

Example Response:

```

{
comment: 5,
}

```

Possible Errors:

Invalid Token

```

{
"errors": [
"invalid token"
]
}

```

Comment ID was not provided

```

{
"errors": {
  comment : " A comment ID is required."
}
}

```

Comment ID is not an integer

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

On Success: Returns an object containing the ID of the deleted comment.

Parameters:

| Parameter Name | Location | Type    | Required |
| -------------- | -------- | ------- | -------- |
| comment        | req.body | integer | yes      |

Example Request:

req.body

```

{
comment: 5,
}

```

Example Response:

```

{
comment: 5,
}

```

Possible Errors:

Invalid Token

```

{
errors: [
"invalid token"
]
}

```

Comment ID was not provided

```

{
"errors": {
  comment : " A comment ID is required."
}
}

```

Comment ID is not an integer

```

{
"errors": {
  comment : "Comment must be an integer."
}
}

```

---
