from django.db import transaction
from rest_framework import serializers
from products.models import Product
from .models import Order, OrderItem


class OrderItemCreateSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.filter(is_active=True)
    )

    class Meta:
        model = OrderItem
        fields = ["product", "quantity"]


class OrderItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(source="product.id", read_only=True)
    product_name = serializers.CharField(source="product.name", read_only=True)
    seller_username = serializers.CharField(source="seller.username", read_only=True)
    seller_id = serializers.IntegerField(source="seller.id", read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            "product_id",
            "product_name",
            "seller_id",
            "seller_username",
            "quantity",
            "price",
        ]


class OrderSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="user.username", read_only=True)
    status = serializers.CharField(source="ststus", read_only=True)
    items = OrderItemCreateSerializer(many=True, write_only=True)
    order_items = OrderItemSerializer(source="items", many=True, read_only=True)
    seller_total = serializers.SerializerMethodField()
    seller_item_count = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "total_price",
            "status",
            "items",
            "order_items",
            "seller_total",
            "seller_item_count",
            "created_at",
        ]
        read_only_fields = [
            "user",
            "total_price",
            "status",
            "created_at",
            "seller_total",
            "seller_item_count",
        ]

    def get_seller_total(self, obj):
        request = self.context.get("request")
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated:
            return str(obj.total_price)

        seller_total = sum(
            item.price for item in obj.items.all() if item.seller_id == user.id
        )
        return str(seller_total)

    def get_seller_item_count(self, obj):
        request = self.context.get("request")
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated:
            return obj.items.count()

        return sum(
            item.quantity for item in obj.items.all() if item.seller_id == user.id
        )

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("Add at least one item to place an order.")
        return value

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop("items")
        user = self.context["request"].user
        order = Order.objects.create(user=user)
        total_price = 0

        for item in items_data:
            product = item["product"]
            quantity = item["quantity"]

            # Lock product rows while checking stock so concurrent orders stay consistent.
            product = Product.objects.select_for_update().get(pk=product.pk)

            if product.owner == user:
                raise serializers.ValidationError(
                    f"You cannot order your own product: {product.name}."
                )

            if quantity < 1:
                raise serializers.ValidationError(
                    f"Quantity must be at least 1 for {product.name}."
                )

            if product.stock < quantity:
                raise serializers.ValidationError(
                    f"Only {product.stock} item(s) left for {product.name}."
                )

            price = product.price * quantity
            total_price += price

            OrderItem.objects.create(
                order=order,
                product=product,
                seller=product.owner,
                quantity=quantity,
                price=price,
            )

            product.stock -= quantity
            product.save(update_fields=["stock", "updated_at"])

        order.total_price = total_price
        order.save()
        return order


class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    status = serializers.ChoiceField(source="ststus", choices=Order.STSTUS_CODE)

    class Meta:
        model = Order
        fields = ["id", "status"]
