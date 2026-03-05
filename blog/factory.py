import factory
from factory.django import DjangoModelFactory
from factory.fuzzy import FuzzyText, FuzzyDate
from blog.models import Post
from django.utils import timezone


class PostFactory(DjangoModelFactory):
    class Meta:
        model = Post

    title = FuzzyText(length=50)  # e.g., "Test Blog Post: Why Django Rocks"
    slug = factory.faker.Faker("slug")
    excerpt = FuzzyText(length=100)  # Short preview
    content = factory.LazyAttribute(
        lambda obj: "# "
        + obj.title
        + "\n\nThis is **Markdown** content for testing. *Italic* and [links](https://example.com)."
    )  # Basic Markdown header + body
    status = "published"

    @factory.post_generation
    def slug_generation(self, create, extracted, **kwargs):
        """Post-generation hook: Save the post to trigger slug auto-generation."""
        if create:  # Only if we're creating (not building)
            self.save()  # Calls model's save(), generating slug from title
