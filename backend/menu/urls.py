# urls.py
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CategoryViewSet, MenuViewSet, ProductViewSet

router = DefaultRouter()
router.register(r"products", ProductViewSet, "products")
router.register(r"categories", CategoryViewSet, "categories")
router.register(r"menus", MenuViewSet, "menus")

app_name = "menu"
urlpatterns = [
    path("", include(router.urls)),
]
