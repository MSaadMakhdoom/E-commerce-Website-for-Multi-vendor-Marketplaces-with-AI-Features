from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class User(AbstractUser):
    is_customer = models.BooleanField("Is customer", default=False)
    is_vendor = models.BooleanField("Is vendor", default=False)


class ShopVendorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    vendorname = models.CharField(max_length=100, default="Null")
    Business_name = models.CharField(max_length=100)

    Business_phone = models.CharField(max_length=100)

    Business_address = models.CharField(max_length=100)

    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.vendorname


class CustomerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)

    Customer_phone = models.CharField(max_length=100)

    Customer_address = models.CharField(max_length=100)

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"phone: {self.Customer_phone}, address: {self.Customer_address}"




