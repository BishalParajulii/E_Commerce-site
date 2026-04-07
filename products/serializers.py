from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    owner = serializer.ReadOnlyField(source='owner.username')
    
    class Meta:
        model =Product
        fields = '__all__'