from django.shortcuts import render
from rest_framework import generics
from .models import Product
from .serializers import ProductSerializer
from accounts.permissions import IsAdminOrSeller
from rest_framework.permissions import IsAuthenticated

class ProductCreateView(generics.CreateAPIView):
    queryset = Product.objects.all()
    serializer = ProductSerializer
    permission_classes = [IsAuthenticated , IsAdminOrSeller]
    
    def oerform_create(self , serializer):
        serializer.save(owner = self.request.user)