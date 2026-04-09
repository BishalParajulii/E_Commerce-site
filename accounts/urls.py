from django.urls import path
from .views import HomePageView, LoginView, LogoutPageView, RegistrationView

urlpatterns = [
    path("home/", HomePageView.as_view(), name="home"),
    path("register/", RegistrationView.as_view(), name="register"),
    path("signup/", RegistrationView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutPageView.as_view(), name="logout"),
]
