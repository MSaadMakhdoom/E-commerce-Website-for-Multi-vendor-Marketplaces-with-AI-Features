from django.db import models

# Create your models here.
from django.conf import settings

from inventory.models import product
from account.models import ShopVendorProfile, CustomerProfile


class Order(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="order_user"
    )

    vendors = models.ManyToManyField(ShopVendorProfile, related_name="orders")

    username = models.CharField(max_length=100, null=False, blank=False)

    email = models.CharField(max_length=100, null=False, blank=False)
    address = models.CharField(max_length=100, null=False, blank=False)

    phone = models.CharField(max_length=100, null=False, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)

    paid_amount = models.DecimalField(max_digits=8,
                                        decimal_places=2,
                                        null=True,
                                        blank=True)

    billing_status = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.username


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(product, related_name="items", on_delete=models.CASCADE)

    vendor = models.ForeignKey(
        ShopVendorProfile, related_name="items", on_delete=models.CASCADE
    )

    vendor_paid = models.BooleanField(default=False)

    price = models.DecimalField(
        max_digits=8,
        decimal_places=2,
    )

    quantity = models.IntegerField(default=1)

    created_at = models.DateTimeField(auto_now_add=True,null=True,blank=True)

    def __str__(self):
        return "%s" % self.id

    def get_total_price(self):
        return self.price * self.quantity
