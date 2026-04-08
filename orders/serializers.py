from rest_framework import serializers
from .models import Order , OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['product' , 'quantity']
        
    
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    
    class Meta:
        model = Order
        fields = ['id' , 'user' , 'total_price' , 'status' , 'items']
        read_only_fields = ['user' , 'total_price' , 'status']
        
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        user = self.context['request'].user
        
        order = Order.objects.create(user=user)
        
        total_price = 0
        
        for item in items_data:
            product = item['product']
            quantity = item['quantiy']
            
            if product.owner == user:
                raise serializers.ValidationError("You cannot order your own product. {product.name}")
            
            price = product.price * quantity
            total_price += price
            
            OrderItem.objects.create(
                order = order,
                product = product,
                seller = product.owner,
                quantity = quantity,
                price = price
            )
        order.total_price = total_price
        order.save()
        return order