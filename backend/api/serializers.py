from rest_framework import serializers
from .models import InstagramUser, Content
from django.contrib.auth.models import User


class InstagramUserSerializer(serializers.ModelSerializer):
    class Meta:
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
        )


class ContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Content
        fields = ("type", "url", "description", "views", "likes", "comments", "owner")


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "password", "email"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
