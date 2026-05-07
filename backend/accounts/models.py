from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    phone_number = models.CharField(max_length=15, unique=True)
    bvn = models.CharField(max_length=11, blank=True, null=True)
    is_bvn_verified = models.BooleanField(default=False)
    trust_score = models.IntegerField(default=100)
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    
    # Payaza Virtual Account (Reserved Account) info
    payaza_account_number = models.CharField(max_length=20, blank=True, null=True)
    payaza_bank_name = models.CharField(max_length=50, blank=True, null=True)
    payaza_account_name = models.CharField(max_length=100, blank=True, null=True)
    
    def __str__(self):
        return self.get_full_name() or self.username
