# Plain Sailing Note Taker

A simple note taking api that allows users to save notes built with Lumen PHP

## Features

* User can create a note
* User can Edit a note
* User can read a note
* User can delete a note

## Setup

* Make sure php 7.x and composer  installed on your system.
* Clone this repository and cd into it(`git clone https://github.com/{repo_path}`).
* Create a database for the application. Note: This app has been testest with mysql only.
* Rename the _.env.example_ file to _.env_ and set the following environment variables:

    *  `APP_KEY`=*`somerandlongomstring`*
    *  `DB_CONNECTION`=*`databasetype`*
    *  `DB_HOST`=*`127.0.0.1`*
    *  `DB_PORT`=*`databaseport`*
    *  `DB_DATABASE`=*`databasename`*
    *  `DB_USERNAME`=*`username`*
    *  `DB_PASSWORD`=*`databasepassword`*
 
* Start the app by typing php `php -S localhost:<prefered_port> -t public` to start the API.
    

## Authentication and Authorization

The api uses jwt authentication. 

####Create A User

##### Request
`POST localhost:<port>/users/api/v1/version`
##### Payload sample
```
{
	"firstname": "John",
	"lastname": "Doe",
	"username": "jdoe",
	"email": "johndoe@domain.com",
	"password": "password"
}
```

##### Response
```
{
    "user": {
        "firstname": "John",
        "lastname": "Doe",
        "username": "jdoe",
        "email": "johndoe@domain.com",
        "updated_at": "2018-01-15 22:24:55",
        "created_at": "2018-01-15 22:24:55",
        "id": 1
    }
}
```

#### Login

##### Request

`POST localhost:<port>/users/api/v1/version`

##### Payload Sample

```
{
	"email": "johndoe@domain.com",
	"password": "password"
}
```

##### Response
```
{
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.BaiekdijjwoBKKYHkhb.ueeieeieaKKK234jdf4e3lkjdfdf-dkdkdkwoierneir-mz8U"
}
```

**Set the sent token as an authorization header like so:** `Authorization: Bearer <token>`

## Other Endpoints

#### Get All Users

##### Request

`GET localhost:<port>/api/v1/users`

##### Response
**An array of user objects**

```
[
    {
        "id": 1,
        "firstname": "John",
        "lastname": "Doe",
        "username": "jdoe",
        "email": "johndoe@domain.com",
        "created_at": "2017-11-07 20:28:14",
        "updated_at": "2017-11-07 20:28:14"
    },
    {
        "id": 2,
        "firstname": "FU1luJkg1f",
        "lastname": "2XqFG6hSw4",
        "username": "BJt4YS3XjP",
        "email": "KQyGZCZBwN@gmail.com",
        "created_at": "2017-11-07 18:33:50",
        "updated_at": "2017-11-07 18:33:50"
    },
    ...
]
```

#### Get One User

##### Request

`GET localhost/users/{id}`

##### Response

```
   {
        "id": 1,
        "firstname": "John",
        "lastname": "Doe",
        "username": "jdoe",
        "email": "johndoe@domain.com",
        "created_at": "2017-11-07 20:28:14",
        "updated_at": "2017-11-07 20:28:14"
    }
```

### Get Currently Loggedin User

#### Request

`GET localhost/users/{id}`

#### Response

```
   {
        "id": 1,
        "firstname": "John",
        "lastname": "Doe",
        "username": "jdoe",
        "email": "johndoe@domain.com",
        "created_at": "2017-11-07 20:28:14",
        "updated_at": "2017-11-07 20:28:14"
    }
```

#### Update User

##### Request

`PUT localhost:<port>/api/v1/users/{id}`

##### Payload sample

```
{
	"firstname": "Jane",
	"lastname":  "Doe",
	"password": "newpassword"
}

```

##### Response

