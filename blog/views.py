from django.core import paginator
from django.shortcuts import get_object_or_404, render
from django.core.paginator import Paginator
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
    paginator = Paginator(all_posts, 10)

    page_number = request.GET.get("page", 1)
    page_obj = paginator.get_page(page_number)

    context = {"page_obj": page_obj, "total_posts": paginator.count}

    if request.htmx:
        return render(request, "blog/partials/post_list_partial.html", context=context)
    return render(request, "blog/post_list.html", context=context)


def post_detail(request, slug):
    post = get_object_or_404(Post, slug=slug, status="published")
    context = {"post": post}
    return render(request, "blog/post_detail.html", context=context)
