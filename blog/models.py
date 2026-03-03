from django.db import models
from django.urls import reverse
from markdownx.models import MarkdownxField


# Create your models here.
class Post(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, help_text="URL-friendly name")
    content = MarkdownxField()  # ← magic Markdown field
    excerpt = models.TextField(blank=True)  # Short text of content
    featured_image = models.ImageField(upload_to="posts/", blank=True)
    published_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    status = models.CharField(
        max_length=10,
        choices=[("draft", "Draft"), ("published", "Published")],
        default="draft",
    )
    featured = models.BooleanField(default=False)

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("blog:post_detail", args=[self.slug])

    class Meta:
        ordering = ["-published_date"]
