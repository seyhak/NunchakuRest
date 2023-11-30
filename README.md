# NunchakuRest
is an app for managing client cards with loyality stamps. Basic assumptions:

## TECHSTACK:

* Django + DRF
* NextJS
* PostgreSQL
* Black

## CREATE SUPERUSER ##
```
1. get inside container
2. python manage.py createsuperuser
3. (optional) user: seyhak, password: admin
```
## RUN ALL ##
```
docker-compose up
```

## RUN CODE-FORMATTER

from particular container, black, isort, autoflake 
```
isort .
autoflake --in-place --remove-unused-variables .
black <dir>
black .
```

## AUTO TESTING
```
1) REUSE_DB=1 python app/manage.py test api.tests.test_endpoints.TestGetMyCards.test_get_my_cards -v=2
2) python app/manage.py test --verbosity=2
```
## MANUAL TESTING

Go to `admin/`

## GIT POLICY

https://www.conventionalcommits.org/en/v1.0.0/
