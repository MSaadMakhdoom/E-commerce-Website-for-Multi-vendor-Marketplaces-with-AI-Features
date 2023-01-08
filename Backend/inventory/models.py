from django.db import models
# Create your models here.
from django.db import models
# Create your models here.
from django.urls import reverse
from unicodedata import category, name
from account.models import ShopVendorProfile
from io import BytesIO
from PIL import Image
from django.core.files import File
import geocoder

class ProductManager(models.Manager):
    def get_queryset(self):
        return super(ProductManager, self).get_queryset().filter(is_active=True)


class Category(models.Model):
    name = models.CharField(max_length=50)
    slug = models.SlugField()
    is_active = models.BooleanField()

    class Meta:
        verbose_name_plural = "categories"

    def get_absolute_url(self):
        return reverse("categories_each", args=[self.slug])

    def __str__(self):
        return self.name


class product(models.Model):
    categoryfk = models.ForeignKey(
        Category, related_name="products", on_delete=models.CASCADE
    )

    vendorfk = models.ForeignKey(
        ShopVendorProfile, related_name="products", on_delete=models.CASCADE
    )

    title = models.CharField(max_length=100)

    product_slug = models.SlugField()

    color = models.CharField(max_length=10, null=False, blank=False)
    Style = models.CharField(max_length=100, blank=True, null=True)
    Pattern = models.CharField(max_length=100, blank=True, null=True)
    shape = models.CharField(max_length=100, blank=True, null=True)
    Product_category = models.CharField(max_length=100, null=False, blank=False)

    description = models.TextField(blank=True, null=True)

    price = models.DecimalField(max_digits=8, decimal_places=2)

    qty = models.IntegerField()

    brand_name = models.CharField(max_length=100, blank=True, null=True)

    available_location = models.CharField(default="Blue area Islamabad",max_length=100, blank=True, null=True)
    # Map visualization 
    latitude = models.FloatField(default=0.00,blank=True, null=True)
    longitude = models.FloatField(default=0.00,blank=True, null=True)

    in_stock = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)

    objects = models.Manager()
    products = ProductManager()

    date_added = models.DateTimeField(auto_now_add=True)

    image = models.ImageField(upload_to="uploads/", blank=True, null=True)

    thumbnail = models.ImageField(upload_to="uploads/", blank=True, null=True)

    class Meta:
        verbose_name_plural = "products"
        ordering = ["-date_added"]

    def __str__(self):
        return f"title :{self.title} categoryfk :{self.categoryfk} color :{self.color} Style :{self.Style}   price :{self.price}  brand_name :{self.brand_name} vendor :{self.vendorfk.vendorname}"

    def get_absolute_url(self):
        return reverse("product-detail", args={self.id})

    def get_thumbnail(self):
        if self.image:
            return self.image.url
        else:
            if self.image:
                self.thumbnail = self.make_thumbnail(self.image)
                self.save()

                return self.thumbnail.url
            else:
                return "https://via.placeholder.com/240x180.jpg"
    
    def get_image_url(self):
        return self.image.url

    def make_thumbnail(self, image, size=(300, 200)):
        img = Image.open(image)
        img.convert("RGB")
        img.thumbnail(size)

        thumb_io = BytesIO()
        img.save(thumb_io, "JPEG", quality=85)

        thumbnail = File(thumb_io, name=image.name)

        return thumbnail

    def save(self, *args, **kwargs):
        self.latitude = geocoder.osm(self.available_location).lat
        self.longitude = geocoder.osm(self.available_location).lng
        return super().save(*args, **kwargs)



