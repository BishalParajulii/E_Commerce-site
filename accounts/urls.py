from django.urls import path
from .views import HomePageView, LoginView, LogoutPageView, RegistrationView

urlpatterns = [
    path("", HomePageView.as_view(), name="root"),
    path("home/", HomePageView.as_view(), name="home"),
    path("signup/", RegistrationView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutPageView.as_view(), name="logout"),
]
