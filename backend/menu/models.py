import uuid
from datetime import datetime

from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator
from django.db import models


class UUIDModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Product(TimestampedModel, UUIDModel):
    name = models.CharField(max_length=255)
    image_url = models.URLField(blank=True, null=True)
    hex_color = models.CharField(
        max_length=7, blank=True, null=True, help_text="Hex color code, e.g., #RRGGBB"
    )
    price = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self):
        return self.name


class Category(TimestampedModel, UUIDModel):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    hex_color = models.CharField(
        max_length=7, blank=True, null=True, help_text="Hex color code, e.g., #RRGGBB"
    )
    sub_categories = models.ManyToManyField(
        "self", blank=True, symmetrical=False, related_name="parent_category"
    )
    products = models.ManyToManyField(Product, blank=True, related_name="category")

    def __str__(self):
        return self.name


class Menu(TimestampedModel, UUIDModel):
    name = models.CharField(max_length=255)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    categories = models.ManyToManyField(Category, related_name="menus", blank=True)
    products = models.ManyToManyField(Product, related_name="menus", blank=True)

    def clean(self):
        if self.start_date and self.end_date and self.start_date > self.end_date:
            raise ValidationError("Start date cannot be later than end date.")

    def __str__(self):
        return self.name
