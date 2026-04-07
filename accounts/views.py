from django.shortcuts import render , redirect
from .models import User
from .serializers import RegistrationSerializer , LoginSerializeer
from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.contrib.auth import login, authenticate
from django.contrib import messages
from rest_framework_simplejwt.views import TokenObtainPairView


# Create your views here.
class RegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegistrationSerializer
    
class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializeer
    
    
    