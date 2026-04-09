from django.urls import path
from .views import *


urlpatterns = [
    path("ui/", OrdersDashboardView.as_view(), name="orders-dashboard"),
    path("create/", OrderCreateView.as_view(), name="order-create"),
    path("my-orders/", ViewOrdersView.as_view(), name="view-orders"),
    path("seller-orders/", ViewSellerOrdersView.as_view(), name="view-seller-orders"),
    path("update/<int:pk>/", UpdateOrderView.as_view(), name="update-order"),
]
