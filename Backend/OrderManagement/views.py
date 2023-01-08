from django.shortcuts import redirect, render, HttpResponseRedirect, get_object_or_404
# Create your views here.
from decimal import Decimal
from django.http.response import JsonResponse

from .models import Order, OrderItem
from .forms import CheckoutForm
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response

from account.models import ShopVendorProfile, CustomerProfile

# send email
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.encoding import force_str
from django.core.mail import EmailMessage


@csrf_exempt
@api_view(['POST'])
def OrderCreate(request):
    print("Order Product Create API Called ")
    print("request:",request.user)
    if request.method == "POST":
        # customer=CustomerProfile.objects.filter(user=request.user)
        
        customers=get_object_or_404(CustomerProfile, user_id=request.user.id)

        print("user :",request.user.email)

        email = request.user.email
        print("customers:",customers)
        


        if customers is not None:
            phone = customers.Customer_phone
            address = customers.Customer_address

            print("Customer Phone:",customers.Customer_phone)
            print("Customer address:",customers.Customer_address)

        else:
            shop=get_object_or_404(ShopVendorProfile, user_id=request.user.id)
            phone = shop.Business_phone
            address = shop.Business_address
            print("Shop Vendor Phone:",shop.Business_phone)
            print("Shop Vendor address:",shop.Business_address)


        print("request data:",request.data)

        total=0
        for prod in request.data['products']:
            total=total+prod['totalbill']

        order = Order.objects.create(
                user_id=request.user.id,
                username=request.user,
                email=email,
                address=address,
                phone=phone,
                paid_amount=Decimal(total),
            )
        # send email to buyer
        
        subject = 'CementO Order #' + str(order.id) + ' bill'
        
        message = '<html>'
        message += '<body>'
        message = '<h3>Thank you for your order!</h3>'
        message += '<h1 style="text-align: center;">Order Receipt</h1>'
        message += '<table style="border: 1px solid black; width: 100%;">'
        message += '<tr>'
        message += '<th style="border: 1px solid black; text-align: left;">Item</th>'
        message += '<th style="border: 1px solid black; text-align: right;">Price</th>'
        message += '</tr>'
            
        for item in request.data['products']:
            # print("item id:",item['id'] , "item price:",item['price'])
            # message += '<li>' +str(item['id']) + ': Rs' + str(item['price']) + '</li>' # convert 
            
            message += '<tr>'
            message += '<td style="border: 1px solid black; text-align: left;">' + str(item['id']) + '</td>'
            message += '<td style="border: 1px solid black; text-align: right;">RS' + str(item['price'])+ '</td>'
            message += '</tr>'
       
        message += '<tr>'
        message += '<td style="border: 1px solid black; text-align: left;">Total</td>'
        message += '<td style="border: 1px solid black; text-align: right;">RS' + str(total) + '</td>'
        message += '</tr>'

        message += '</table>'
        message += '</body>'
        message += '</html>'


        
        message += '</ul>'
        # email.email_user(subject=subject, message=message)

        email_send = EmailMessage(subject, message, 'makhdoomrasheed991@gmail.com', [email])
        email_send.content_subtype = 'html'
        email_send.send()


        for Orderproduct in request.data['products']:
            OrderItem.objects.create(
                order=order,
                product_id=Orderproduct['id'],
                vendor_id=Orderproduct['vendorfk'],
                price=Orderproduct['price'],
                quantity=Orderproduct['quantity'],
            )
            order.vendors.add(Orderproduct['vendorfk'])
  
    
    return Response("Order Created",status=200)