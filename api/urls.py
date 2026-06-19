from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('jobs/', views.JobPostListCreateView.as_view(), name='jobs'),
    path('jobs/<int:pk>/', views.JobPostDetailView.as_view(), name='job-detail'),
    path('jobs/<int:pk>/apply/', views.ApplyJobView.as_view(), name='apply-job'),
    path('jobs/<int:pk>/applications/', views.JobApplicationsView.as_view(), name='job-applications'),
    path('my-applications/', views.MyApplicationsView.as_view(), name='my-applications'),
    path('applications/<int:pk>/', views.UpdateApplicationStatusView.as_view(), name='update-application'),
]