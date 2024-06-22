from django.contrib import admin
from .models import User, Service, Appointment, Product, ServiceProduct

# Register your models here.
admin.site.register(User)
admin.site.register(Service)
admin.site.register(Appointment)
admin.site.register(Product)
admin.site.register(ServiceProduct)