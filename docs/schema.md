## DB schema and description

### Menu

#### Menu
* container for category and Products
* start and end date

##### Fields:
* id
* name
* start date
* end date (nullable)
* categories
* Products

#### Category
* can have other category
* can have many menu Products

##### Fields:
* id
* name
* image_url (nullable)
* hex_color (hex, nullable)
* other category ids (M2M)
* many Products (M2M)

#### Product
* can have other category
* can have many menu Products

##### Fields:
* id
* name
* image_url (nullable)
* hex_color (hex, nullable)
* price (decimal)

--
