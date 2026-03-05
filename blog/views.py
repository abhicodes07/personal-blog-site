from django.shortcuts import get_object_or_404, render
from django.core.paginator import Paginator
from .models import Post


def home(request):
    recent_posts = Post.objects.filter(status="published").order_by("-published_date")[:5]
    featured_post = Post.objects.filter(status="published", featured=True).first()
    context = {
        "recent_posts": recent_posts,
        "featured_post": featured_post,
        # SEO
        "seo_title": "Abhinav Asthana — Writing on Design, Code & Systems",
        "seo_description": "Exploring the intersection of minimal aesthetics, functional programming, and the quiet pursuit of meaningful digital experiences.",
        "seo_url": request.build_absolute_uri("/"),
    }
    return render(request, "blog/home.html", context=context)


def post_list(request):
    all_posts = Post.objects.filter(status="published")
    page_number = request.GET.get("page", 1)

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
        "has_more": page_obj.has_next(),  # fixed: was has_next (missing call)
        "query_params": query_params.urlencode(),
        # SEO
        "seo_title": "All Writing — Abhinav Asthana",
        "seo_description": "Browse all published essays and posts by Abhinav Asthana on design, code, and systems thinking.",
        "seo_url": request.build_absolute_uri(request.path),
    }

    if request.htmx:
        return render(request, "blog/post_list_partial.html", context=context)
    return render(request, "blog/post_list.html", context=context)


def post_detail(request, slug):
    post = get_object_or_404(Post, slug=slug, status="published")

    # Build absolute URL for OG image if featured_image exists
    og_image = None
    if post.featured_image:
        og_image = request.build_absolute_uri(post.featured_image.url)

    context = {
        "post": post,
        # SEO
        "seo_title": f"{post.title} — Abhinav Asthana",
        "seo_description": post.excerpt or post.title,
        "seo_url": request.build_absolute_uri(request.path),
        "seo_image": og_image,
        "seo_type": "article",
        "seo_published": post.published_date.isoformat(),
        "seo_updated": post.updated_date.isoformat(),
    }
    return render(request, "blog/post_detail.html", context=context)
