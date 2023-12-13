from django.contrib import admin
from django.contrib.admin.models import LogEntry
from django.utils.html import escape
from django.utils.safestring import mark_safe


class LogEntryAdmin(admin.ModelAdmin):
    date_hierarchy = "action_time"
    list_filter = ["user", "content_type", "action_flag"]
    search_fields = ["object_repr", "change_message"]
    list_display = [
        "action_time",
        "user",
        "content_type",
        "object_link",
        "action_flag",
        "change_message",
    ]

    def object_link(self, obj):
        if obj.content_type is not None and obj.object_id is not None:
            link = escape(obj.object_repr)
            return mark_safe('<a href="{}">{}</a>'.format(obj.get_admin_url(), link))
        return "-"

    object_link.admin_order_field = "object_repr"
    object_link.short_description = "object"


admin.site.register(LogEntry, LogEntryAdmin)
