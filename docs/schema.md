## DB schema and description


## Menu
* container for category and Products
* start and end date

##### Fields:
* id
* name
* start date
* end date (nullable)
* categories
* Products

## Category
* can have other category
* can have many menu Products

##### Fields:
* id
* name
* image_url (nullable)
* hex_color (hex, nullable)
* other category ids (M2M)
* many Products (M2M)

## Product
* can have other category
* can have many menu Products

##### Fields:
* id
* name
* image_url (nullable)
* hex_color (hex, nullable)
* price (decimal)


## Order
* can have multiple Products
* is connected to Product through ProductInOrderAmount

##### Fields:
* id
* finished_at (nullable)
* products
* order_id
* payment_method
* is_paid
* delivery_method


## ProductInOrderAmount
* can have multiple Products
* can have many menu Products

##### Fields:
* product
* order
* amount


## MenuSet
* requires at least one set-step

##### Fields:
* name
* set-step

## MenuSetStep
* have only one set
* have products which must be added to the step

##### Fields:
* set (fk)
* name
* products (Product)
* ordering_number (number)
