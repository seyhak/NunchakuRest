# API Documentation

## USER API

### POST `/api/signup`

Creates a new user account.

#### Request

{
  "username": "rrashley",
  "password": "xxxxxxx",
  "first_name": "Ashley",
  "last_name": "Raid",
  "email": "rileyraid@xxx.com"
}

#### Response

- Status Code: 201 Created

{
  "username": "rrashley",
  "first_name": "Ashley",
  "last_name": "Raid",
  "email": "rileyraid@xxx.com"
}

### Error Response - Missing Field

#### Request

{
  "username": "rrashley",
  "password": "xxxxxxx",
  "first_name": "Ashley",
  "last_name": "Raid",
  "email": "rileyraid@xxx.com"
}

#### Response

- Status Code: 400 Bad Request

{
  "missing_field": ["This field is required."]
}

### Error Response - Username Exists

#### Request

{
  "username": "rrashley",
  "password": "xxxxxxx",
  "first_name": "Ashley",
  "last_name": "Raid",
  "email": "rileyraid@xxx.com"
}

#### Response

- Status Code: 400 Bad Request

{
  "message": "duplicate key value violates unique constraint"
}

## Login API

### POST /api/login

Logs in an existing user.

#### Request

{
  "username": "rrashley",
  "password": "xxxxxxx"
}

#### Response

- Status Code: 200 OK

{
  "username": "rrashley",
  "first_name": "",
  "last_name": "",
  "email": ""
}

### Error Response - Wrong Password

#### Request

{
  "username": "rrashley",
  "password": "PH"
}

#### Response

- Status Code: 401 Unauthorized

{
  "message": "Invalid credentials."
}

## Change Password API

### PATCH /api/change-password

Changes the password of the authenticated user.

### Success Response

#### Request

{
  "password": "xhamster"
}

#### Response

- Status Code: 200 OK

{
  "message": "Password changed."
}

### Error Response - Not Authenticated

#### Request

{
  "password": "xhamster"
}

#### Response

- Status Code: 403 Forbidden

{
  "detail": "Authentication credentials were not provided"
}
