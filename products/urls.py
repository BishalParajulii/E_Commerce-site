from django.urls import path
from .views import *

urlpatterns = [
    path("ui/", ProductCatalogPageView.as_view(), name="products-ui"),
    path("create/", ProductCreateView.as_view(), name="product-create"),
    path("categories/create/", CategoryCreateView.as_view(), name="category-create"),
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path("", ListProductView.as_view(), name="product-list"),
    path("detail/<int:id>/", ProductDetailView.as_view(), name="product-detail"),
    path("update/<int:id>/", ProductUpdateView.as_view(), name="product-update"),
    path("delete/<int:id>/", ProductDeleteView.as_view(), name="product-delete"),
    path("my-products/", MyProductView.as_view(), name="my-products"),
]
