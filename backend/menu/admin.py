from django.contrib import admin
from django.utils import timezone

from .models import Category, Menu, Product


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
