from django.shortcuts import render
from rest_framework import generics
from .models import Product , Category
from .serializers import ProductSerializer  , CategorySerializer
from accounts.permissions import IsAdminOrSeller
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from rest_framework.filters import OrderingFilter
from rest_framework.permissions import IsAuthenticated


class ProductCreateView(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated , IsAdminOrSeller]
    
    def perform_create(self , serializer):
        serializer.save(owner = self.request.user)
        

class CategoryCreateView(generics.CreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated , IsAdminOrSeller]
    
class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
        
        
        
class ListProductView(generics.ListAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend , SearchFilter , OrderingFilter]
    filterset_fields = ['category' , 'price']
    search_fields = ['name' , 'description']
    ordering_fields = ['price' , 'created_at']
    


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'id'
    permission_classes = [IsAuthenticated]
    

class ProductUpdateView(generics.UpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated , IsAdminOrSeller]
    

class ProductDeleteView(generics.DestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated , IsAdminOrSeller]
    
    
    
class MyProductView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated , IsAdminOrSeller]
    
    def get_queryset(self):
        user = self.request.user
        
        if user.role == 'admin':
            return Product.objects.all()
        return Product.objects.filter(owner=user)