# flake8: noqa
from .base import *  # noqa

DEBUG = True

ALLOWED_HOSTS = [
    "localhost",
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Next.js app
]
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",  # Next.js app
]
