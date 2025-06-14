from django.urls import path,include
from rest_framework import routers
from accounts import views as UserView
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from . views import StockPredictionAPIView
urlpatterns = [
    path('register/',UserView.RegisterView.as_view(), name='register_user'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('protected-view/',UserView.ProtectedView.as_view(),name="protectedview"),
    path('predict/',StockPredictionAPIView.as_view(),name='stock_prediction '),


    
]