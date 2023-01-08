from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User

from django.contrib.auth.forms import (
    AuthenticationForm,
    PasswordResetForm,
    SetPasswordForm,
)


class UserLoginForm(AuthenticationForm):

    username = forms.CharField(
        widget=forms.TextInput(
            attrs={
                "class": "form-control mb-3",
                "placeholder": "Username",
                "id": "login-username",
            }
        )
    )
    password = forms.CharField(
        widget=forms.PasswordInput(
            attrs={
                "class": "form-control",
                "placeholder": "Password",
                "id": "login-pwd",
            }
        )
    )


class VendorSignUpForm(UserCreationForm):
    username = forms.CharField(
        label="Enter Username",
        min_length=4,
        max_length=50,
        help_text="Required",
        widget=forms.TextInput(
            attrs={"class": "form-control mb-3", "placeholder": "Username"}
        ),
    )

    email = forms.EmailField(
        max_length=100,
        help_text="Required",
        error_messages={"required": "Sorry, you will need an email"},
        widget=forms.TextInput(
            {
                "class": "form-control mb-3",
                "placeholder": "E-mail",
                "name": "email",
                "id": "id_email",
            }
        ),
    )

    password1 = forms.CharField(
        label="Password",
        widget=forms.PasswordInput(
            {"class": "form-control mb-3", "placeholder": "Password"}
        ),
    )

    password2 = forms.CharField(
        label="Repeat password",
        widget=forms.PasswordInput(
            {"class": "form-control", "placeholder": "Repeat Password"}
        ),
    )

    def clean_email(self):
        email = self.cleaned_data["email"]
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError(
                "Please use another Email, that is already taken"
            )
        return email

    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "password1",
            "password2",
            "is_vendor",
            "is_customer",
        )


class CustomerSignUpForm(UserCreationForm):
    username = forms.CharField(
        label="Enter Username",
        min_length=2,
        max_length=50,
        help_text="Required",
        widget=forms.TextInput(
            attrs={"class": "form-control mb-3", "placeholder": "Username"}
        ),
    )

    email = forms.EmailField(
        max_length=100,
        help_text="Required",
        error_messages={"required": "Sorry, you will need an email"},
        widget=forms.TextInput(
            {
                "class": "form-control mb-3",
                "placeholder": "E-mail",
                "name": "email",
                "id": "id_email",
            }
        ),
    )

    password1 = forms.CharField(
        label="Password",
        widget=forms.PasswordInput(
            {"class": "form-control mb-3", "placeholder": "Password"}
        ),
    )

    password2 = forms.CharField(
        label="Repeat password",
        widget=forms.PasswordInput(
            {"class": "form-control", "placeholder": "Repeat Password"}
        ),
    )

    def clean_email(self):
        email = self.cleaned_data["email"]
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError(
                "Please use another Email, that is already taken"
            )
        return email

    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "password1",
            "password2",
            "is_vendor",
            "is_customer",
        )
