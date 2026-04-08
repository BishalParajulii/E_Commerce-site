from django.db import models
from django.conf import settings
from products.models import Product

User = settings.AUTH_USER_MODEL

# Create your models here.
class Order(models.Model):
    STSTUS_CODE = (
        ('pending' , 'Pending'),
        ('processing' , 'Processing'),
        ('shipped' , 'Shipping'),
        ('delivered' , 'Delivered')
    )
    
    user = models.ForeignKey(User , on_delete=models.CASCADE , related_name='orders')
    total_price = models.DecimalField(max_digits=10 , decimal_places=2 , default=0.00)
    ststus = models.CharField(max_length=20 , choices=STSTUS_CODE , default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"order {self.id} - {self.user}"
    

class OrderItem(models.Model):
    order = models.ForeignKey(Order , on_delete=models.CASCADE , related_name='items')
    product = models.ForeignKey(Product , on_delete=models.CASCADE)
    seller = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10 , decimal_places=2)
    
    def __str__(self):
        return f"{self.product.name} ({self.quantity})"