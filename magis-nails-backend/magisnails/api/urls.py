from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path("", views.get_routes, name="routes"),

    # USER MANAGEMENT
    path("users", views.user_list, name="users"),
    path("user/<str:pk>", views.user_detail, name="user"),
    path('users/email/', views.get_user_by_email, name='get_user_by_email'),

    # SERVICE MANAGEMENT
    path("services", views.service_list, name="services"),
    path("service/<str:pk>", views.service_detail, name="service"),

    # APPOINTMENT MANAGEMENT
    path("appointments", views.appointment_list, name="appointments"),
    path("appointment/<str:pk>", views.appointment_detail, name="appointment"),

    path('listappointments', views.get_appointments_by_date, name="appointments_list"),
    path('availabletime/<str:date>', views.available_times, name="available_time"),

    # PRODUCT MANAGEMENT
    path("products", views.product_list, name="products"),
    path("product/<str:pk>", views.product_detail, name="product"),

    # REPORTS

    # path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('api/token/', views.custom_token_obtain_pair, name='token_obtain_pair'),
    path('api/token/refresh/', views.custom_token_refresh, name='token_refresh'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)