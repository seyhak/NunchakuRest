from factory import LazyAttribute, SubFactory, fuzzy
from factory.django import DjangoModelFactory

from menu.models import (
    Category,
    Menu,
    MenuSet,
    MenuSetsInOrderAmount,
    MenuSetStep,
    Order,
    OrderedProductsInMenuSetsOrder,
    Product,
    ProductInOrderAmount,
)


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


class OrderFactory(DjangoModelFactory):
    class Meta:
        model = Order


class ProductInOrderAmountFactory(DjangoModelFactory):
    amount = fuzzy.FuzzyInteger(1, 9999)

    class Meta:
        model = ProductInOrderAmount


class MenuSetFactory(DjangoModelFactory):
    name = fuzzy.FuzzyText()

    class Meta:
        model = MenuSet


class MenuSetStepFactory(DjangoModelFactory):
    name = fuzzy.FuzzyText()
    menu_set = SubFactory(MenuSetFactory)

    class Meta:
        model = MenuSetStep


class MenuSetsInOrderAmountFactory(DjangoModelFactory):
    menu_set = SubFactory(MenuSetFactory)
    order = SubFactory(OrderFactory)
    amount = fuzzy.FuzzyInteger(1, 9999)

    class Meta:
        model = MenuSetsInOrderAmount


class OrderedProductsInMenuSetsOrderFactory(DjangoModelFactory):
    menu_set_in_order = SubFactory(MenuSetsInOrderAmount)
    product = SubFactory(ProductFactory)
    ordering_number = LazyAttribute(
        lambda obj: OrderedProductsInMenuSetsOrder.objects.filter(
            product=obj.product, menu_set_in_order=obj.menu_set_in_order
        ).count()
        + 1
    )

    class Meta:
        model = OrderedProductsInMenuSetsOrder
