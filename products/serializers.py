from rest_framework import serializers
from .models import Product , Category

class ProductSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    category = serializers.CharField(source='category.name' , read_only=True)
    class Meta:
        model =Product
        fields = '__all__'
        
    
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'