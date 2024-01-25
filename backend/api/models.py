import json
import os
from django.db import models
from django.conf import settings


# Create your models here.
class InstagramUser(models.Model):
    """Scaped Users"""

    id = models.CharField(max_length=40, primary_key=True)
    username = models.CharField(max_length=40)
    is_private = models.BooleanField(default=True)
    bio = models.TextField()
    followers = models.IntegerField(default=0)
    categories = models.TextField()
    following = models.IntegerField(default=0)
    profile_image = models.ImageField(upload_to="media/images/")
    num_content = models.IntegerField(default=0)

    def set_list_field(self, data):
        self.categories = json.dumps(data)

    def get_list_field(self):
        if self.categories:
            return json.loads(self.categories)
        return []

    def __str__(self):
        return str(self.username)

    def delete(self, *args, **kwargs):
        if self.profile_image:
            file_path = os.path.join(settings.MEDIA_ROOT, self.profile_image.name)
            if os.path.isfile(file_path):
                os.remove(file_path)

        super(InstagramUser, self).delete(*args, **kwargs)


class Content(models.Model):
    """Scaped Content"""

    CONTENT_TYPES = (
        ("image", "Image"),
        ("video", "Video"),
    )
    id = models.CharField(max_length=40, primary_key=True)
    type = models.CharField(max_length=10, choices=CONTENT_TYPES)
    display_url = models.CharField(max_length=255)
    url = models.CharField(max_length=255)
    description = models.TextField()
    views = models.IntegerField(default=0)
    likes = models.IntegerField(default=0)
    comments = models.IntegerField(default=0)
    carousel = models.BooleanField(default=False)
    categories = models.TextField()
    owner = models.ForeignKey(
        InstagramUser, on_delete=models.CASCADE, related_name="user_content"
    )

    def set_list_field(self, data):
        self.categories = json.dumps(data)

    def get_list_field(self):
        if self.categories:
            return json.loads(self.categories)
        return []

    def __str__(self):
        return str(self.description)
