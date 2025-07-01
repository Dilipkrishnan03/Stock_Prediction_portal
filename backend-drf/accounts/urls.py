from django.urls import path
from .views import RegisterView, UserProfileView, UserProfileStatsView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('profile/stats/', UserProfileStatsView.as_view(), name='profile-stats'),
]