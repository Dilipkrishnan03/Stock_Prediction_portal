from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    # BASE API ENDPOINT
    path('api/v1/', include('api.urls')),
    # Authentication and Profile endpoints
    path('api/v1/auth/', include('accounts.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)