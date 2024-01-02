from django.contrib import admin
from django.utils import timezone

from .models import (
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


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "price")
    list_filter = ["price"]
    search_fields = [
        "id",
        "name",
    ]


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "description")
    search_fields = [
        "id",
        "name",
    ]


@admin.register(Menu)
class MenuAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "start_date", "end_date", "is_active")
    search_fields = [
        "name",
        "start_date",
        "end_date",
    ]

    def is_active(self, obj: Menu):
        now = timezone.now()
        return not obj.end_date or (obj.end_date and now.date() < obj.end_date)

    is_active.boolean = True


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "order_id", "created_at", "is_active")
    list_filter = ["created_at"]
    search_fields = ["id", "order_id"]

    def is_active(self, obj):
        return obj.finished_at is not None

    is_active.boolean = True


@admin.register(ProductInOrderAmount)
class ProductInOrderAmountAdmin(admin.ModelAdmin):
    list_display = ("id", "product", "order", "amount")
    list_filter = ["amount"]
    search_fields = ["id" "product__name", "order__order_id"]


@admin.register(MenuSet)
class MenuSetAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "updated_at", "is_active")
    list_filter = ["is_active"]
    search_fields = ["id", "name"]


@admin.register(MenuSetStep)
class MenuSetStepAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "menu_set_name",
        "updated_at",
        "ordering_number",
        "is_active",
    )
    list_filter = ["is_active"]
    search_fields = ["id", "name"]

    def menu_set_name(self, obj):
        return obj.menu_set.name

    menu_set_name.short_description = "Menu Set Name"


@admin.register(MenuSetsInOrderAmount)
class MenuSetsInOrderAmountAdmin(admin.ModelAdmin):
    list_display = ("id", "menu_set", "order", "created_at")


@admin.register(OrderedProductsInMenuSetsOrder)
class OrderedProductsInMenuSetsOrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "menu_set_in_order",
        "product",
        "ordering_number",
    )
