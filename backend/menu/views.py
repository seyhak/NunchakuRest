from django.utils import timezone
from rest_framework import decorators, mixins, status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Category, Menu, MenuSet, Order, Product
from .serializers import (
    CategorySerializer,
    MenuSerializer,
    MenuSetSerializer,
    OrderSerializer,
    ProductSerializer,
)


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class MenuViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Menu.objects.all()
    serializer_class = MenuSerializer

    def get_queryset(self):
        qs = (
            super()
            .get_queryset()
            .prefetch_related("menu_sets", "products", "categories")
        )
        return qs


class OrderViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    # mixins.UpdateModelMixin,
    #    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [IsAuthenticated]
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.request.method == "GET":
            return queryset.filter(finished_at__isnull=True)
        return queryset

    @decorators.action(
        url_name="finish-order", detail=True, methods=["patch"], url_path="finish-order"
    )
    def finish_order(self, request, pk=None):
        order: Order = self.get_object()
        order.finished_at = timezone.now()
        order.save()
        serializer = self.get_serializer(order)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)


class MenuSetViewSet(
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [IsAuthenticated]
    queryset = MenuSet.objects.all()
    serializer_class = MenuSetSerializer

    def get_queryset(self):
        qs = super().get_queryset().prefetch_related("set_steps__products")
        return qs
