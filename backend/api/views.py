from django.shortcuts import render
from rest_framework import viewsets
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.token_blacklist.models import (
    BlacklistedToken,
    OutstandingToken,
)
from django.contrib.auth import authenticate
from .serializers import (
    InstagramUserSerializer,
    ContentSerializer,
    UserSerializer,
    LoginSerializer,
)
from .models import InstagramUser, Content


@api_view(["POST"])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.error)


@api_view(["POST"])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = authenticate(**serializer.validated_data)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response(
                {"refresh": str(refresh), "access": str(refresh.access_token)}
            )
    return Response(serializer.errors)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        token = RefreshToken(request.data.get("refresh"))
        token.blacklist()
        for outstanding_token in OutstandingToken.objects.filter(request.user):
            BlacklistedToken.objects.get_or_create(token=outstanding_token)
        return Response(status=204)
    except Exception as e:
        return Response(status=400)


class InstagramUserView(viewsets.ModelViewSet):
    serializer_class = InstagramUserSerializer
    queryset = InstagramUser.objects.all()


class ContentView(viewsets.ModelViewSet):
    serializer_class = ContentSerializer
    queryset = Content.objects.all()
