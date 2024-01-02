import json
from datetime import date
from time import sleep
from unittest import mock
from uuid import uuid4

from django.urls import reverse
from django.utils import timezone
from django.utils.translation import activate
from freezegun import freeze_time
from parameterized import parameterized
from rest_framework import status
from rest_framework.test import APITestCase

from menu.models import Category, Menu, MenuSet, Order, Product
from tests.factories.menu import (
    CategoryFactory,
    MenuFactory,
    MenuSetFactory,
    MenuSetsInOrderAmountFactory,
    MenuSetStepFactory,
    OrderedProductsInMenuSetsOrderFactory,
    OrderFactory,
    ProductFactory,
    ProductInOrderAmountFactory,
)
from tests.factories.user import UserFactory


class TestProductViewSet(APITestCase):
    def setUp(self):
        user = UserFactory()
        self.client.force_login(user)
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
        user = UserFactory()
        self.client.force_login(user)
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
        menu_set = MenuSetFactory()
        sleep(0.00001)
        menu_set_1 = MenuSetFactory()
        step_1 = MenuSetStepFactory(menu_set=menu_set)
        sleep(0.00001)
        step_2 = MenuSetStepFactory(menu_set=menu_set)
        products = []
        for i in range(5):
            products.append(ProductFactory())
            sleep(0.00001)
        product_1_1, product_1_2, product_2_1, product_2_2, product_2_3 = products

        step_1.products.add(product_1_1)
        step_1.products.add(product_1_2)
        step_2.products.add(product_2_1)
        step_2.products.add(product_2_2)
        step_2.products.add(product_2_3)

        product_1 = ProductFactory(name="banana")
        sleep(0.00001)
        product_2 = ProductFactory(name="apple")
        sleep(0.00001)
        product_3_1 = ProductFactory(name="white cheese")
        sleep(0.00001)
        product_3_2 = ProductFactory(name="yellow cheese")
        sleep(0.00001)
        product_4 = ProductFactory(name="milk")
        sleep(0.00001)
        product_5 = ProductFactory(name="yogurt")
        sleep(0.00001)
        category_1 = CategoryFactory(name="dairy")
        sleep(0.00001)
        sub_category_1 = CategoryFactory(name="cheese")
        sleep(0.00001)
        category_1.sub_categories.add(sub_category_1)
        category_1.sub_categories.add(sub_category_1)
        category_1.products.add(product_4, product_5)
        sub_category_1.products.add(
            product_3_1,
            product_3_2,
        )
        self.menu.products.add(product_1)
        self.menu.products.add(product_2)
        self.menu.categories.add(category_1)
        self.menu.menu_sets.add(menu_set)
        self.menu.menu_sets.add(menu_set_1)
        self.menu.save()
        activate(lang)
        url = reverse("menu:menus-detail", args=[self.menu.id])
        with self.assertNumQueries(14):
            response = self.client.get(url, headers={"Accept-Language": lang})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # make all ordereddict dict
        data = json.dumps(response.data)
        data = json.loads(data)

        self.assertEqual(
            data,
            {
                "id": str(self.menu.id),
                "categories": [
                    {
                        "id": str(category_1.id),
                        "name": "dairy",
                        "description": None,
                        "image_url": None,
                        "hex_color": None,
                        "sub_categories": [
                            {
                                "id": str(sub_category_1.id),
                                "name": "cheese",
                                "description": None,
                                "image_url": None,
                                "hex_color": None,
                                "sub_categories": [],
                                "products": [
                                    {
                                        "id": str(product_3_1.id),
                                        "created_at": product_3_1.created_at.strftime(
                                            "%Y-%m-%dT%H:%M:%S.%fZ"
                                        ),
                                        "updated_at": product_3_1.updated_at.strftime(
                                            "%Y-%m-%dT%H:%M:%S.%fZ"
                                        ),
                                        "name": "white cheese",
                                        "image_url": None,
                                        "hex_color": None,
                                        "price": str(product_3_1.price),
                                    },
                                    {
                                        "id": str(product_3_2.id),
                                        "created_at": product_3_2.created_at.strftime(
                                            "%Y-%m-%dT%H:%M:%S.%fZ"
                                        ),
                                        "updated_at": product_3_2.updated_at.strftime(
                                            "%Y-%m-%dT%H:%M:%S.%fZ"
                                        ),
                                        "name": "yellow cheese",
                                        "image_url": None,
                                        "hex_color": None,
                                        "price": str(product_3_2.price),
                                    },
                                ],
                            }
                        ],
                        "products": [
                            {
                                "id": str(product_4.id),
                                "created_at": product_4.created_at.strftime(
                                    "%Y-%m-%dT%H:%M:%S.%fZ"
                                ),
                                "updated_at": product_4.updated_at.strftime(
                                    "%Y-%m-%dT%H:%M:%S.%fZ"
                                ),
                                "name": "milk",
                                "image_url": None,
                                "hex_color": None,
                                "price": str(product_4.price),
                            },
                            {
                                "id": str(product_5.id),
                                "created_at": product_5.created_at.strftime(
                                    "%Y-%m-%dT%H:%M:%S.%fZ"
                                ),
                                "updated_at": product_5.updated_at.strftime(
                                    "%Y-%m-%dT%H:%M:%S.%fZ"
                                ),
                                "name": "yogurt",
                                "image_url": None,
                                "hex_color": None,
                                "price": str(product_5.price),
                            },
                        ],
                    }
                ],
                "products": [
                    {
                        "id": str(product_1.id),
                        "created_at": product_1.created_at.strftime(
                            "%Y-%m-%dT%H:%M:%S.%fZ"
                        ),
                        "updated_at": product_1.updated_at.strftime(
                            "%Y-%m-%dT%H:%M:%S.%fZ"
                        ),
                        "name": "banana",
                        "image_url": None,
                        "hex_color": None,
                        "price": str(product_1.price),
                    },
                    {
                        "id": str(product_2.id),
                        "created_at": product_2.created_at.strftime(
                            "%Y-%m-%dT%H:%M:%S.%fZ"
                        ),
                        "updated_at": product_2.updated_at.strftime(
                            "%Y-%m-%dT%H:%M:%S.%fZ"
                        ),
                        "name": "apple",
                        "image_url": None,
                        "hex_color": None,
                        "price": str(product_2.price),
                    },
                ],
                "menu_sets": [
                    {
                        "id": str(menu_set.id),
                        "name": menu_set.name,
                        "set_steps": [
                            {
                                "name": step_1.name,
                                "products": [
                                    {
                                        "id": str(product_1_1.id),
                                        "created_at": product_1_1.created_at.strftime(
                                            "%Y-%m-%dT%H:%M:%S.%fZ"
                                        ),
                                        "updated_at": product_1_1.updated_at.strftime(
                                            "%Y-%m-%dT%H:%M:%S.%fZ"
                                        ),
                                        "name": str(product_1_1.name),
                                        "image_url": None,
                                        "hex_color": None,
                                        "price": str(product_1_1.price),
                                    },
                                    {
                                        "id": str(product_1_2.id),
                                        "created_at": product_1_2.created_at.strftime(
                                            "%Y-%m-%dT%H:%M:%S.%fZ"
                                        ),
                                        "updated_at": product_1_2.updated_at.strftime(
                                            "%Y-%m-%dT%H:%M:%S.%fZ"
                                        ),
                                        "name": str(product_1_2.name),
                                        "image_url": None,
                                        "hex_color": None,
                                        "price": str(product_1_2.price),
                                    },
                                ],
                            },
                            {
                                "name": step_2.name,
                                "products": [
                                    {
                                        "id": str(product_2_1.id),
                                        "created_at": product_2_1.created_at.strftime(
                                            "%Y-%m-%dT%H:%M:%S.%fZ"
                                        ),
                                        "updated_at": product_2_1.updated_at.strftime(
                                            "%Y-%m-%dT%H:%M:%S.%fZ"
                                        ),
                                        "name": str(product_2_1.name),
                                        "image_url": None,
                                        "hex_color": None,
                                        "price": str(product_2_1.price),
                                    },
                                    {
                                        "id": str(product_2_2.id),
                                        "created_at": product_2_2.created_at.strftime(
                                            "%Y-%m-%dT%H:%M:%S.%fZ"
                                        ),
                                        "updated_at": product_2_2.updated_at.strftime(
                                            "%Y-%m-%dT%H:%M:%S.%fZ"
                                        ),
                                        "name": str(product_2_2.name),
                                        "image_url": None,
                                        "hex_color": None,
                                        "price": str(product_2_2.price),
                                    },
                                    {
                                        "id": str(product_2_3.id),
                                        "created_at": product_2_3.created_at.strftime(
                                            "%Y-%m-%dT%H:%M:%S.%fZ"
                                        ),
                                        "updated_at": product_2_3.updated_at.strftime(
                                            "%Y-%m-%dT%H:%M:%S.%fZ"
                                        ),
                                        "name": str(product_2_3.name),
                                        "image_url": None,
                                        "hex_color": None,
                                        "price": str(product_2_3.price),
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        "id": str(menu_set_1.id),
                        "name": menu_set_1.name,
                        "set_steps": [],
                    },
                ],
                "created_at": self.menu.created_at.strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
                "updated_at": self.menu.updated_at.strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
                "name": "Orange",
                "start_date": None,
                "end_date": None,
            },
        )


class TestCategoryViewSet(APITestCase):
    def setUp(self):
        user = UserFactory()
        self.client.force_login(user)
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


class TestOrdersViewSet(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.client.force_login(self.user)
        self.order = OrderFactory()

    def test_orders_list(self):
        OrderFactory()
        OrderFactory()
        url = reverse("menu:orders-list")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), Order.objects.count())

    def test_orders_list_some_finished(self):
        OrderFactory(finished_at=timezone.now())
        OrderFactory()
        url = reverse("menu:orders-list")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), Order.objects.count() - 1)

    def test_orders_detail(self):
        with freeze_time("2022-01-14 12:45:01.0002", tz_offset=1):
            product_1 = ProductFactory()
        with freeze_time("2022-01-15 12:45:01.0002", tz_offset=1):
            product_2 = ProductFactory()
        product_3 = ProductFactory()
        product_4 = ProductFactory()
        ProductFactory()
        ProductInOrderAmountFactory(product=product_1, order=self.order, amount=20)
        ProductInOrderAmountFactory(product=product_2, order=self.order, amount=9)

        menu_set = MenuSetFactory()
        menu_set_step_1 = MenuSetStepFactory(menu_set=menu_set)
        menu_set_step_1.products.add(product_1, product_2)
        with freeze_time("2022-01-14 12:45:01.0002", tz_offset=1):
            menu_set_in_order_1 = MenuSetsInOrderAmountFactory(
                order=self.order, menu_set=menu_set, amount=2
            )
        with freeze_time("2022-01-14 12:45:01.0003", tz_offset=1):
            menu_set_in_order_2 = MenuSetsInOrderAmountFactory(
                order=self.order, menu_set=menu_set, amount=5
            )
        OrderedProductsInMenuSetsOrderFactory(
            menu_set_in_order=menu_set_in_order_1, product=product_1, ordering_number=0
        )
        OrderedProductsInMenuSetsOrderFactory(
            menu_set_in_order=menu_set_in_order_1, product=product_2, ordering_number=1
        )
        OrderedProductsInMenuSetsOrderFactory(
            menu_set_in_order=menu_set_in_order_2, product=product_2, ordering_number=0
        )
        OrderedProductsInMenuSetsOrderFactory(
            menu_set_in_order=menu_set_in_order_2, product=product_3, ordering_number=1
        )
        OrderedProductsInMenuSetsOrderFactory(
            menu_set_in_order=menu_set_in_order_2, product=product_4, ordering_number=2
        )

        url = reverse("menu:orders-detail", args=[self.order.id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = json.dumps(response.data)
        data = json.loads(data)

        self.assertDictEqual(
            data,
            {
                "id": str(self.order.id),
                "created_at": self.order.created_at.isoformat(),
                "delivery_method": "HR",
                "order_id": "0001",
                "products": [
                    {
                        "id": str(product_1.id),
                        "amount": 20,
                        "name": str(product_1.name),
                    },
                    {
                        "id": str(product_2.id),
                        "amount": 9,
                        "name": str(product_2.name),
                    },
                ],
                "menu_sets": [
                    {
                        "id": str(menu_set.id),
                        "name": menu_set.name,
                        "amount": 2,
                        "products": f"{product_1.name}, {product_2.name}",
                    },
                    {
                        "id": str(menu_set.id),
                        "name": menu_set.name,
                        "amount": 5,
                        "products": f"{product_2.name}, {product_3.name}, {product_4.name}",
                    },
                ],
                "payment_method": "CS",
                "is_paid": False,
            },
        )

    def test_orders_create(self):
        product_1 = ProductFactory()
        product_2 = ProductFactory()
        product_3 = ProductFactory()
        menu_set = MenuSetFactory()
        menu_set_step_1 = MenuSetStepFactory(menu_set=menu_set)
        menu_set_step_2 = MenuSetStepFactory(menu_set=menu_set)
        product_4 = ProductFactory()
        product_5 = ProductFactory()
        product_6 = ProductFactory()
        menu_set_step_1.products.add(product_4, product_5)
        menu_set_step_2.products.add(product_1, product_6)

        data = {
            "menu_sets": [
                {
                    "id": str(menu_set.id),
                    "amount": 2,
                    "products": [{"id": str(product_4.id)}, {"id": str(product_1.id)}],
                },
                {
                    "id": str(menu_set.id),
                    "amount": 1,
                    "products": [{"id": str(product_4.id)}, {"id": str(product_6.id)}],
                },
            ],
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
        }
        url = reverse("menu:orders-list")
        with self.assertNumQueries(18):  # to optimize
            response = self.client.post(url, data, format="json")

        data = json.loads(json.dumps(response.data))
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(type(response.data["id"]) is str)
        self.assertEqual(
            data,
            {
                "id": mock.ANY,
                "menu_sets": [
                    {
                        "id": str(menu_set.id),
                        "name": menu_set.name,
                        "amount": 2,
                        "products": f"{product_4.name}, {product_1.name}",
                    },
                    {
                        "id": str(menu_set.id),
                        "name": menu_set.name,
                        "amount": 1,
                        "products": f"{product_4.name}, {product_6.name}",
                    },
                ],
                "products": [
                    {
                        "id": str(product_1.id),
                        "amount": 10,
                        "name": str(product_1.name),
                    },
                    {
                        "id": str(product_2.id),
                        "amount": 15,
                        "name": str(product_2.name),
                    },
                    {
                        "id": str(product_3.id),
                        "amount": 50,
                        "name": str(product_3.name),
                    },
                ],
                "order_id": "0002",
                "payment_method": "CS",
                "is_paid": False,
                "delivery_method": "HR",
                "created_at": data["created_at"],
            },
        )

    def test_orders_create_product_doesnt_exist(self):
        product_1 = ProductFactory()
        product_2 = ProductFactory()

        data = {
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
                    "id": str(uuid4()),
                    "amount": 50,
                },
            ],
            "menu_sets": [],
        }
        url = reverse("menu:orders-list")
        response = self.client.post(url, data, format="json")

        data = json.loads(json.dumps(response.data))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            data, {"products": ["Some of requested products don't exist!"]}
        )

    @parameterized.expand(
        [
            (
                {"id": str(uuid4())},
                {
                    "products": [
                        {},
                        {},
                        {"amount": ["This field is required."]},
                    ]
                },
            ),
            (
                {"amount": 10},
                {
                    "products": [
                        {},
                        {},
                        {"id": ["This field is required."]},
                    ]
                },
            ),
        ]
    )
    def test_orders_create_missing_required_field(
        self, product_with_missing_params, expected
    ):
        product_1 = ProductFactory()
        product_2 = ProductFactory()

        data = {
            "products": [
                {
                    "id": str(product_1.id),
                    "amount": 10,
                },
                {
                    "id": str(product_2.id),
                    "amount": 15,
                },
                product_with_missing_params,
            ],
            "menu_sets": [],
        }
        url = reverse("menu:orders-list")
        response = self.client.post(url, data, format="json")

        data = json.loads(json.dumps(response.data))
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(data, expected)

    def test_orders_delete(self):
        url = reverse("menu:orders-detail", args=[self.order.id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_orders_patch(self):
        url = reverse("menu:orders-detail", args=[self.order.id])
        data = {"order_id": "babcia"}
        response = self.client.patch(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_orders_put(self):
        url = reverse("menu:orders-detail", args=[self.order.id])
        data = {"order_id": "babcia"}
        response = self.client.put(url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    @freeze_time("2022-01-14 12:45:01.0002", tz_offset=1)
    def test_orders_finish_order(self):
        url = reverse("menu:orders-finish-order", args=[self.order.id])
        response = self.client.patch(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.order.refresh_from_db()
        self.assertEqual(self.order.finished_at, date(2022, 1, 14))


class TestMenuSetViewSet(APITestCase):
    def setUp(self):
        user = UserFactory()
        self.client.force_login(user)
        self.product = ProductFactory()
        self.menu_set = MenuSetFactory()

    def test_menu_set_list(self):
        step_1 = MenuSetStepFactory(menu_set=self.menu_set)
        step_2 = MenuSetStepFactory(menu_set=self.menu_set)

        with freeze_time("2022-01-14 12:45:01.0002", tz_offset=1):
            product_1_1 = ProductFactory()
        product_1_2 = ProductFactory()
        with freeze_time("2022-01-15 12:45:01.0002", tz_offset=1):
            product_2_1 = ProductFactory()
        with freeze_time("2022-01-16 12:45:01.0002", tz_offset=1):
            product_2_2 = ProductFactory()
        product_2_3 = ProductFactory()
        step_1.products.add(product_1_1)
        step_1.products.add(product_1_2)
        step_2.products.add(product_2_1)
        step_2.products.add(product_2_2)
        step_2.products.add(product_2_3)
        url = reverse("menu:menu-sets-list")

        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), MenuSet.objects.count())
        data = json.loads(json.dumps(response.data))

        self.assertEqual(
            data,
            [
                {
                    "id": str(self.menu_set.id),
                    "name": self.menu_set.name,
                    "set_steps": [
                        {
                            "name": step_1.name,
                            "products": [
                                {
                                    "id": str(product_1_1.id),
                                    "created_at": product_1_1.created_at.strftime(
                                        "%Y-%m-%dT%H:%M:%S.%fZ"
                                    ),
                                    "updated_at": product_1_1.updated_at.strftime(
                                        "%Y-%m-%dT%H:%M:%S.%fZ"
                                    ),
                                    "name": str(product_1_1.name),
                                    "image_url": None,
                                    "hex_color": None,
                                    "price": str(product_1_1.price),
                                },
                                {
                                    "id": str(product_1_2.id),
                                    "created_at": product_1_2.created_at.strftime(
                                        "%Y-%m-%dT%H:%M:%S.%fZ"
                                    ),
                                    "updated_at": product_1_2.updated_at.strftime(
                                        "%Y-%m-%dT%H:%M:%S.%fZ"
                                    ),
                                    "name": str(product_1_2.name),
                                    "image_url": None,
                                    "hex_color": None,
                                    "price": str(product_1_2.price),
                                },
                            ],
                        },
                        {
                            "name": step_2.name,
                            "products": [
                                {
                                    "id": str(product_2_1.id),
                                    "created_at": product_2_1.created_at.strftime(
                                        "%Y-%m-%dT%H:%M:%S.%fZ"
                                    ),
                                    "updated_at": product_2_1.updated_at.strftime(
                                        "%Y-%m-%dT%H:%M:%S.%fZ"
                                    ),
                                    "name": str(product_2_1.name),
                                    "image_url": None,
                                    "hex_color": None,
                                    "price": str(product_2_1.price),
                                },
                                {
                                    "id": str(product_2_2.id),
                                    "created_at": product_2_2.created_at.strftime(
                                        "%Y-%m-%dT%H:%M:%S.%fZ"
                                    ),
                                    "updated_at": product_2_2.updated_at.strftime(
                                        "%Y-%m-%dT%H:%M:%S.%fZ"
                                    ),
                                    "name": str(product_2_2.name),
                                    "image_url": None,
                                    "hex_color": None,
                                    "price": str(product_2_2.price),
                                },
                                {
                                    "id": str(product_2_3.id),
                                    "created_at": product_2_3.created_at.strftime(
                                        "%Y-%m-%dT%H:%M:%S.%fZ"
                                    ),
                                    "updated_at": product_2_3.updated_at.strftime(
                                        "%Y-%m-%dT%H:%M:%S.%fZ"
                                    ),
                                    "name": str(product_2_3.name),
                                    "image_url": None,
                                    "hex_color": None,
                                    "price": str(product_2_3.price),
                                },
                            ],
                        },
                    ],
                }
            ],
        )

    def test_menu_set_list_queries(self):
        step_1 = MenuSetStepFactory(menu_set=self.menu_set)
        step_2 = MenuSetStepFactory(menu_set=self.menu_set)

        product_1_1 = ProductFactory()
        product_1_2 = ProductFactory()
        product_2_1 = ProductFactory()
        product_2_2 = ProductFactory()
        product_2_3 = ProductFactory()
        step_1.products.add(product_1_1)
        step_1.products.add(product_1_2)
        step_2.products.add(product_2_1)
        step_2.products.add(product_2_2)
        step_2.products.add(product_2_3)
        url = reverse("menu:menu-sets-list")

        with self.assertNumQueries(5):
            response = self.client.get(url)

        # queries should not depend on amount of steps
        menu_set = MenuSetFactory()
        step_4 = MenuSetStepFactory(menu_set=menu_set)
        step_3 = MenuSetStepFactory(menu_set=self.menu_set)
        step_3.products.add(product_1_1)
        step_4.products.add(product_1_2)

        with self.assertNumQueries(5):
            response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
