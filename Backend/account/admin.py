from django.contrib import admin

# Register your models here.

from .models import User
from .models import ShopVendorProfile, CustomerProfile


admin.site.register(User)

admin.site.register(ShopVendorProfile)

admin.site.register(CustomerProfile)
