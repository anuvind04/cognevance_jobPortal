from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, JobPost, Application

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('role', 'phone', 'location', 'bio')}),
    )

admin.site.register(User, CustomUserAdmin)
admin.site.register(JobPost)
admin.site.register(Application)