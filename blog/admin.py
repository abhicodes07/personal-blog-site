from django.contrib import admin
from markdownx.admin import MarkdownxModelAdmin
from .models import Post


@admin.register(Post)
class PostAdmin(MarkdownxModelAdmin):
    list_display = ("title", "published_date", "status")
    list_filter = ("status", "published_date")
    search_fields = ("title", "content")
    prepopulated_fields = {"slug": ("title",)}
