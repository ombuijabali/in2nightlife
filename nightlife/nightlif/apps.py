from django.apps import AppConfig


class NightlifConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "nightlif"

    def ready(self):
        import nightlif.signals 