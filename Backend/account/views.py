from django.shortcuts import redirect, render, HttpResponseRedirect, get_object_or_404
from django.http import HttpResponse

from django.contrib import messages

# Authentication
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import authenticate, logout, login

# Create your views here.

from .forms import VendorSignUpForm, CustomerSignUpForm
# database model
from .models import ShopVendorProfile, CustomerProfile
from inventory.models import product, Category
from OrderManagement.models import Order


from .models import User

#
from .tokens import account_activation_token

from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode

# restapi 
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from account.serializers import RegisterSerializer,LoginSerializer,resetpasswordSerializer

# rest frame work authentication
from rest_framework import generics
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated

from rest_framework.views import APIView

def get_tokens_for_user(user):
  refresh = RefreshToken.for_user(user)
  return {'access': str(refresh.access_token),}

# register shop vendor user serializer view
@api_view(['POST'])
def shop_vendor_register_view(request):
    if request.method == 'POST':
        userData={}
        userData['email']=request.data['email']
        userData['username']=request.data['username']
        userData['password']=request.data['password']
        userData['password2']=request.data['password2'] 

        print("User data: ",userData)
        
        Business_name=request.data['Business_name']
        Business_phone=request.data['Business_phone']
        Business_address=request.data['Business_address']

        print("Business name", Business_name, "Business phone", Business_phone, "Business address", Business_address)

        serializer = RegisterSerializer(data=userData)
        data = {}
        if serializer.is_valid():
            user = serializer.save()
            user.is_vendor = True
            user.save()

            ShopVendorProfile.objects.create(
                user=user,
                vendorname=user.username,
                Business_name=Business_name,
                Business_phone=Business_phone,
                Business_address=Business_address,
            )

            data['response'] = "successfully registered a new user."
            data['email'] = user.email
            data['username'] = user.username
            data['is_vendor'] = user.is_vendor

            return Response("successfully registered a new user.", status=status.HTTP_201_CREATED)


        else:
            data = serializer.errors
            return Response(data,status=status.HTTP_400_BAD_REQUEST)



# register customer 
@api_view(['POST'])
def customer_register_view(request):
    if request.method == 'POST':
        Customer_phone=request.data['Customer_phone']
        Customer_address=request.data['Customer_address']

        userData={}
        userData['email']=request.data['email']
        userData['username']=request.data['username']
        userData['password']=request.data['password']
        userData['password2']=request.data['password2']        
        print("User data: ",userData)
        serializer = RegisterSerializer(data=userData)
        data = {}
        if serializer.is_valid():
            user = serializer.save()
            user.is_customer = True
            user.save()

            CustomerProfile.objects.create(
                user=user,
                Customer_phone=Customer_phone,
                Customer_address=Customer_address,
            )

            data['response'] = "successfully registered a new customer."
            data['email'] = user.email
            data['username'] = user.username
            data['is_customer'] = user.is_customer

        else:
            data = serializer.errors    
        return Response(data)






# login view
@api_view(['POST'])
def login_view(request):
    if request.method == 'POST':
        print("request data", request.data)
        serializer = LoginSerializer(data=request.data)
        name = request.data['username']
        pas = request.data['password']

        user = authenticate(username=name, password=pas)
        data = {}
        if user is not None:
            data['response'] = "successfully authenticated."
            data['username'] = user.username
            data['is_vendor'] = user.is_vendor
            data['is_customer'] = user.is_customer
            data['tokens'] = get_tokens_for_user(user)
        else:
            data = serializer.errors
        return Response(data)


# change password Link send to email
class Reset_password_emailView(APIView):
  
  def post(self, request, format=None):
    serializer = resetpasswordSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    return Response({'msg':'Password Reset link send. Please check your Email'}, status=status.HTTP_200_OK)





def logout_req(request):
    logout(request)
    return redirect("account:mainPage")


def account_activate(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))

        user = User.objects.get(pk=uid)

    except (TypeError, ValueError, OverflowError, user.DoesNotExist):
        user = None
    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()
        login(request, user)
        return HttpResponse("Successfully activated")
    else:
        return HttpResponse("invalid activation")









