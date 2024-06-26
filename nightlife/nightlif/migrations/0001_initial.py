# Generated by Django 5.0.3 on 2024-03-26 07:33

import django.contrib.gis.db.models.fields
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="ClubModel",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=254)),
                ("types", models.CharField(blank=True, max_length=254, null=True)),
                ("street", models.CharField(blank=True, max_length=254, null=True)),
                ("descriptio", models.CharField(blank=True, max_length=254, null=True)),
                ("closed", models.CharField(blank=True, max_length=254, null=True)),
                ("opened", models.CharField(blank=True, max_length=254, null=True)),
                ("restaurant", models.CharField(blank=True, max_length=254, null=True)),
                ("delivery_s", models.CharField(blank=True, max_length=254, null=True)),
                ("note", models.CharField(blank=True, max_length=254, null=True)),
                ("latitude", models.FloatField(blank=True, null=True)),
                ("longitude", models.FloatField(blank=True, null=True)),
                ("drinks", models.CharField(blank=True, max_length=254, null=True)),
                ("music", models.CharField(blank=True, max_length=254, null=True)),
                ("congestion", models.IntegerField(default=0)),
                (
                    "geom",
                    django.contrib.gis.db.models.fields.PointField(
                        blank=True, null=True, srid=4326
                    ),
                ),
            ],
            options={
                "verbose_name_plural": "Clubs",
            },
        ),
        migrations.CreateModel(
            name="Testimonial",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("customer_name", models.CharField(max_length=255)),
                ("star_rating", models.IntegerField()),
                ("comment", models.TextField()),
                (
                    "customer_image",
                    models.ImageField(
                        blank=True, null=True, upload_to="testimonial_images/"
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="UserLocation",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("location", django.contrib.gis.db.models.fields.PointField(srid=4326)),
                ("timestamp", models.DateTimeField(auto_now_add=True)),
                ("drink", models.JSONField(blank=True, null=True)),
                ("music", models.JSONField(blank=True, null=True)),
                ("visit_history", models.JSONField(blank=True, null=True)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name_plural": "UserLocations",
            },
        ),
        migrations.CreateModel(
            name="UserProfile",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("first_name", models.CharField(max_length=254)),
                ("last_name", models.CharField(max_length=254)),
                ("email", models.EmailField(max_length=254)),
                ("phone_number", models.CharField(max_length=30)),
                ("address", models.CharField(max_length=100)),
                (
                    "profile_picture",
                    models.ImageField(blank=True, null=True, upload_to="profile_pics/"),
                ),
                (
                    "user",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name_plural": "UserProfiles",
            },
        ),
    ]
