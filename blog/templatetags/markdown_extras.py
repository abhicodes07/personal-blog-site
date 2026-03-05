import re
from django import template
from markdownx.utils import markdownify
from django.utils.safestring import mark_safe

register = template.Library()


@register.filter(name="markdown")
def render_markdown(text):
    """Renders Markdownx content with syntax-ready code blocks"""
    if not text:
        return ""

    html = markdownify(text)

    # Wrap tables in a responsive scroll container
    html = re.sub(r'(<table)', r'<div class="table-wrapper">\1', html)
    html = re.sub(r'(</table>)', r'\1</div>', html)

    return mark_safe(html)
