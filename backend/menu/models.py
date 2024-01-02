import uuid

from django.apps import apps
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models
from django.utils import timezone


class IsActiveModel(models.Model):
    is_active = models.BooleanField(default=True)

    class Meta:
        abstract = True


class UUIDModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class OrderedModel(models.Model):
    ordering_number = models.PositiveIntegerField(default=0)

    class Meta:
        abstract = True
        ordering = ["ordering_number"]


class Product(TimestampedModel, UUIDModel):
    name = models.CharField(max_length=255)
    image_url = models.URLField(blank=True, null=True)
    hex_color = models.CharField(
        max_length=7, blank=True, null=True, help_text="Hex color code, e.g., #RRGGBB"
    )
    price = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ["created_at"]


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

    class Meta:
        ordering = ["created_at"]


class MenuSet(IsActiveModel, UUIDModel, TimestampedModel):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ["created_at"]


class MenuSetStep(IsActiveModel, UUIDModel, TimestampedModel):
    name = models.CharField(max_length=255)
    menu_set = models.ForeignKey(
        MenuSet, related_name="set_steps", on_delete=models.DO_NOTHING
    )
    products = models.ManyToManyField(
        Product,
        blank=True,
        related_name="menu_set_steps",
    )
    ordering_number = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = [("name", "menu_set")]
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.menu_set.name} - {self.name}"


class Menu(TimestampedModel, UUIDModel):
    name = models.CharField(max_length=255)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    categories = models.ManyToManyField(Category, related_name="menus", blank=True)
    products = models.ManyToManyField(Product, related_name="menus", blank=True)
    menu_sets = models.ManyToManyField(MenuSet, related_name="menus", blank=True)

    class Meta:
        ordering = ["created_at"]

    def clean(self):
        if self.start_date and self.end_date and self.start_date > self.end_date:
            raise ValidationError("Start date cannot be later than end date.")

    # @property
    # def is_active(self):
    #     "Returns the person's full name."
    #     return f"{self.first_name} {self.last_name}"

    def __str__(self):
        return self.name


def order_id_default():
    MAX_ORDER_ID = 10000
    Order = apps.get_model("menu", "Order")
    last_order_of_the_day = Order.objects.filter(
        created_at__date=timezone.now().date()
    ).count()
    order_id_modulo = (last_order_of_the_day % MAX_ORDER_ID) + 1
    # date_time = timezone.now().strftime("%H%M")
    id = f"{order_id_modulo:04}"
    return id


class Order(TimestampedModel, UUIDModel):
    class PaymentMethods(models.TextChoices):
        BLIK = ("BL", "Blik")
        CASH = ("CS", "Cash")

    class DeliveryMethods(models.TextChoices):
        HERE = ("HR", "Here")
        TAKE_AWAY = ("TA", "Take away")

    finished_at = models.DateField(blank=True, null=True)
    products = models.ManyToManyField(
        Product, related_name="orders", through="ProductInOrderAmount"
    )
    menu_sets = models.ManyToManyField(
        MenuSet, related_name="orders", through="MenuSetsInOrderAmount"
    )
    order_id = models.CharField(
        editable=False, default=order_id_default, max_length=255
    )
    payment_method = models.CharField(max_length=2, default=PaymentMethods.CASH)
    is_paid = models.BooleanField(default=False)
    delivery_method = models.CharField(max_length=2, default=DeliveryMethods.HERE)

    def clean(self):
        if self.created_at and self.finished_at and self.created_at > self.finished_at:
            raise ValidationError("Start date cannot be later than end date.")

    def __str__(self):
        return self.order_id

    class Meta:
        ordering = ["created_at"]


class ProductInOrderAmount(models.Model):
    product = models.ForeignKey(Product, on_delete=models.DO_NOTHING)
    order = models.ForeignKey(Order, on_delete=models.DO_NOTHING)
    amount = models.PositiveIntegerField(validators=[MinValueValidator(1)])

    class Meta:
        unique_together = [("order", "product")]


class MenuSetsInOrderAmount(TimestampedModel):
    """Model represents relations of order and menu set with products ordered."""

    products = models.ManyToManyField(Product, through="OrderedProductsInMenuSetsOrder")
    menu_set = models.ForeignKey(MenuSet, on_delete=models.DO_NOTHING)
    order = models.ForeignKey(Order, on_delete=models.DO_NOTHING)
    amount = models.PositiveIntegerField(validators=[MinValueValidator(1)])


class OrderedProductsInMenuSetsOrder(OrderedModel):
    menu_set_in_order = models.ForeignKey(
        MenuSetsInOrderAmount, on_delete=models.DO_NOTHING
    )
    product = models.ForeignKey(Product, on_delete=models.DO_NOTHING)

    class Meta:
        unique_together = [("menu_set_in_order", "product", "ordering_number")]


# from django.db.models.signals import m2m_changed
# from django.dispatch import receiver


# @receiver(m2m_changed, sender=Category.sub_categories.through)
# def chuj(sender, instance, action, reverse, model, pk_set, **kwargs):
#     if action == "post_add" or action == "post_remove" or action == "post_clear":
#         print(model, kwargs, instance)
#         print(f"Authors of the book '{instance.title}' have been changed.")
