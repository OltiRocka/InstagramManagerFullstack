from rest_framework import serializers
from .models import InstagramUser, Content


class InstagramUserSerializer(serializers.ModelSerializer):
    """Scraped InstagramUser serializer"""

    class Meta:
        """Meta"""

        model = InstagramUser
        fields = (
            "id",
            "username",
            "is_private",
            "bio",
            "followers",
            "following",
            "profile_image",
            "num_content",
            "categories",
        )


class ContentSerializer(serializers.ModelSerializer):
    """Scraped Instagram Content serializer"""

    class Meta:
        """Meta"""

        model = Content
        fields = (
            "id",
            "type",
            "display_url",
            "url",
            "description",
            "views",
            "likes",
            "comments",
            "carousel",
            "categories",
            "owner",
        )
