from django.urls import path
import api.user.views as UserViews

urlpatterns = [
    path('me/', UserViews.MeView.as_view(), name='me'),
    path('login/', UserViews.SessionLoginView.as_view(), name='login'),
    path('logout/', UserViews.SessionLogoutView.as_view(), name='logout'),
    path('signup/', UserViews.SignupView.as_view(), name='signup'),
    path('change-password/', UserViews.SessionChangePasswordView.as_view(), name='change-password'),
]
