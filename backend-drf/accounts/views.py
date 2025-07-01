from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from . serializer import UserSerializer, UserProfileSerializer, UserProfileUpdateSerializer
from .models import UserProfile

class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'message': 'User created successfully',
                'user_id': user.id,
                'username': user.username
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    
    def get(self, request):
        """Get user profile"""
        try:
            profile = request.user.profile
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except UserProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def put(self, request):
        """Update user profile"""
        try:
            profile = request.user.profile
            serializer = UserProfileUpdateSerializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                # Return updated profile data
                updated_profile = UserProfileSerializer(profile)
                return Response({
                    'message': 'Profile updated successfully',
                    'profile': updated_profile.data
                }, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except UserProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

class UserProfileStatsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get user profile completion stats"""
        try:
            profile = request.user.profile
            
            # Calculate profile completion percentage
            total_fields = 8  # Total important fields
            completed_fields = 0
            
            if profile.phone_number:
                completed_fields += 1
            if profile.date_of_birth:
                completed_fields += 1
            if profile.bio:
                completed_fields += 1
            if profile.location:
                completed_fields += 1
            if profile.website:
                completed_fields += 1
            if profile.avatar:
                completed_fields += 1
            if profile.investment_experience != 'beginner':
                completed_fields += 1
            if profile.risk_tolerance != 'moderate':
                completed_fields += 1
            
            completion_percentage = (completed_fields / total_fields) * 100
            
            return Response({
                'completion_percentage': round(completion_percentage, 1),
                'completed_fields': completed_fields,
                'total_fields': total_fields,
                'is_profile_complete': profile.is_profile_complete
            }, status=status.HTTP_200_OK)
            
        except UserProfile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
        
class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        response = {
            'status': 'Request was permitted'
        }
        return Response(response)