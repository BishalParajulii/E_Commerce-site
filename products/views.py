from django.shortcuts import render
from rest_framework import generics
from .models import Product
from .serializers import ProductSerializer
from accounts.permissions import IsAdminOrSeller
from rest_framework.permissions import IsAuthenticated



class ProductCreateView(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_classes = ProductSerializer
    permission_classes = [IsAuthenticated , IsAdminOrSeller]
    
    def perform_create(self , serializer):
        serializer.save(owner = self.request.user)
        
        
        
class ListProductView(generics.ListAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_classes = ProductSerializer
    lookup_field = 'id'
    permission_classes = [IsAuthenticated]
    

class ProductUpdateView(generics.UpdateAPIView):
    queryset = Product.objects.all()
    serializer_classes = ProductSerializer
    permission_classes = [IsAuthenticated , IsAdminOrSeller]
    

class ProductDeleteView(generics.DestroyAPIView):
    queryset = Product.objects.all()
    serializer_classes = ProductSerializer
    permission_classes = [IsAuthenticated , IsAdminOrSeller]
    
    
    
class MyProductView(generics.ListAPIView):
    serializer_classes = ProductSerializer
    permission_classes = [IsAuthenticated , IsAdminOrSeller]
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role == 'admin':
            return Product.objects.all()
        return Product.objects.filter(owner=user)