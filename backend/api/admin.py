from django.contrib import admin
from .models import InstagramUser, Content


class InstagramUserAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "username",
        "is_private",
        "bio",
        "followers",
        "following",
        "profile_image",
        "num_content",
    )


class ContentAdmin(admin.ModelAdmin):
    list_display = ("type", "url", "description", "views", "likes", "comments", "owner")


admin.site.register(InstagramUser, InstagramUserAdmin)
admin.site.register(Content, ContentAdmin)
