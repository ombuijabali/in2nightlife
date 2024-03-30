from django.dispatch import receiver
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.db.models.signals import post_save, post_delete
from django.core.serializers import serialize
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .models import ClubModel

@receiver(post_save, sender=User)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)


@receiver(post_save, sender=ClubModel)
@receiver(post_delete, sender=ClubModel)
def send_club_notification(sender, instance, created, **kwargs):
    if created:
        action = "added"
    else:
        action = "deleted"

    message = {
        "action": action,
        "club": serialize("json", [instance]),
    }

    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)("club_notifications", {"type": "send_notification", "message": message})