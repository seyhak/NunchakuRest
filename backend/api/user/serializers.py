from rest_framework import serializers
from django.contrib.auth.models import User


class ChangePasswordSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True, style={"input_type": "password"})

class SessionAuthenticationSerializer(ChangePasswordSerializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True, style={"input_type": "password"})


class SignupSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
    password = serializers.CharField(
        write_only=True,
        style={"input_type": "password"}
    )
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)
    email = serializers.CharField()

    class Meta:
        model = User
        fields = ["username", "password", "first_name", "last_name", "email"]


class UserSerializer(SignupSerializer):
    pass
