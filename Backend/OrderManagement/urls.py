from django.urls import path

from . import views

app_name = "OrderManagement"

urlpatterns = [
    path("CreateProductOrder/", views.OrderCreate, name="ProductOrderCreate"),

]
