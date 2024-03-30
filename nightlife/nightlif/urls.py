# accounts/urls.py
from django.urls import path, include
from . import views
from .views import UserRegistrationAPIView, UserLoginAPIView, UserLogoutAPIView, TestimonialList, user_profile, club_datasets

urlpatterns = [
    path('register/', UserRegistrationAPIView.as_view(), name='user-registration'),
    path('login/', UserLoginAPIView.as_view(), name='user-login'),
    path('logout/', UserLogoutAPIView.as_view(), name='user-logout'),
    path('testimonials/', TestimonialList.as_view(), name='testimonials'),
    path('user/', user_profile, name='user_profile'),
    path('clubs/', club_datasets, name='clubs'),
	path('update_location/', views.UpdateLocationView.as_view(), name='update_location'),
    path('update_visit_history/', views.UpdateVisitHistoryView.as_view(), name='update_visit_history'),
    path('update_preferences/', views.UpdatePreferencesView.as_view(), name='update_preferences'),
    path('csrf_token/', views.csrf_token, name='csrf_token'),
]
