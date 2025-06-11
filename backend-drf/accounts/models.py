from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=100, blank=True)
    website = models.URLField(blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    
    # Investment preferences
    investment_experience = models.CharField(
        max_length=20,
        choices=[
            ('beginner', 'Beginner'),
            ('intermediate', 'Intermediate'),
            ('advanced', 'Advanced'),
            ('expert', 'Expert'),
        ],
        default='beginner'
    )
    
    risk_tolerance = models.CharField(
        max_length=20,
        choices=[
            ('conservative', 'Conservative'),
            ('moderate', 'Moderate'),
            ('aggressive', 'Aggressive'),
        ],
        default='moderate'
    )
    
    # Profile completion tracking
    is_profile_complete = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.username}'s Profile"
    
    def save(self, *args, **kwargs):
        # Check if profile is complete
        required_fields = [
            self.phone_number,
            self.date_of_birth,
            self.location,
            self.investment_experience,
            self.risk_tolerance
        ]
        self.is_profile_complete = all(field for field in required_fields)
        super().save(*args, **kwargs)

# Signal to create profile when user is created
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if hasattr(instance, 'profile'):
        instance.profile.save()
    else:
        UserProfile.objects.create(user=instance)