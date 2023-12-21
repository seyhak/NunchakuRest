from django.db import transaction
from rest_framework import serializers

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


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"

    def get_name(self):
        return self.name


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


class MenuSetSerializer(serializers.ModelSerializer):
    def get_set_steps_to_representation(self, instance: MenuSet):
        set_steps = list(instance.set_steps.all())
        return MenuSetStepsSerializer(set_steps, many=True).data

    class Meta:
        model = MenuSet
        fields = ["name", "set_steps"]

    def to_representation(self, instance: MenuSet):
        return {
            "id": str(instance.id),
            "name": instance.name,
            "set_steps": self.get_set_steps_to_representation(instance),
        }


class MenuSerializer(serializers.ModelSerializer):
    categories = CategoryDetailSerializer(many=True)
    products = ProductDetailSerializer(many=True)
    menu_sets = MenuSetSerializer(many=True)

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


class MenuSetsInOrderAmountSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuSetsInOrderAmount

    def to_representation(self, instance: MenuSetsInOrderAmount):
        return {
            "id": str(instance.menu_set.id),
            "name": instance.menu_set.name,
            "amount": instance.amount,
            "products": ", ".join(
                instance.products.order_by(
                    "orderedproductsinmenusetsorder__ordering_number"
                ).values_list("name", flat=True)
            ),
        }


class ProductInOrderAmountOfOrderSerializer(serializers.Serializer):
    amount = serializers.IntegerField(min_value=1, required=True)
    id = serializers.CharField(required=True)


class MenuSetsProducts(serializers.Serializer):
    id = serializers.CharField(required=True)


class MenuSetsInOrderSerializer(serializers.Serializer):
    amount = serializers.IntegerField(min_value=1, required=True)
    id = serializers.CharField(required=True)
    products = MenuSetsProducts(many=True, required=True)


class OrderUpdateSerializer(serializers.Serializer):
    products = ProductInOrderAmountOfOrderSerializer(many=True, required=True)


class OrderSerializer(serializers.ModelSerializer):
    products = ProductInOrderAmountOfOrderSerializer(many=True, required=True)
    menu_sets = MenuSetsInOrderSerializer(many=True, required=True)

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
        fields = ["products", "delivery_method", "payment_method", "menu_sets"]

    def get_repr_products(self, instance):
        products_in_order = list(
            ProductInOrderAmount.objects.filter(order=instance).select_related(
                "product"
            )
        )
        return ProductInOrderAmountSerializer(products_in_order, many=True).data

    def get_repr_menu_sets(self, instance):
        menu_sets = list(
            MenuSetsInOrderAmount.objects.filter(order=instance)
            .order_by("created_at")
            .select_related("menu_set")
            .prefetch_related("products")
        )
        return MenuSetsInOrderAmountSerializer(menu_sets, many=True).data

    def bulk_create_product_in_order_amount(self, validated_data, order):
        data_for_bulk = [
            ProductInOrderAmount(
                order_id=order.id, product_id=v["id"], amount=v["amount"]
            )
            for v in validated_data["products"]
        ]
        ProductInOrderAmount.objects.bulk_create(data_for_bulk)

    def bulk_create_menu_sets_in_order_amount(self, validated_data, order):
        bulk_data = []
        for v in validated_data["menu_sets"]:
            products_ids = [product["id"] for product in v["products"]]
            # hard to optimize
            menu_set_in_order_amount = MenuSetsInOrderAmount.objects.create(
                order=order,
                menu_set_id=v["id"],
                amount=v["amount"],
            )
            for i, product_id in enumerate(products_ids):
                # OrderedProductsInMenuSetsOrder.objects.create(
                #     menu_set_in_order=menu_set_in_order_amount,
                #     product_id=product_id,
                #     ordering_number=i
                # )
                ordered_product = OrderedProductsInMenuSetsOrder(
                    menu_set_in_order_id=menu_set_in_order_amount.id,
                    product_id=product_id,
                    ordering_number=i,
                )
                bulk_data.append(ordered_product)

        with transaction.atomic():
            OrderedProductsInMenuSetsOrder.objects.bulk_create(bulk_data)

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
                self.bulk_create_product_in_order_amount(validated_data, order)
                self.bulk_create_menu_sets_in_order_amount(validated_data, order)
                return order
        except Exception as e:
            print(e)
            return None

    def to_representation(self, instance: Order):
        return {
            "id": str(instance.id),
            "menu_sets": self.get_repr_menu_sets(instance),
            "products": self.get_repr_products(instance),
            "order_id": instance.order_id,
            "payment_method": instance.payment_method,
            "is_paid": instance.is_paid,
            "delivery_method": instance.delivery_method,
            "created_at": instance.created_at.isoformat(),
        }


class MenuSetStepsSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuSetStep
        fields = ["name", "products"]

    def to_representation(self, instance: MenuSetStep):
        return {
            "name": instance.name,
            "products": ProductDetailSerializer(
                instance.products.all(), many=True
            ).data,
        }
