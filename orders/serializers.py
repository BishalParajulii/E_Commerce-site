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

    class Meta:
        model = OrderItem
        fields = [
            "product_id",
            "product_name",
            "seller_username",
            "quantity",
            "price",
        ]


class OrderSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="user.username", read_only=True)
    status = serializers.CharField(source="ststus", read_only=True)
    items = OrderItemCreateSerializer(many=True, write_only=True)
    order_items = OrderItemSerializer(source="items", many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "user",
            "total_price",
            "status",
            "items",
            "order_items",
            "created_at",
        ]
        read_only_fields = ["user", "total_price", "status", "created_at"]

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        user = self.context["request"].user
        order = Order.objects.create(user=user)
        total_price = 0

        for item in items_data:
            product = item["product"]
            quantity = item["quantity"]

            if product.owner == user:
                raise serializers.ValidationError(
                    f"You cannot order your own product: {product.name}."
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

        order.total_price = total_price
        order.save()
        return order


class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    status = serializers.ChoiceField(source="ststus", choices=Order.STSTUS_CODE)

    class Meta:
        model = Order
        fields = ["id", "status"]
