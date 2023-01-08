from django.urls import path
from . import views

from django.urls import path,include
from django.conf.urls.static import static
from django.conf import settings
from .views import Add_product_view

from .views import ImageSearchView



urlpatterns = [
	# Add new product 
	path('product-create/', views.Add_product_view.as_view(), name="add-product"),
	# image upload
	path('upload-image/', ImageSearchView.as_view(), name="upload-image"),
	
	# Category
	path('', views.CategoryapiOverview, name="category-api-overview"),
	path('Category-list/', views.CategoryList, name="Category-list"),
	path('Category-detail/<str:pk>/', views.CategoryDetail, name="Category-detail"),
	path('Category-create/', views.CategoryCreate, name="Category-create"),
	path('Category-update/<str:pk>/', views.CategoryUpdate, name="Category-update"),
	path('Category-delete/<str:pk>/', views.CategoryDelete, name="Category-delete"),

	# Product
	path('product/', views.productapiOverview, name="product-api-overview"),
	# Get all product list
	path('product-list/', views.productList, name="product-list"),
	# Get one product detail by id
	path('product-detail/<str:pk>/', views.productDetail, name="product-detail"),
	# Get Product by Category
	path('product-by-category/<str:pk>/', views.productByCategory, name="product-by-category"),
	# search product by category ,price and sort by price
	path('product-search/<str:cat>/<str:price>/<str:sort>/', views.productByMultipleield, name="product-search"),
	# search product by multiple search field input
	path("search/<str:searchproduct>/", views.product_search_multiple_field, name="search_result"), 
	
	
	# Update Product
	path('product-update/<str:pk>/', views.productUpdate, name="product-update"),
	# Delete Product
	path('product-delete/<str:pk>/', views.productDelete, name="product-delete"),

	#shop vendor order list 
	path("shopvendor-orderlist/", views.VendorOrderView.as_view(), name="vendorOrder"),
	#shop vendor  list 
	path("shopvendor-productlist/", views.VendorDashboardProductView.as_view(), name="vendorOrder"),
	# Add new product 
	path('product-create/', views.VendorDashboardAddProductView.as_view(), name="add-product"),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
