# NunchakuRest
is an app for managing client cards with loyality stamps. Basic assumptions:

## TECHSTACK:

* Django + DRF
* NextJS
* PostgreSQL
* Black

### ADDITIONAL DEPENDENCIES:

* https://github.com/spulec/freezegun

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
### RUN FE
as for now hot refresh doesnt work from docker so to run fe
```
yarn dev
```


## RUN CODE-FORMATTER

from particular container, black, isort, autoflake 
```
isort .
autoflake * -r \--remove-all-unused-imports --remove-unused-variables --quiet -i
black <dir>
black .
```

## AUTO TESTING
```
1) REUSE_DB=1 python backend/manage.py test api.tests.test_endpoints.TestGetMyCards.test_get_my_cards -v=2
2) python backend/manage.py test --verbosity=2
```
## MANUAL TESTING

Go to `admin/`

## GIT POLICY

https://www.conventionalcommits.org/en/v1.0.0/


## LANGUAGES BACKEND
in container `apk add gettext`

`python manage.py makemessages -l <language_code>`

`python manage.py makemessages -l en`

`python manage.py makemessages -l pl`

`python manage.py compilemessages`

## Deploy

1) go to backend/frontend
2) run `gcloud app deploy`

## Gcloud

* https://nextjsapp-dot-stunning-surge-409813.lm.r.appspot.com/
* https://stunning-surge-409813.lm.r.appspot.com/admin/
