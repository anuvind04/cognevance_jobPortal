from rest_framework import generics, permissions
from django.db.models import Q
from .models import User, JobPost, Application
from .serializers import RegisterSerializer, UserSerializer, JobPostSerializer, ApplicationSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class JobPostListCreateView(generics.ListCreateAPIView):
    serializer_class = JobPostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = JobPost.objects.filter(is_active=True).order_by('-created_at')
        search = self.request.query_params.get('search')
        location = self.request.query_params.get('location')
        job_type = self.request.query_params.get('job_type')
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(company__icontains=search)
            )
        if location:
            queryset = queryset.filter(location__icontains=location)
        if job_type:
            queryset = queryset.filter(job_type=job_type)
        return queryset

    def perform_create(self, serializer):
        if self.request.user.role != 'employer':
            raise permissions.PermissionDenied("Only employers can post jobs.")
        serializer.save(employer=self.request.user)


class JobPostDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = JobPostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return JobPost.objects.all()

    def perform_update(self, serializer):
        if self.get_object().employer != self.request.user:
            raise permissions.PermissionDenied("You can only edit your own job posts.")
        serializer.save()

    def perform_destroy(self, instance):
        if instance.employer != self.request.user:
            raise permissions.PermissionDenied("You can only delete your own job posts.")
        instance.delete()


class ApplyJobView(generics.CreateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.role != 'jobseeker':
            raise permissions.PermissionDenied("Only jobseekers can apply.")
        job = JobPost.objects.get(pk=self.kwargs['pk'])
        serializer.save(applicant=self.request.user, job=job)


class MyApplicationsView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Application.objects.filter(applicant=self.request.user)


class JobApplicationsView(generics.ListAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        job = JobPost.objects.get(pk=self.kwargs['pk'])
        if job.employer != self.request.user:
            raise permissions.PermissionDenied("Only the job owner can view applications.")
        return Application.objects.filter(job=job)


class UpdateApplicationStatusView(generics.UpdateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Application.objects.all()