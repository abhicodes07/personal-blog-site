from django.shortcuts import get_object_or_404, render
from django.views.generic import ListView, DetailView
from .models import Post

# Create your views here.


def home(request):
    recent_posts = Post.objects.filter(status="published").order_by("-published_date")[
        :5
    ]
    featured_post = Post.objects.filter(status="published", featured=True).first()
    context = {"recent_posts": recent_posts, "featured_post": featured_post}
    return render(request, "blog/home.html", context=context)


def post_list(request):
    all_posts = Post.objects.filter(status="published")
    context = {"all_posts": all_posts}
    return render(request, "blog/post_list.html", context=context)


def post_detail(request, slug):
    post = get_object_or_404(Post, slug=slug, status="published")
    context = {"post": post}
    return render(request, "blog/post_detail.html", context=context)
