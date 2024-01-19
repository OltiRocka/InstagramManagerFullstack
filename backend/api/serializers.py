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
    email = serializers.EmailField()
    profile_image = serializers.ImageField(allow_null=True, required=False)
    first_name = serializers.CharField(max_length=30)
    last_name = serializers.CharField(max_length=30)

    class Meta:
        model = User
        fields = ["username", "password", "email", "profile_image", "first_name", "last_name"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

class UpdateAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "first_name", "last_name"]
