from django.contrib import admin

# Register your models here.
from .models import product, Category


admin.site.register(product)
admin.site.register(Category)
