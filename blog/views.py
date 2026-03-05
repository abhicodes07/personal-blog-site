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
    page_number = request.GET.get("page", 1)

    # filters
    query_params = request.GET.copy()
    if "page" in query_params:
        del query_params["page"]

    if "q" in query_params:
        all_posts = all_posts.filter(title__icontains=query_params["q"])

    if "sort" in query_params:
        sort_dir = "-" if query_params["sort"] == "newest" else ""
        all_posts = all_posts.order_by(f"{sort_dir}published_date")

    paginator = Paginator(all_posts, 5)
    page_obj = paginator.get_page(page_number)

    context = {
        "page_obj": page_obj,
        "total_posts": paginator.count,
        "has_more": page_obj.has_next,
        "query_params": query_params.urlencode(),
    }

    if request.htmx:
        return render(request, "blog/post_list_partial.html", context=context)
    return render(request, "blog/post_list.html", context=context)


def post_detail(request, slug):
    post = get_object_or_404(Post, slug=slug, status="published")
    context = {"post": post}
    return render(request, "blog/post_detail.html", context=context)
