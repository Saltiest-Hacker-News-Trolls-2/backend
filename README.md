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
- use the command `npm run dev` to run the server locally using the 'development' environment settings
- use the command `npm run test` to run the test files using the 'test' environment settings

## Endpoints

Quick Links: [Users Overview](#users-overview) | [Comments Overview](#comments-overview) |
[Wakeup Overview](#wakeup-overview)

### Users Overview

| Method | Endpoint          | Requires                                                              | Description                                                                                         |
| ------ | ----------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| POST   | `/api/register/`  | `email address`- req.body, `username`- req.body, `password`- req.body | Used for adding a new user to the database. Returns an object containing user data and a JWT token. |
| POST   | `/api/login/`     | `username` - req.body, `password`- req.body                           | Used to log a user in. Returns an object containing user data and a JWT token.                      |
| GET    | `/api/users/:id/` | Authentication Token                                                  | Used to show details of a specific user.                                                            |
| PUT    | `/api/users/:id/` | Authentication Token                                                  | Used to update the information of the user currently logged in.                                     |
| DELETE | `/api/users/:id/` | Authentication Token                                                  | Used to delete the user that is currently logged in.                                                |

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
    "errors": [
        "A username, password, and email are required to register."
    ]
}
```

Invalid characters in username

```
{
    "errors": [
        "Username may only contain letters, numbers, and underscores."
    ]
}
```

Username taken.

```
{
    "errors": [
        "Sorry, that username is unavailable."
    ]
}
```

Invalid email address format

```
{
"errors": [
"Please provide a valid email address."
]
}
```

Email taken

```
{
"errors": [
"An account has already been registered with that email address."
]
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
{
"id": 5493,
"commenter_name": "Mr.Salty",
"comment": " I hate puppies",
"rating": 56.4345,
"commenter_id": 402830
},
{
"id": 2770,
"commenter_name": "Mr.Salty",
"comment": "Everybody on this forum sucks",
"rating": 12.71,
"commenter_id": 402830
}
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
"errors": [
"Username and Password are required to log in."
]
}

```

---

```

```
