from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, JobPost, Application

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role', 'phone', 'location', 'bio']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'phone', 'location', 'bio']

class JobPostSerializer(serializers.ModelSerializer):
    employer_name = serializers.CharField(source='employer.username', read_only=True)

    class Meta:
        model = JobPost
        fields = ['id', 'title', 'company', 'location', 'job_type',
                  'salary', 'description', 'requirements',
                  'created_at', 'is_active', 'employer_name']
        read_only_fields = ['employer_name', 'created_at']

class ApplicationSerializer(serializers.ModelSerializer):
    applicant_name = serializers.CharField(source='applicant.username', read_only=True)
    job_title = serializers.CharField(source='job.title', read_only=True)

    class Meta:
        model = Application
        fields = ['id', 'job', 'job_title', 'applicant_name',
                  'cover_letter', 'status', 'applied_at']
        read_only_fields = ['job', 'applicant_name', 'job_title', 'applied_at']