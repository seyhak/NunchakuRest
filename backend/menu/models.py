import uuid

from django.apps import apps
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models
from django.utils import timezone


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
        "self",
        blank=True,
        symmetrical=False,
        related_name="parent_category",
        limit_choices_to=~models.Q(id=models.F("id")),
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
    order_id = models.CharField(editable=False, default=order_id_default)
    payment_method = models.CharField(max_length=2, default=PaymentMethods.CASH)
    is_paid = models.BooleanField(default=False)
    delivery_method = models.CharField(max_length=2, default=DeliveryMethods.HERE)

    def clean(self):
        if self.created_at and self.finished_at and self.created_at > self.finished_at:
            raise ValidationError("Start date cannot be later than end date.")

    def __str__(self):
        return self.order_id


class ProductInOrderAmount(models.Model):
    product = models.ForeignKey(Product, on_delete=models.DO_NOTHING)
    order = models.ForeignKey(Order, on_delete=models.DO_NOTHING)
    amount = models.PositiveIntegerField(validators=[MinValueValidator(1)])

    class Meta:
        unique_together = [("order", "product")]


# from django.db.models.signals import m2m_changed
# from django.dispatch import receiver


# @receiver(m2m_changed, sender=Category.sub_categories.through)
# def chuj(sender, instance, action, reverse, model, pk_set, **kwargs):
#     if action == "post_add" or action == "post_remove" or action == "post_clear":
#         print(model, kwargs, instance)
#         print(f"Authors of the book '{instance.title}' have been changed.")
