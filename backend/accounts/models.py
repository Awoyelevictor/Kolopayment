from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    phone_number = models.CharField(max_length=15, unique=True)
    bvn = models.CharField(max_length=11, blank=True, null=True)
    is_bvn_verified = models.BooleanField(default=False)
    trust_score = models.IntegerField(default=100)
    
    # Required to resolve conflicts if needed, though standard DRF shouldn't conflict if we set AUTH_USER_MODEL
    
    def __str__(self):
        return self.get_full_name() or self.username
