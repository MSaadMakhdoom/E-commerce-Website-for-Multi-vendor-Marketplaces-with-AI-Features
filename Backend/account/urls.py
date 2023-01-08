from django.urls import path
from . import views

from django.contrib.auth import views as auth_views


app_name = "account"

urlpatterns = [
    # rest api
    path("shopvendor/register/", views.shop_vendor_register_view, name="shop_vendor_register"),
    path("customer/register/", views.customer_register_view, name="customer_register"),
    path("Login_api/", views.login_view, name="API_login"),
    # Logout
    path("logout/", views.logout_req, name="logout"),

    # email send reset password-link
	path('email-link/', views.Reset_password_emailView.as_view(), name=""),




    



    # change password
    path(
        "reset/<uidb64>/<token>/",
        auth_views.PasswordResetConfirmView.as_view(
            template_name="password_reset_form.html"
        ),
        name="password_reset_confirm",
    ),
    # path(
    #     "ResetPasswordComplete/",
    #     auth_views.PasswordResetCompleteView.as_view(
    #         template_name="ResetProcessComplete.html"
    #     ),
       
    # ),

    path(
        "reset-password-complete/",
        auth_views.PasswordResetCompleteView.as_view(template_name="reset_process_complete.html"),
        name="password_reset_complete",
    ),


    
    # account activate link
    path(
        "activate/<slug:uidb64>/<slug:token>/", views.account_activate, name="activate"
    ),


]


# Authentication learning resource
# https://docs.djangoproject.com/en/3.0/topics/auth/default/#all-authentication-views
