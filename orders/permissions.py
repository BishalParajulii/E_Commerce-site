from rest_framework.permissions import BasePermission

class IsSellerOfOrder(BasePermission):
    def has_permission(self, request, view , obj):
        user = request.user
        return obj.items.filter(seller=user).exists() 