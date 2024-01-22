from rest_framework import viewsets
from rest_framework.views import APIView
from .serializers import (
    InstagramUserSerializer,
    ContentSerializer,
)
from .models import InstagramUser, Content
from rest_framework.response import Response
from utils.request import Session


class InstagramUserView(viewsets.ModelViewSet):
    serializer_class = InstagramUserSerializer
    queryset = InstagramUser.objects.all()


class ContentView(viewsets.ModelViewSet):
    serializer_class = ContentSerializer
    queryset = Content.objects.all()


class InstagramDataView(APIView):
    def post(self, request, format=None):
        data = request.data
        search_type = data.get("search", "username")
        param = data.get("param", None)
        categories = (
            data.get("categories", None)
            if type(data.get("categories", [])) == list
            else [data.get("categories", None)]
        )
        session = Session()
        if not param:
            return Response("Please provide a search parameter", status=400)
        if not categories:
            return Response(
                "Please provide a category or more for the account", status=400
            )
        if search_type == "username":
            data = session.get_by_username(param)

            # Use get_or_create to handle the case where the user does not exist
            insta_user, created = InstagramUser.objects.get_or_create(
                id=data.get("id"),
                defaults={
                    "username": data.get("username"),
                    "is_private": data.get("is_private"),
                    "bio": data.get("bio"),
                    "followers": data.get("followers"),
                    "following": data.get("following"),
                    "profile_image": data.get("profile_image"),
                    "num_content": data.get("num_content"),
                },
            )
            if not created:
                categories.extend(insta_user.get_list_field())
            insta_user.set_list_field(categories)
            insta_user.save()

            for i in data.get("content", []):
                content = Content(
                    id=i.get("id"),
                    type=i.get("type"),
                    display_url=i.get("display_url"),
                    url=i.get("url"),
                    description=i.get("description"),
                    views=i.get("views"),
                    likes=i.get("likes"),
                    comments=i.get("comments"),
                    carousel=i.get("carousel"),
                    owner=insta_user,
                )
                content.set_list_field(categories)
                content.save()
            return Response("Content grabbed successfully", status=200)

        elif search_type == "hashtag":
            return Response("Please provide a valid search type", status=400)

        else:
            return Response("Please provide a valid search type", status=400)
