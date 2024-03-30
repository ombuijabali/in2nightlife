from django.contrib import admin
from leaflet.admin import LeafletGeoAdmin
from .models import UserProfile, Testimonial, ClubModel, UserLocation

class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'phone_number', 'address'] 
    search_fields = ['user__username', 'phone_number'] 

admin.site.register(UserProfile, UserProfileAdmin)

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('customer_name',)

@admin.register(ClubModel)
class ClubModelAdmin(LeafletGeoAdmin):
    list_display = ('name',)
    search_fields = ('name',)

    def save_model(self, request, obj, form, change):    
        super().save_model(request, obj, form, change)

@admin.register(UserLocation)
class UserLocationAdmin(LeafletGeoAdmin):
    list_display = ('user',)
    search_fields = ('user',)

    def save_model(self, request, obj, form, change):    
        super().save_model(request, obj, form, change)