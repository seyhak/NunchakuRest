from django.urls import reverse
from django.utils.translation import activate
from parameterized import parameterized
from rest_framework import status
from rest_framework.test import APITestCase

from menu.models import Category, Menu, Product
from tests.factories.menu import CategoryFactory, MenuFactory, ProductFactory


class TestProductViewSet(APITestCase):
    def setUp(self):
        self.product = ProductFactory()

    def test_product_list(self):
        url = reverse("menu:products-list")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), Product.objects.count())

    def test_product_detail(self):
        url = reverse("menu:products-detail", args=[self.product.id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertDictEqual(
            response.data,
            {
                "id": str(self.product.id),
                "created_at": self.product.created_at.strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
                "updated_at": self.product.updated_at.strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
                "name": self.product.name,
                "image_url": None,
                "hex_color": None,
                "price": str(self.product.price),
            },
        )


class TestMenuViewSet(APITestCase):
    def setUp(self):
        self.menu = MenuFactory(name="Orange")

    def test_menu_list(self):
        url = reverse("menu:menus-list")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), Menu.objects.count())

    @parameterized.expand(
        [
            ("en", "Orange"),
        ]
    )
    def test_menu_detail_translate(self, lang, expected):
        self.client.head
        activate(lang)
        url = reverse("menu:menus-detail", args=[self.menu.id])
        response = self.client.get(url, headers={"Accept-Language": lang})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertDictEqual(
            response.data,
            {
                "id": str(self.menu.id),
                "created_at": self.menu.created_at.strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
                "updated_at": self.menu.updated_at.strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
                "name": self.menu.name,
                "categories": [],
                "products": [],
                "start_date": None,
                "end_date": None,
            },
        )


class TestCategoryViewSet(APITestCase):
    def setUp(self):
        self.category = CategoryFactory()

    def test_category_list(self):
        CategoryFactory()
        CategoryFactory()
        url = reverse("menu:categories-list")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), Category.objects.count())

    def test_category_detail(self):
        url = reverse("menu:categories-detail", args=[self.category.id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data,
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
            },
        )
