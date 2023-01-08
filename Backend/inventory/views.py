from django.shortcuts import render, redirect, HttpResponseRedirect, get_object_or_404
# Serializer
from .serializers import CategorySerializer,ProductSerializer,OrderItemSerializer,OrderSerializer
from rest_framework import viewsets
# Database model
from inventory.models import Category,product
from OrderManagement.models import Order, OrderItem
from account.models import ShopVendorProfile, CustomerProfile, User
# Restful api
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from rest_framework import viewsets
from rest_framework import generics
from django.views import View
#search product 
from django.db.models import Q
# API 
from rest_framework.views import APIView
from django.utils.text import slugify
# Authentication 
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
# File upload
from rest_framework.parsers import MultiPartParser, FormParser
# status
from rest_framework import status

# image search use cv2
import cv2
import os
import base64
import json
import numpy as np
from PIL import Image

from django.conf import settings

image_features={}
orb = cv2.ORB_create(nfeatures=5000)
bf = cv2.BFMatcher()


# Get the list of images in the database
pro = product.objects.all()
for p in pro:
	print("Product id",p.id,"Image",p.image,"url",p.get_image_url())

	img=str(p.image)
	image_path = os.path.join(str(settings.MEDIA_ROOT), str(img))
	image = Image.open(image_path)
	image = cv2.imread(image_path)

	if image is None:
		print(f'Error reading image {p.get_image_url()}')
		continue
	# Detect keypoints and compute descriptors
	kp, des = orb.detectAndCompute(image, None)

	# Check if any keypoints or descriptors were detected
	if kp is None or des is None:
		print(f'No keypoints or descriptors detected in image {p.get_image_url()}')
		continue

	# Store the keypoints and descriptors in the dictionary
	image_features[p.id] = (kp, des)


class ImageSearchView(APIView):
	
	def FindImage(self,Qkp,Qdes):
		
		matchList=[]
		final_match_val=-1
		
		try:
			for image_id, (kp, des) in image_features.items():
				matches =bf.knnMatch(des,Qdes,k=2)
				good=[]
				for m,n in matches:
					if m.distance < 0.75 * n.distance:
						good.append([m])
				matchList.append(len(good))
		except:
			print("Error in match")
			pass
		print("Good Match points in ALL image:",matchList)
		
		if matchList !=0:
			if max(matchList) > 15:
				final_match_val=matchList.index(max(matchList))
		
		return final_match_val







	def post(self, request):
		print("Image Search API")
		# Get the image from the POST request.
		image_data =  request.FILES['image'].read()  #request.POST['image'] #request.POST.get('image', None) #request.POST['image']
		print(	"Image Data",image_data)
		uploadimage = cv2.imdecode(np.frombuffer(image_data, np.uint8), cv2.IMREAD_UNCHANGED)
		
		best_distance = float('inf')
		best_match = None

		
		print("Product Image Search",uploadimage)
        
		# cv2.imshow('Image2',image)
		# cv2.waitKey(0)

		# Detect keypoints and compute descriptors for the query image
		kp_query, des_query = orb.detectAndCompute(uploadimage, None)

		# Check if any keypoints or descriptors were detected
		if kp_query is None or des_query is None:
			print('No keypoints or descriptors detected in query image')
			return Response("No Match",status=status.HTTP_404_NOT_FOUND)
		
		
		
		
		result=self.FindImage(kp_query,des_query)
		
		if result != -1:
			best_match=list(image_features.keys())[result]
		else:
			print("No Match")
			return Response("No Match",status=status.HTTP_404_NOT_FOUND)
			
		image_res=product.objects.get(id=best_match)
		
        
		Prod = ProductSerializer(image_res)

		print("Search Result Image",Prod)
		
		return Response(Prod.data,status=status.HTTP_200_OK)

		
		










# Create Category views here.
class Categorylist(viewsets.ModelViewSet):
  queryset = Category.objects.all()
  serializer_class = CategorySerializer
  
# Create product views here.
class productlist(viewsets.ModelViewSet):
  queryset = product.objects.all()
  serializer_class = ProductSerializer
  # Category




# vendor order product list page
class VendorOrderView(generics.ListAPIView):
	permission_classes = [IsAuthenticated]

	def get(self, request, format=None):
		user = self.request.user
		print("user	",user)

		ven = request.user.id
		print("Vendor id:", ven)

		pro = OrderItem.objects.filter(vendor_id=ven)

		print(user)
		serializer = OrderItemSerializer(pro, many=True)
		
		return Response(serializer.data, status=status.HTTP_200_OK)
# shop vendor dashboard product list page
class VendorDashboardProductView(generics.ListAPIView):
	
	permission_classes = [IsAuthenticated]

	def get(self, request, format=None):
		user = self.request.user
		print("Vendor Dashboard API Call ",user)
		ven = request.user.id
		print("Vendor id:", ven)
		pro = product.objects.filter(vendorfk_id=ven)

		serializer = ProductSerializer(pro, many=True)
		
		return Response(serializer.data, status=status.HTTP_200_OK)
	

# shop vendor dashboard delete product  page
@csrf_exempt
@api_view(['DELETE'])
def productDelete(request, pk):
	prod = product.objects.get(id=pk)
	prod.delete()

	return Response('Item succsesfully delete!',status=status.HTTP_200_OK)
	
