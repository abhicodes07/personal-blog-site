from django.contrib import admin
from django.urls import include, path
from . import views

app_name = "blog"

urlpatterns = [
    path("", views.home, name="home"),
    path("blog/", views.post_list, name="post_list"),
    path("blog/<slug:slug>/", views.post_detail, name="post_detail"),
    path("about/", views.about, name="about"),
]
