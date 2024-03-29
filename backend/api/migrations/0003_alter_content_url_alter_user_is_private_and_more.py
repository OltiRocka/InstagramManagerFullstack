# Generated by Django 5.0.1 on 2024-01-18 21:29

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("api", "0002_alter_user_id_alter_user_username"),
    ]

    operations = [
        migrations.AlterField(
            model_name="content",
            name="url",
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name="user",
            name="is_private",
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name="user",
            name="profile_image",
            field=models.CharField(max_length=255),
        ),
    ]