# shop vendor dashboard update product  page
@csrf_exempt
@api_view(['PUT'])
def productUpdate(request, pk):
	print("Update API Call receive data",request.data)
    
	vendorobj = get_object_or_404(ShopVendorProfile, user_id=request.user.id)
	request.data['vendorfk']=vendorobj
	
	prod = product.objects.get(id=pk)

	serializer = ProductSerializer(instance=prod, data=request.data)

	if serializer.is_valid():
		serializer.save()

	return Response(serializer.data)




# Add product in vendor dashboard
class VendorDashboardAddProductView(APIView):
	permission_classes = [IsAuthenticated]
	def post(self, request, format=None):
		print("Vendor Dashboard API Call ",request.user.id)
		vendorobj = get_object_or_404(ShopVendorProfile, user_id=request.user.id)
		request.data['vendorfk']=vendorobj
		print("API Data receive ",request.data)
		serializer = ProductSerializer(data=request.data)
		if serializer.is_valid():
			serializer.save()
			
			return Response({ 'msg':'Add Product  Successfully'},status=status.HTTP_201_CREATED)
		else:
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(['GET'])
def CategoryapiOverview(request):
	api_urls = {
		'List':'/Category-list/',
		'Detail View':'/Category-detail/<str:pk>/',
		'Create':'/Category-create/',
		'Update':'/Category-update/<str:pk>/',
		'Delete':'/Category-delete/<str:pk>/',
		}

	return Response(api_urls)

@csrf_exempt
@api_view(['GET'])
def CategoryList(request):
	Categorys = Category.objects.all()
	serializer = CategorySerializer(Categorys, many=True)
	return Response(serializer.data)

@csrf_exempt
@api_view(['GET'])
def CategoryDetail(request, pk):
	Categorys = Category.objects.get(id=pk)
	serializer = CategorySerializer(Categorys, many=False)
	return Response(serializer.data)


@csrf_exempt
@api_view(['POST'])
def CategoryCreate(request):
	serializer = CategorySerializer(data=request.data)

	if serializer.is_valid():
		serializer.save()

	return Response(serializer.data)












@csrf_exempt
@api_view(['POST'])
def CategoryUpdate(request, pk):
	Cat = Category.objects.get(name=pk)
	serializer = CategorySerializer(instance=Cat, data=request.data)

	if serializer.is_valid():
		serializer.save()

	return Response(serializer.data)


@csrf_exempt
@api_view(['DELETE'])
def CategoryDelete(request, pk):
	Cat = Category.objects.get(name=pk)
	Cat.delete()

	return Response('Item succsesfully delete!')



# product

@csrf_exempt
@api_view(['GET'])
def productapiOverview(request):
	api_urls = {
		'List':'/product-list/',
		'Detail View':'/product-detail/<str:pk>/',
		'Create':'/product-create/',
		'Update':'/product-update/<str:pk>/',
		'Delete':'/product-delete/<str:pk>/',
		}

	return Response(api_urls)






@csrf_exempt
@api_view(['GET'])
def productList(request):
	products = product.objects.all().order_by('-id')
	serializer = ProductSerializer(products, many=True)
	return Response(serializer.data)

@csrf_exempt
@api_view(['GET'])
def productDetail(request, pk):
	products = product.objects.get(id=pk)
	serializer = ProductSerializer(products, many=False,context={'request': None})

	return Response(serializer.data)
	
@csrf_exempt
@api_view(['GET'])
def productByCategory(request, pk):
	products = product.objects.filter(categoryfk=pk)
	serializer = ProductSerializer(products, many=True,context={'request': None})
	return Response(serializer.data)


@csrf_exempt
@api_view(['GET'])
def productByMultipleield(request, cat,price,sort):
	print("Category:",cat,"Price:",price,"Sort",sort)
    # gte = greater than equal to lte = less than equal to
	products = product.objects.filter(categoryfk=cat,price__lte=price).order_by(sort)
	print(products)
	serializer = ProductSerializer(products, many=True,context={'request': None})
	return Response(serializer.data)


class Add_product_view(APIView):
	permission_classes = [IsAuthenticated]
	def post(self, request, format=None):
		print("Vendor Dashboard API Call ",request.data)

		request.data['product_slug']=slugify(request.data['title'])

		vendorobj = get_object_or_404(ShopVendorProfile, user_id=request.user.id)

		request.data['vendorfk'] = vendorobj
		
		print(request.data)
		
		serializer = ProductSerializer(data=request.data)
		
		if serializer.is_valid():
			serializer.save()
			
			return Response({ 'msg':'Add Product  Successfully'},status=status.HTTP_201_CREATED)
		else:
			print("Add new product error occur",serializer.errors)
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# search product
@csrf_exempt
@api_view(['GET'])
def product_search_multiple_field(request,searchproduct):
	print("Search box API Call ",searchproduct)

	query = searchproduct
	products = product.objects.filter( Q(title__icontains=query) | Q(Pattern__icontains=query) | Q(color__icontains=query)| Q(shape__icontains=query)| Q(brand_name__icontains=query) | Q(Style__icontains=query)| Q(brand_name__icontains=query) )
	print("products",products)
		
	serializer = ProductSerializer(products, many=True,context={'request': None})
	return Response(serializer.data)

 






