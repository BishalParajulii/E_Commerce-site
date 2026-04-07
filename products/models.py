from django.contrib import admin
from django.db import models
from django.conf import settings



# Register your models here.
User = settings.AUTH_USER_MODEL

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    
    def __str__(self):
        return self.name
    
class Product(models.Model):
    owner = models.ForeignKey(User , on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10 , decimal_places=2)
    category = models.ForeignKey(Category , on_delete=models.SET_NULL , null=True)
    stock = models.IntegerField()
    image = models.ImageField(upload_to='products/' , null=True , blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.name