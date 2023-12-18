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

## PRODUCT API

### LIST

`products/`

### DETAILS

`products/{id}`

#### Response

```
{
    "id": str(self.category.id),
    "created_at": self.category.created_at.strftime(
        "%Y-%m-%dT%H:%M:%S.%fZ"
    ),
    "updated_at": self.category.updated_at.strftime(
        "%Y-%m-%dT%H:%M:%S.%fZ"
    ),
    "name": self.category.name,
    "description": None,
    "image_url": None,
    "hex_color": None,
    "sub_categories": [],
    "products": [],
}
```

## CATEGORY API

### LIST

`categories/`

### DETAILS

`categories/{id}`

#### Response

```
{
    "id": str(self.category.id),
    "created_at": self.category.created_at.strftime(
        "%Y-%m-%dT%H:%M:%S.%fZ"
    ),
    "updated_at": self.category.updated_at.strftime(
        "%Y-%m-%dT%H:%M:%S.%fZ"
    ),
    "name": self.category.name,
    "image_url": None,
    "hex_color": None,
    "price": 123.12,
}
```

## MENU API

### LIST

`menus/`

### DETAILS

`menus/{id}`

#### Response

```
  {
      "id": [uuid],
      "created_at": str,
      "updated_at": str,
      "name": str,
      "categories": [],
      "products": [],
      "start_date": None,
      "end_date": None,
  },
```

## ORDER API

### LIST

`orders/`

### DETAILS

`orders/{id}`

#### Response

```
  {
    "id": UUID,
    "created_at": date,
    "delivery_method": "HR" | "TA",
    "order_id": str,
    "products": dict,
    "payment_method": "CS",
    "is_paid": bool,
  },
```
### CREATE

`POST orders/`

#### Payload
```
{
    "products": {
        "id": UUID,
        "amount": number
    },
    "delivery_method": str from enum,
    "payment_method": str from enum
}
```

#### Response
```
{
    "id": mock.ANY,
    "products": [
        {
            "id": str(product_1.id),
            "amount": 10,
        },
        {
            "id": str(product_2.id),
            "amount": 15,
        },
        {
            "id": str(product_3.id),
            "amount": 50,
        },
    ],
    "order_id": str,
    "payment_method": str from enum,
    "is_paid": bool,
    "delivery_method": str from enum,
    "created_at": str,
}
```

### FINISH ORDER

`PATCH orders/{id}/finish-order/`

#### Payload
```
{
    "products": {
        "id": UUID,
        "amount": number
    },
    "delivery_method": str from enum,
    "payment_method": str from enum
}
```