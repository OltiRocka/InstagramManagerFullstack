from django.db import models


# Create your models here.
class InstagramUser(models.Model):
    id = models.CharField(max_length=40, primary_key=True)
    username = models.CharField(max_length=40)
    is_private = models.BooleanField(default=True)
    bio = models.TextField()
    followers = models.IntegerField(default=0)
    following = models.IntegerField(default=0)
    profile_image = models.CharField(max_length=255)
    num_content = models.IntegerField(default=0)

    def __str__(self):
        return self.username


class Content(models.Model):
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
    owner = models.ForeignKey(
        InstagramUser, on_delete=models.CASCADE, related_name="user_content"
    )

    def __str__(self):
        return self.description
