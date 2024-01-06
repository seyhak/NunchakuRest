# flake8: noqa
import os

from .base import *  # noqa

DEBUG = False

# SERVER_EMAIL = "root@localhost" TODO
# DEFAULT_FROM_EMAIL = "webmaster@localhost" TODO

ADMINS = [("Seyhak", "seyhakly@gmail.com")]
ALLOWED_HOSTS = [
    "stunning-surge-409813.lm.r.appspot.com",
]
PG_HOST = os.environ.get("PG_HOST")
PG_USER = os.environ.get("PG_USER")
PG_NAME = os.environ.get("PG_NAME")
PG_PASSWORD = os.environ.get("PG_PASSWORD")
DATABASE_PG_NEON = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": PG_NAME,
        "USER": PG_USER,
        "PASSWORD": PG_PASSWORD,
        "HOST": PG_HOST,
        "OPTIONS": {
            "sslmode": "require",
        },
    }
}
DATABASES = {**DATABASE_PG_NEON}
