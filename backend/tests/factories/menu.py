from factory import fuzzy
from factory.django import DjangoModelFactory

from menu.models import Category, Menu, Product


class ProductFactory(DjangoModelFactory):
    name = fuzzy.FuzzyText(length=12)
    price = fuzzy.FuzzyDecimal(0, pow(10, 6))

    class Meta:
        model = Product


class CategoryFactory(DjangoModelFactory):
    name = fuzzy.FuzzyText(length=12)

    class Meta:
        model = Category


class MenuFactory(DjangoModelFactory):
    name = fuzzy.FuzzyText(length=12)

    class Meta:
        model = Menu
