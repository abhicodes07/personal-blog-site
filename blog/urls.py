from django.contrib import admin
from django.urls import include, path
from .views import HomeView

app_name = "blog"

urlpatterns = [
    path("", HomeView.as_view(), name="home"),
]
