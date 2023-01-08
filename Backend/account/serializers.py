from rest_framework import serializers
# Database Model
from inventory.models import product,Category
from .models import User, ShopVendorProfile, CustomerProfile
# Restframe-work & Authentication libraries
from django.utils.encoding import smart_str, force_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator


from account.utils import Util

# register user serializer
class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    class Meta:
        model = User
        fields = ( 'email', 'username', 'password','password2')
        extra_kwargs = {
            'password': {'write_only': True},

        }

    def save(self):


        user = User(email=self.validated_data['email'],username= self.validated_data['username'])
        password = self.validated_data['password']
        password2 = self.validated_data['password2']

        if User.objects.filter(email=self.validated_data['email']).exists():
            raise serializers.ValidationError(
                "Please use another Email, that is already registered."
            )

        if password != password2:
            raise serializers.ValidationError({'password': 'Passwords and Confirm Password not match.'})
        user.set_password(password)
        user.save()

        return user



# login user serializer
class LoginSerializer(serializers.ModelSerializer):
  email = serializers.EmailField(max_length=255)
  class Meta:
    model = User
    fields = ['email', 'password']


#forgot password serializer


class resetpasswordSerializer(serializers.Serializer):
	email = serializers.EmailField(max_length=255)
	class Meta:
		fields = ['email']
	

		
	def validate(self, attrs):
		email = attrs.get('email')
		if User.objects.filter(email=email).exists():
			user = User.objects.get(email = email)
			uid = urlsafe_base64_encode(force_bytes(user.id))
			print('Encoded UID', uid)
			token = PasswordResetTokenGenerator().make_token(user)
			print('Password Reset Token', token)
			link = 'http://127.0.0.1:8000/reset/'+uid+'/'+token
			print('Password Reset Link', link)
			# Send email
			body = 'Click Following Link to Reset Your Password '+link
			data = {'subject':'Reset Your Password','body':body,'to_email':user.email}
            
			Util.send_email(data)

			return attrs
		else:
			raise serializers.ValidationError('You are not a Registered User')




class VendorPasswordResetSerializer(serializers.Serializer):
  password = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
  password2 = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
  class Meta:
    fields = ['password', 'password2']

  def validate(self, attrs):
    try:
      password = attrs.get('password')
      password2 = attrs.get('password2')
      uid = self.context.get('uid')
      token = self.context.get('token')
      if password != password2:
        raise serializers.ValidationError("Password and Confirm Password doesn't match")
      id = smart_str(urlsafe_base64_decode(uid))
      user = User.objects.get(id=id)
      if not PasswordResetTokenGenerator().check_token(user, token):
        raise serializers.ValidationError('Token is not Valid or Expired')
      user.set_password(password)
      user.save()
      return attrs
    except DjangoUnicodeDecodeError as identifier:
      PasswordResetTokenGenerator().check_token(user, token)
      raise serializers.ValidationError('Token is not Valid or Expired')
