from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import UserProfile

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profile'
    fields = (
        'phone_number', 'date_of_birth', 'bio', 'website', 
        'avatar', 'investment_experience', 'risk_tolerance', 'is_profile_complete'
    )
    readonly_fields = ('is_profile_complete',)

class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'get_profile_complete')
    list_filter = BaseUserAdmin.list_filter + ('profile__is_profile_complete',)
    
    def get_profile_complete(self, obj):
        return obj.profile.is_profile_complete if hasattr(obj, 'profile') else False
    get_profile_complete.short_description = 'Profile Complete'
    get_profile_complete.boolean = True

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone_number', 'investment_experience', 'risk_tolerance', 'is_profile_complete', 'created_at')
    list_filter = ('investment_experience', 'risk_tolerance', 'is_profile_complete', 'created_at')
    search_fields = ('user__username', 'user__email', 'phone_number')
    readonly_fields = ('is_profile_complete', 'created_at', 'updated_at')
    
    fieldsets = (
        ('User Info', {
            'fields': ('user',)
        }),
        ('Personal Information', {
            'fields': ('phone_number', 'date_of_birth', 'bio', 'website', 'avatar')
        }),
        ('Investment Preferences', {
            'fields': ('investment_experience', 'risk_tolerance')
        }),
        ('System Fields', {
            'fields': ('is_profile_complete', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)