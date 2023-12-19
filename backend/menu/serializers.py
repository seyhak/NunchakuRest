from django.db import transaction
from rest_framework import serializers

from .models import Category, Menu, Order, Product, ProductInOrderAmount


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"

    def get_name(self):
        return _(self.name)


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class ProductDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"


class CategoryDetailSerializer(serializers.ModelSerializer):
    sub_categories = serializers.SerializerMethodField()
    products = ProductDetailSerializer(many=True)

    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "description",
            "image_url",
            "hex_color",
            "sub_categories",
            "products",
        ]

    def get_sub_categories(self, obj):
        data = obj.sub_categories.all()
        data = CategoryDetailSerializer(obj.sub_categories.all(), many=True).data
        return data


class MenuSerializer(serializers.ModelSerializer):
    categories = CategoryDetailSerializer(many=True)
    products = ProductDetailSerializer(many=True)

    class Meta:
        model = Menu
        fields = "__all__"


class ProductInOrderAmountSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductInOrderAmount

    def to_representation(self, instance):
        return {
            "id": str(instance.product.id),
            "amount": instance.amount,
            "name": instance.product.name,
        }


class ProductInOrderAmountOfOrderSerializer(serializers.Serializer):
    amount = serializers.IntegerField(min_value=1, required=True)
    id = serializers.CharField(required=True)


class OrderUpdateSerializer(serializers.Serializer):
    products = ProductInOrderAmountOfOrderSerializer(many=True, required=True)


class OrderSerializer(serializers.ModelSerializer):
    products = ProductInOrderAmountOfOrderSerializer(many=True, required=True)

    def validate_products(self, value):
        product_ids = [v["id"] for v in value]
        are_all_product_exists = Product.objects.filter(
            id__in=product_ids
        ).count() == len(product_ids)
        if are_all_product_exists:
            return value
        raise serializers.ValidationError("Some of requested products don't exist!")

    class Meta:
        model = Order
        fields = ["products", "delivery_method", "payment_method"]

    def get_repr_products(self, instance):
        products_in_order = list(
            ProductInOrderAmount.objects.filter(order=instance).select_related(
                "product"
            )
        )
        return ProductInOrderAmountSerializer(products_in_order, many=True).data

    def create(self, validated_data):
        FIELDS_FOR_CREATE_ORDER = ["delivery_method", "payment_method"]

        create_order_data = {
            f: validated_data.get(f)
            for f in FIELDS_FOR_CREATE_ORDER
            if validated_data.get(f)
        }
        try:
            with transaction.atomic():
                order = Order.objects.create(**create_order_data)
                data_for_bulk = [
                    ProductInOrderAmount(
                        order_id=order.id, product_id=v["id"], amount=v["amount"]
                    )
                    for v in validated_data["products"]
                ]
                ProductInOrderAmount.objects.bulk_create(data_for_bulk)
                return order
        except Exception as e:
            print(e)
            return None

    def to_representation(self, instance: Order):
        return {
            "id": str(instance.id),
            "products": self.get_repr_products(instance),
            "order_id": instance.order_id,
            "payment_method": instance.payment_method,
            "is_paid": instance.is_paid,
            "delivery_method": instance.delivery_method,
            "created_at": instance.created_at.isoformat(),
        }
