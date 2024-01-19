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
    LoginSerializer,UpdateAccountSerializer
)
from .models import InstagramUser, Content
import json


@api_view(["POST"])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = authenticate(**serializer.validated_data)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response(
                {"refresh": str(refresh), "access": str(refresh.access_token)},
                status=status.HTTP_200_OK
            )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        token = RefreshToken(request.data.get("refresh"))
        token.blacklist()
        for outstanding_token in OutstandingToken.objects.filter(user=request.user):
            BlacklistedToken.objects.get_or_create(token=outstanding_token)
        return Response(status=status.HTTP_204_NO_CONTENT)
    except Exception as e:
        return Response({"Error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_account(request):
    try:
        user = request.user
        serializer = UpdateAccountSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"Error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class InstagramUserView(viewsets.ModelViewSet):
    serializer_class = InstagramUserSerializer
    queryset = InstagramUser.objects.all()


class ContentView(viewsets.ModelViewSet):
    serializer_class = ContentSerializer
    queryset = Content.objects.all()
