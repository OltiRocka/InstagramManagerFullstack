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
import requests

class InstagramUserView(viewsets.ModelViewSet):
    serializer_class = InstagramUserSerializer
    queryset = InstagramUser.objects.all()


class ContentView(viewsets.ModelViewSet):
    serializer_class = ContentSerializer
    queryset = Content.objects.all()

class InstagramDataView(APIView):
    def get(self, request, format=None):
        data = request.json
        search_type = data.get('search','username')
        param = data.get('param')
        if not param:
            return Response("Please provide a search parameter", status=400)
        if search_type == 'username':
            pass
        elif search_type == 'hashtag':
            pass
        else:
            return Response("Please provide a valid search type", status=400)