from django.test import TestCase
from parameterized import parameterized
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APIClient, APITestCase

from tests.factories.user import UserFactory


class TestSignupViewSet(TestCase):
    def setUp(self):
        self.url = reverse("api:signup")
        self.client = APIClient()

    def test_success(self):
        data = {
            "username": "rrashley",
            "password": "xxxxxxx",
            "first_name": "Ashley",
            "last_name": "Raid",
            "email": "rileyraid@xxx.com",
        }
        response = self.client.post(self.url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            response.data,
            {
                "username": "rrashley",
                "first_name": "Ashley",
                "last_name": "Raid",
                "email": "rileyraid@xxx.com",
            },
        )

    @parameterized.expand(
        [
            "username",
            "password",
            "first_name",
            "last_name",
            "email",
        ]
    )
    def test_failed_missing_field(self, missing_field):
        data = {
            "username": "rrashley",
            "password": "xxxxxxx",
            "first_name": "Ashley",
            "last_name": "Raid",
            "email": "rileyraid@xxx.com",
        }
        data.pop(missing_field)
        response = self.client.post(self.url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {missing_field: ["This field is required."]})

    def test_failed_username_exists(self):
        username = "rrashley"
        UserFactory(username=username)
        data = {
            "username": username,
            "password": "xxxxxxx",
            "first_name": "Ashley",
            "last_name": "Raid",
            "email": "rileyraid@xxx.com",
        }
        response = self.client.post(self.url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("duplicate key value violates unique constraint", response.data)


class TestLoginViewSet(TestCase):
    def setUp(self):
        self.data = {
            "username": "rrashley",
            "password": "xxxxxxx",
        }
        self.user = UserFactory(username=self.data["username"])
        self.user.set_password(self.data["password"])
        self.user.save()
        self.url = reverse("api:login")
        self.client = APIClient()

    def test_success(self):
        response = self.client.post(self.url, self.data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data,
            {
                "username": "rrashley",
                "first_name": "",
                "last_name": "",
                "email": "",
            },
        )

    def test_wrong_password(self):
        data = {
            **self.data,
            "password": "PH",
        }
        response = self.client.post(self.url, data)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data, {"message": "Invalid credentials."})


class TestChangePasswordViewSet(TestCase):
    def setUp(self):
        self.data = {
            "password": "xxxxxxx",
        }
        self.user = UserFactory()
        self.user.set_password(self.data["password"])
        self.user.save()
        self.url = reverse("api:change-password")
        self.client = APIClient()

    def test_success(self):
        self.client.force_login(self.user)
        data = {
            "password": "xhamster",
        }
        response = self.client.patch(self.url, data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"message": "Password changed."})

    def test_is_not_authenticated(self):
        data = {
            "password": "xhamster",
        }
        response = self.client.patch(self.url, data)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn(
            "Authentication credentials were not provided",
            str(response.data),
        )


class MeViewTests(APITestCase):
    def setUp(self):
        self.data = {
            "username": "rrashley",
            "first_name": "Ashley",
            "last_name": "Raid",
            "email": "rileyraid@xxx.com",
        }
        self.user = UserFactory(**self.data)
        self.client = APIClient()
        self.url = reverse("api:me")

    def test_me_view_with_authenticated_user(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data,
            {
                "username": "rrashley",
                "first_name": "Ashley",
                "last_name": "Raid",
                "email": "rileyraid@xxx.com",
            },
        )

    def test_me_view_without_authentication(self):
        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class SessionLogoutViewTests(APITestCase):
    def setUp(self):
        self.user = UserFactory()
        self.client = APIClient()
        self.url = reverse("api:logout")

    def test_success(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"message": "Logout successful."})
