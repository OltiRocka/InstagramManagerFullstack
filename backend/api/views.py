from rest_framework import viewsets
from rest_framework.views import APIView
from .serializers import (
    InstagramUserSerializer,
    ContentSerializer,
)
from .models import InstagramUser, Content
from rest_framework.response import Response
from utils.request import Session
import requests
from django.core.files import File
from io import BytesIO


class InstagramUserView(viewsets.ModelViewSet):
    serializer_class = InstagramUserSerializer
    queryset = InstagramUser.objects.all()



class ContentView(viewsets.ModelViewSet):
    serializer_class = ContentSerializer

    def get_queryset(self):
        queryset = Content.objects.all()
        owner = self.request.query_params.get("owner", None)
        if owner is not None:
            queryset = queryset.filter(owner=owner)
        return queryset


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
            print(f"No param provided for {search_type}")
            return Response("Please provide a search parameter", status=400)
        if not categories:
            print("No categories provided")
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
                    "num_content": data.get("num_content"),
                },
            )
            response = requests.get(data.get("profile_image"))

            if response.status_code == 200:
                # Create a File object from the downloaded content
                image_content = response.content
                image_name = f"{insta_user.username}.jpg"
                image_file = File(BytesIO(image_content), name=image_name)

                # Assign the File object to the profile_image field
                insta_user.profile_image.save(image_name, image_file)

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
            print("Hashtag not Implementet Yet")
            return Response("Please provide a valid search type", status=400)

        else:
            return Response("Please provide a valid search type", status=400)
