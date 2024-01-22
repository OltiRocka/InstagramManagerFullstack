"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from api import views as api_views
from authentication import views as auth_views
from django.conf import settings
from django.conf.urls.static import static

api = routers.DefaultRouter()
api.register(r"users", api_views.InstagramUserView, "user")
api.register(r"content", api_views.ContentView, "content")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(api.urls)),
    path("auth/signup/", auth_views.SignupView.as_view(), name="signup"),
    path("auth/login/", auth_views.LoginView.as_view(), name="login"),
    path("auth/logout/", auth_views.LogoutView.as_view(), name="logout"),
    path("auth/profile/", auth_views.AccountView.as_view(), name="profile"),
    path(
        "insta/username/",
        api_views.InstagramDataView.as_view(),
        name="content_username",
    ),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
