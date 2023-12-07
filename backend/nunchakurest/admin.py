# from django.contrib import admin

# from django.contrib.auth.models import User


# # Register your models here.
# @admin.register(User)
# for some magic reason it doesnt work
# class UserAdmin(admin.ModelAdmin):
#     list_display = ("username", "first_name", "last_name", "is_active")
#     list_filter = ("is_active")
#     search_fields = [
#         "username",
#         "first_name",
#         "last_name",
#         "user__username",
#         "start_date",
#         "used_date",
#     ]

# admin.site.unregister(User)
# admin.site.register(User, UserAdmin)
