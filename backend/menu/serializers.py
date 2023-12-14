from rest_framework import serializers

from .models import Category, Menu, Product


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
