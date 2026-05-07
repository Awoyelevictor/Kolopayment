from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    phone_number = models.CharField(max_length=15, unique=True)
    bvn = models.CharField(max_length=11, blank=True, null=True)
    is_bvn_verified = models.BooleanField(default=False)
    trust_score = models.IntegerField(default=100)
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    def __str__(self):
        return self.get_full_name() or self.username
