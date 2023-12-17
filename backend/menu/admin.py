from django.contrib import admin
from django.utils import timezone

from .models import Category, Menu, Order, Product, ProductInOrderAmount


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

    def is_active(self, obj):
        now = timezone.now()
        return (obj.end_date and now < obj.end_date) or False

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
