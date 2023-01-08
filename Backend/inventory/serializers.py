from rest_framework import serializers
from .models import product,Category
from OrderManagement.models import Order, OrderItem

class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model=Category
        fields ='__all__'

        
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = product
        fields = '__all__'

# vendor order serializer
class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'
# vendor order item serializer
class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'