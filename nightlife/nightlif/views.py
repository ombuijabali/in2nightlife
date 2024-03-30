from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate, login, logout
from .serializers import UserRegistrationSerializer, TestimonialSerializer, ClubModelSerializer, UserSerializer, UserLocationSerializer
from .models import Testimonial, UserProfile, ClubModel, UserLocation
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.gis.geos import Point
from rest_framework.authentication import TokenAuthentication
from django.middleware.csrf import get_token

@api_view(['GET'])
def csrf_token(request):
    token = get_token(request)
    return Response({'csrfToken': token})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response(serializer.data)

class UserRegistrationAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Generate a token for the newly registered user
            token, created = Token.objects.get_or_create(user=user)
            return Response({'user': serializer.data, 'token': token.key}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        
        if user:
            login(request, user)

            # Generate or retrieve the token for the user
            token, created = Token.objects.get_or_create(user=user)

            # Return the token along with the success message
            return Response({'token': token.key, 'detail': 'Login successful.'})
        
        return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

class UserLogoutAPIView(APIView):
    def post(self, request):
        logout(request)
        return Response({'detail': 'Logout successful.'})

class TestimonialList(APIView):
    def get(self, request, format=None):
        testimonials = Testimonial.objects.all()
        serializer = TestimonialSerializer(testimonials, many=True)
        return Response(serializer.data)

@api_view(['GET'])
def club_datasets(request):
    clubs = ClubModel.objects.all()
    serializer = ClubModelSerializer(clubs, many=True)
    return Response(serializer.data)

class UpdateLocationView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user
            serializer = UserLocationSerializer(data=request.data)
            if serializer.is_valid():
                location_data = serializer.validated_data.get('location')
                if location_data:
                    longitude = location_data['coordinates'][0]
                    latitude = location_data['coordinates'][1]
                    location = Point(longitude, latitude)
                    user_location, _ = UserLocation.objects.get_or_create(user=user)
                    user_location.location = location
                    user_location.save()
                return Response({'success': True})
            else:
                return Response({'success': False, 'errors': serializer.errors})
        except Exception as e:
            return Response({'success': False, 'error': str(e)})

class UpdateVisitHistoryView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user
            serializer = UserLocationSerializer(data=request.data)
            if serializer.is_valid():
                visit_history = serializer.validated_data.get('visit_history')
                if visit_history:
                    user_location, _ = UserLocation.objects.get_or_create(user=user)
                    user_location.visit_history = visit_history
                    user_location.save()
                return Response({'success': True})
            else:
                return Response({'success': False, 'errors': serializer.errors})
        except Exception as e:
            return Response({'success': False, 'error': str(e)})

class UpdatePreferencesView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user = request.user
            serializer = UserLocationSerializer(data=request.data, partial=True)
            if serializer.is_valid():
                user_location, _ = UserLocation.objects.get_or_create(user=user)
                user_location.drink = serializer.validated_data.get('drink', user_location.drink)
                user_location.music = serializer.validated_data.get('music', user_location.music)
                user_location.save()
                return Response({'success': True})
            else:
                return Response({'success': False, 'errors': serializer.errors})
        except Exception as e:
            return Response({'success': False, 'error': str(e)})
