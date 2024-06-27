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
    path('validate_service/<int:service_id>/', views.validate_service, name='validate_service'),

    # APPOINTMENT MANAGEMENT
    path("appointments", views.appointment_list, name="appointments"),
    path("appointment/<str:pk>", views.appointment_detail, name="appointment"),
    path("appointment/<str:year>/<str:month>", views.get_appointments_by_month, name="appointment_by_month"),

    path('listappointments', views.get_appointments_by_date, name="appointments_list"),
    path('availabletime/<str:date>', views.available_times, name="available_time"),

    # PRODUCT MANAGEMENT
    path("products", views.product_list, name="products"),
    path("product/<str:pk>", views.product_detail, name="product"),

    # REPORTS
    path('login_activity_report', views.user_login_activity_report, name='login_activity_report'),
    path('service_usage_report', views.service_usage_report, name='service_usage_report'),
    path('product_usage_report', views.product_usage_report, name='product_usage_report'),
    path('user_appointment_history_report/<int:user_id>', views.user_appointment_history_report, name='user_appointment_history_report'),
    path('service_appointment_summary_report/<str:start_date>/<str:end_date>', views.service_appointment_summary_report, name='service_appointment_summary_report'),
    path('revenue_report/<str:start_date>/<str:end_date>', views.revenue_report, name='revenue_report'),

    # JWT AUTHENTICATION
    # path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    #JWT CUSTOM AUTHENTICATION
    path('api/token/', views.custom_token_obtain_pair, name='token_obtain_pair'),
    path('api/token/refresh/', views.custom_token_refresh, name='token_refresh'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
