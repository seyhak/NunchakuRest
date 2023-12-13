from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db.utils import IntegrityError
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import (
    ChangePasswordSerializer,
    SessionAuthenticationSerializer,
    SignupSerializer,
    UserSerializer,
)


class SessionLoginView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = SessionAuthenticationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data["username"]
        password = serializer.validated_data["password"]

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            user_data = UserSerializer(user).data
            return Response(data=user_data)
        else:
            return Response(
                {"message": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED
            )


class SessionLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        if request.user:
            logout(request)
        return Response({"message": "Logout successful."})


class SignupView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            serializer = SignupSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            data = serializer.validated_data

            created_user = User.objects.create_user(
                username=data.pop("username"),
                email=data.pop("email"),
                password=data.pop("password"),
                **data
            )
            created_user_data = SignupSerializer(created_user).data
            login(request, created_user)
            return Response(created_user_data, status=status.HTTP_201_CREATED)
        except ValidationError as err:
            return Response(err.detail, status=status.HTTP_400_BAD_REQUEST)
        except IntegrityError as err:
            return Response(str(err), status=status.HTTP_400_BAD_REQUEST)


class SessionChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        password = serializer.validated_data["password"]

        user = request.user
        user.set_password(password)
        user.save()

        return Response({"message": "Password changed."}, status=status.HTTP_200_OK)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user_data = UserSerializer(request.user).data
        return Response(data={**user_data})