```
{
    "error": false,
    "user": {
        "id": 2,
        "firstname": "Jane",
        "lastname": "Doe",
        "username": "BJt4YS3XjP",
        "email": "KQyGZCZBwN@gmail.com",
        "created_at": "2018-01-15 22:24:55",
        "updated_at": "2018-01-15 23:34:09"
    }
}

Note: You can only update firstname, lastname and password
```

### Resetting Password

#### Request reset link

##### Request
`GET localhost:<port>/api/v1/passwords/reset?email=<user's email>&baseurl=<yourdomain.com/password/reset>`
This sends an email to user's email which contains a link that looks like `yourdomain.com/passwords/reset/<jwttoken>`.  The token attached to this url only last for 15 mins

##### Response
```
    {
        "message": "Please check your email for instructions on how to reset your password"
    }
```

#### Reset Password from the link
When the users click on the reset link sent to them, it takes them to this part of your frontend `yourdomain.com/passwords/reset/<token>`.

##### Request
Grab the token parameter in the link. then sent the token as your authorization header like so:
`Authorization: Bearer <thetoken>` then send:

`PUT localhost:<port>/api/v1/passwords/reset`

##### Payload
````
    password: <your new password>
    confirm: <your new password>
````

##### Response
```
    {
        "message": "You have reset your password successfully. You can now login with your new password"
    }

```

#### Delete User

##### Request

`DELETE localhost:<port>/api/v1/users/{id}`

##### Response
```
{
    "error": "false",
    "message": "user delete successful"
}

Note: A user can only delete his own account.
```

#### Create Note

##### Request 

`POST localhost:<port>/api/v1/notes/{id}`
##### Payload Sample

```
{
	"title": "Hello note",
	"content": "Hello from this note"
}
```

##### Response

```
{
    "note": {
        "user_id": 5,
        "title": "Hello note",
        "content": "Hello from this note",
        "updated_at": "2018-01-17 14:04:52",
        "created_at": "2018-01-17 14:04:52",
        "id": 9
    }
}
```

##### Get All Notes

##### Request 
`GET localhost:<port>/api/v1/notes`

##### Response

```
{
    "notes": {
        "1": {
            "id": 7,
            "title": "how to become a programmer",
            "content": "start from the basic, solve algorithms build stuff and be amazing",
            "user_id": 5,
            "created_at": "2017-11-17 05:54:01",
            "updated_at": "2017-11-17 06:47:16"
        },
        "3": {
            "id": 9,
            "title": "Hello note",
            "content": "Something Light",
            "user_id": 5,
            "created_at": "2018-01-17 14:04:52",
            "updated_at": "2018-01-17 14:04:52"
        }
    }
}

Note: A user can only see his own note
```

#### Get One Note

##### Request
`POST localhost:<port>/api/v1/notes/{id}`

##### Response

```
{
    "note": {
        "id": 7,
        "title": "how to become a programmer",
        "content": "start from the basic, solve algorithms build stuff and be amazing",
        "user_id": 5,
        "created_at": "2017-11-17 05:54:01",
        "updated_at": "2017-11-17 06:47:16"
    }
}

Note: you can only see your own note.
```

#### Update Note

`PUT localhost:<port>/api/v1/notes{id}`

##### Payload Sample
```
{
    "title": "how to become a  GOOD programmer",
    "content": "start from the basic, solve algorithms build stuff and be amazing"
}
```

##### Response

```
{
    "note": {
        "id": 7,
        "title": "how to become a  GOOD programmer",
        "content": "start from the basic, solve algorithms build stuff and be amazing",
        "user_id": 5,
        "created_at": "2017-11-17 05:54:01",
        "updated_at": "2018-01-17 14:24:20"
    }
}
Note: You can only update your own note
```

#### Delete Note

##### Request

`DELETE localhost:<port>/api/v1/notes/{id} `

##### Payload sample

##### Response

```
STATUS: 204, NO CONTENT
```

## Feature Features
* Add tags to notes
* Add notes that pops up at interval

The Lumen software is licenced under  [MIT license](http://opensource.org/licenses/MIT)
