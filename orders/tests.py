from decimal import Decimal

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import User
from products.models import Category, Product
from .models import Order


class OrderFlowTests(APITestCase):
    def setUp(self):
        self.customer = User.objects.create_user(
            username="customer1",
            password="testpass123",
            role="customer",
        )
        self.seller = User.objects.create_user(
            username="seller1",
            password="testpass123",
            role="seller",
        )
        self.other_seller = User.objects.create_user(
            username="seller2",
            password="testpass123",
            role="seller",
        )
        self.category = Category.objects.create(name="Electronics", slug="electronics")
        self.product = Product.objects.create(
            owner=self.seller,
            name="Keyboard",
            slug="keyboard",
            description="Mechanical keyboard",
            price=Decimal("99.99"),
            category=self.category,
            stock=5,
            is_active=True,
        )

    def test_customer_can_place_order_and_stock_is_reduced(self):
        self.client.force_authenticate(user=self.customer)

        response = self.client.post(
            reverse("order-create"),
            {"items": [{"product": self.product.id, "quantity": 2}]},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.product.refresh_from_db()
        order = Order.objects.get()

        self.assertEqual(order.total_price, Decimal("199.98"))
        self.assertEqual(order.items.count(), 1)
        self.assertEqual(self.product.stock, 3)

    def test_order_is_rejected_when_quantity_exceeds_stock(self):
        self.client.force_authenticate(user=self.customer)

        response = self.client.post(
            reverse("order-create"),
            {"items": [{"product": self.product.id, "quantity": 8}]},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Order.objects.count(), 0)

    def test_seller_orders_include_seller_total(self):
        self.client.force_authenticate(user=self.customer)
        second_product = Product.objects.create(
            owner=self.other_seller,
            name="Mouse",
            slug="mouse",
            description="Wireless mouse",
            price=Decimal("50.00"),
            category=self.category,
            stock=3,
            is_active=True,
        )
        self.client.post(
            reverse("order-create"),
            {
                "items": [
                    {"product": self.product.id, "quantity": 2},
                    {"product": second_product.id, "quantity": 1},
                ]
            },
            format="json",
        )

        self.client.force_authenticate(user=self.seller)
        response = self.client.get(reverse("view-seller-orders"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["seller_total"], "199.98")
        self.assertEqual(response.data[0]["seller_item_count"], 2)
