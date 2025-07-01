from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, style={'input_type': 'password'}, min_length=8, max_length=128)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'password')
    
    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data['username'],
            validated_data['email'],
            validated_data['password'],
        )
        # Set first_name and last_name if provided
        if 'first_name' in validated_data:
            user.first_name = validated_data['first_name']
        if 'last_name' in validated_data:
            user.last_name = validated_data['last_name']
        user.save()
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    avatar = serializers.ImageField(required=False)
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'user', 'phone_number', 'date_of_birth', 'bio', 
            'location', 'website', 'avatar', 'investment_experience',
            'risk_tolerance', 'is_profile_complete', 'created_at', 
            'updated_at'
        ]
        read_only_fields = ['id', 'is_profile_complete', 'created_at', 'updated_at']

class UserProfileUpdateSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', required=False)
    last_name = serializers.CharField(source='user.last_name', required=False)
    email = serializers.EmailField(source='user.email', required=False)
    
    class Meta:
        model = UserProfile
        fields = [
            'first_name', 'last_name', 'email', 'phone_number', 
            'date_of_birth', 'bio', 'location', 'website', 'avatar',
            'investment_experience', 'risk_tolerance'
        ]
    
    def update(self, instance, validated_data):
        # Handle user fields
        user_data = validated_data.pop('user', {})
        if user_data:
            user = instance.user
            for attr, value in user_data.items():
                setattr(user, attr, value)
            user.save()
        
        # Handle profile fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance