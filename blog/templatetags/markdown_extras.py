from django import template
from markdownx.utils import markdownify
from django.utils.safestring import mark_safe

register = template.Library()


@register.filter(name="markdown")
def render_markdown(text):
    """Renders Markdownx content with syntax-ready code blocks"""
    if not text:
        return ""
    return mark_safe(markdownify(text))
