from rest_framework import serializers
from .models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    profile_image = serializers.ImageField(allow_null=True, required=False)
    first_name = serializers.CharField(max_length=30)
    last_name = serializers.CharField(max_length=30)

    class Meta:
        model = CustomUser
        fields = [
            "password",
            "email",
            "profile_image",
            "first_name",
            "last_name",
        ]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class UpdateAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["email", "first_name", "last_name", "profile_image"]
