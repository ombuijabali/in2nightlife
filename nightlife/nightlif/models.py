from django.db import models
from django.contrib.gis.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from star_ratings.models import Rating
from django.contrib.gis.geos import GEOSGeometry

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=254)
    last_name = models.CharField(max_length=254)
    email = models.EmailField(max_length=254)    
    phone_number = models.CharField(max_length=30)
    address = models.CharField(max_length=100)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    def __str__(self):
        return self.user.username

    class Meta:
        verbose_name_plural = "UserProfiles"

@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
    instance.userprofile.save()

class Testimonial(models.Model):
    customer_name = models.CharField(max_length=255)
    star_rating = models.IntegerField()
    comment = models.TextField()
    customer_image = models.ImageField(upload_to='testimonial_images/', blank=True, null=True) # Make sure to create the 'customer_images' folder in your MEDIA_ROOT

    def __str__(self):
        return self.customer_name

class ClubModel(models.Model):
    name = models.CharField(max_length=254)
    types = models.CharField(max_length=254, null=True, blank=True)
    street = models.CharField(max_length=254, null=True, blank=True)
    descriptio = models.CharField(max_length=254, null=True, blank=True)
    closed = models.CharField(max_length=254, null=True, blank=True)
    opened = models.CharField(max_length=254, null=True, blank=True)
    restaurant = models.CharField(max_length=254, null=True, blank=True)
    delivery_s = models.CharField(max_length=254, null=True, blank=True)
    note = models.CharField(max_length=254, null=True, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    drinks = models.CharField(max_length=254, null=True, blank=True)
    music = models.CharField(max_length=254, null=True, blank=True)
    congestion = models.IntegerField(default=0)
    geom = models.PointField(srid=4326, null=True, blank=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Clubs"

class UserLocation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    location = models.PointField(srid=4326, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    drink = models.JSONField(null=True, blank=True)
    music = models.JSONField(null=True, blank=True)
    visit_history = models.JSONField(null=True, blank=True)

    def __str__(self):
        if self.location:
            return f"User Location - User: {self.user.username}, Latitude: {self.location.y}, Longitude: {self.location.x}"
        else:
            return f"User Location - User: {self.user.username}"

    class Meta:
        verbose_name_plural = "UserLocations"