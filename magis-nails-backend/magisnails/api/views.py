from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth import get_user_model, authenticate
from django.db.models import Count, Sum, F, Q, Value, Subquery, OuterRef
from django.db.models.functions import Coalesce
from django.db import transaction
from django.core.exceptions import ValidationError
from datetime import datetime, timedelta, time
from .models import User, Service, Appointment, Product
from .serializers import LoginSerializer, UserSerializer, ServiceSerializer, AppointmentSerializer, ProductSerializer, ServiceProduct

@api_view(['GET'])
def get_routes(request):
    routes = [
        'GET /',
        'GET /users',
        'POST /users',
        'GET /user/<id>',
        'PUT /user/<id>',
        'DELETE /user/<id>',
    ]

    return Response(routes)


User = get_user_model()

@api_view(['POST'])
@transaction.atomic
def custom_token_obtain_pair(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        email = request.data.get('email')
        password = request.data.get('password')
        
        user = authenticate(email=email, password=password)
        
        if user:
            if user.isLocked:
                return Response({"detail": "User account is locked due to too many failed login attempts."}, status=status.HTTP_403_FORBIDDEN)
            
            # Reset failed login attempts upon successful login
            user.failedLogins = 0
            user.save()

            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        else:
            # Handle invalid credentials
            existing_user = User.objects.filter(email=email).first()
            if existing_user:
                existing_user.failedLogins += 1
                if existing_user.failedLogins >= 3:
                    existing_user.isLocked = True
                    existing_user.save()                    
                    return Response({"detail": "User account is locked due to too many failed login attempts."}, status=status.HTTP_403_FORBIDDEN)
                existing_user.save()

            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def custom_token_refresh(request):
    serializer = TokenRefreshSerializer(data=request.data)
    try:
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)
    except TokenError as e:
        # Handle token errors, including blacklist errors
        return Response({"detail": str(e)}, status=status.HTTP_401_UNAUTHORIZED)
    except InvalidToken as e:
        # Handle invalid token errors
        return Response({"detail": str(e)}, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        # Handle any other exceptions
        return Response({"detail": "An error occurred."}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET', 'POST'])
def user_list(request):
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def user_detail(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    elif request.method == 'PUT':
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def get_user_by_email(request):
    email = request.query_params.get('email')
    if not email:
        return Response({"detail": "Email parameter is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
        if user.isActive and not user.isLocked:
            user.update_last_login()
    except User.DoesNotExist:
        return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = UserSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET', 'POST'])
def service_list(request):
    if request.method == 'GET':
        services = Service.objects.all()
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = ServiceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def service_detail(request, pk):
    try:
        service = Service.objects.get(pk=pk)
    except Service.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ServiceSerializer(service)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = ServiceSerializer(service, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        service.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
@api_view(['GET'])
def validate_service(request, service_id):
    try:
        service = Service.objects.get(pk=service_id, isActive=True)
    except Service.DoesNotExist:
        return Response({'status': 'error', 'message': 'Service does not exist or is inactive.'}, status=404)

    service_products = ServiceProduct.objects.filter(service=service)

    for service_product in service_products:
        product = service_product.product
        if product.isActive and product.quantity < service_product.units_to_reduce:
            return Response({'status': 'error', 'available': False}, status=400)

    return Response({'status': 'success', 'available': True}, status=200)

@api_view(['GET', 'POST'])
@parser_classes([MultiPartParser, FormParser])
def appointment_list(request):
    if request.method == 'GET':
        appointments = Appointment.objects.order_by('date', 'time')
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = AppointmentSerializer(data=request.data)
        try:
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as err:
            return Response({'errors': [str(err)]}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def appointment_detail(request, pk):
    try:
        appointment = Appointment.objects.get(pk=pk)
    except Appointment.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = AppointmentSerializer(appointment)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = AppointmentSerializer(appointment, data=request.data, partial=True)
        try:
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
        except ValidationError as err:
            return Response({'errors': [str(err)]}, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        appointment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET', 'POST'])
def product_list(request):
    if request.method == 'GET':
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        product_serializer = ProductSerializer(data=request.data)
        if product_serializer.is_valid():
            product_serializer.save()
            return Response(product_serializer.data, status=status.HTTP_201_CREATED)
        return Response(product_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def product_detail(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ProductSerializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'PUT':
        product_serializer = ProductSerializer(product, data=request.data)
        if product_serializer.is_valid():
            product_serializer.save()
            return Response(product_serializer.data, status=status.HTTP_200_OK)
        return Response(product_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
def get_available_times(date, duration):
    start_time = time(8, 0)  # Start of the working day
    end_time = time(17, 0)  # End of the working day
    available_times = []

    # Get all appointments for the given date
    appointments = Appointment.objects.filter(date=date).order_by('time')

    current_time = datetime.combine(date, start_time)

    for appointment in appointments:
        appointment_start = datetime.combine(date, appointment.time)
        appointment_end = appointment_start + timedelta(minutes=appointment.duration)

        # If there's a gap between the current time and the next appointment
        while current_time + timedelta(minutes=duration) <= appointment_start:
            available_times.append(current_time.time())
            current_time += timedelta(minutes=duration)

        # Move the current time to the end of the appointment
        current_time = max(current_time, appointment_end)

    # Fill in any remaining time slots until the end of the working day
    while current_time + timedelta(minutes=duration) <= datetime.combine(date, end_time):
        available_times.append(current_time.time())
        current_time += timedelta(minutes=duration)

    return available_times

@api_view(['GET'])
def available_times(request, date):
    try:
        date = datetime.strptime(date, '%Y-%m-%d').date()
    except ValueError:
        return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        duration = int(request.query_params.get('duration'))
    except (TypeError, ValueError):
        return Response({"error": "Invalid or missing duration. Duration should be an integer."}, status=status.HTTP_400_BAD_REQUEST)

    available_times_list = get_available_times(date, duration)
    return Response({"available_times": available_times_list}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_appointments_by_month(request, year, month):
    try:
        # Convertir los parámetros a enteros
        year = int(year)
        month = int(month)
        
        # Filtrar las citas por año y mes
        appointments = Appointment.objects.filter(date__year=year, date__month=month).order_by('date', 'time')

        # Serializar las citas
        serializer = AppointmentSerializer(appointments, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except ValueError:
        return Response({'error': 'Año o mes inválidos.'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def get_appointments_by_date(request):
    try:
        # Extract data from request
        user_id = request.data.get('user_id')
        month = int(request.data.get('month'))
        year = int(request.data.get('year'))

        if not month or not year:
            return Response({'error': 'Month and year are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get the authenticated user
        user = request.user

        # Check if the user is an admin
        if user.isAdmin:
            # If the user is an admin, get all appointments for the given month and year
            appointments = Appointment.objects.filter(date__year=year, date__month=month)
        else:
            # If the user is not an admin, get appointments for the specified user
            if not user_id:
                return Response({'error': 'User ID is required for non-admin users'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Ensure the user can only query their own appointments
            if user_id != user.id:
                return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

            appointments = Appointment.objects.filter(user=user_id, date__year=year, date__month=month)
        
        
        # Serialize the appointments
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
# REPORTS
@api_view(['GET'])
def user_login_activity_report(request):
    users = User.objects.values('name', 'lastname', 'email', 'failedLogins', 'isLocked', 'last_login')
    return Response(users)

@api_view(['GET'])
def service_usage_report(request):
    service_usage = Appointment.objects.values('service__name').annotate(
        total_appointments=Count('id'),
        total_revenue=Sum('totalCost')
    )
    return Response(service_usage)

# @api_view(['GET'])
# def product_usage_report(request):
#     product_usage = ServiceProduct.objects.values('product__name').annotate(
#         total_units_used=Sum('units_to_reduce')
#     )
#     return Response(product_usage)
@api_view(['GET'])
def product_usage_report(request):
    # Step 1: Get all products and store them in a dictionary
    products = Product.objects.all()
    product_usage_dict = {product.id: {'name': product.name, 'total_units_used': 0} for product in products}

    # Step 2: Get all appointments
    appointments = Appointment.objects.all()

    # Step 3 & 4: Iterate through each appointment and update the product usage
    for appointment in appointments:
        service_id = appointment.service.id
        service_products = ServiceProduct.objects.filter(service_id=service_id)
        
        for service_product in service_products:
            product_id = service_product.product.id
            if product_id in product_usage_dict:
                product_usage_dict[product_id]['total_units_used'] += service_product.units_to_reduce

    # Convert dictionary to a list for the response
    product_usage_list = [{'name': value['name'], 'total_units_used': value['total_units_used']} for key, value in product_usage_dict.items()]

    return Response(product_usage_list)

@api_view(['GET'])
def user_appointment_history_report(request, user_id):
    appointments = Appointment.objects.filter(user_id=user_id).values(
        'service__name', 'date', 'time', 'totalCost'
    )
    return Response(appointments)

@api_view(['GET'])
def service_appointment_summary_report(request, start_date, end_date):
    service_summary = Appointment.objects.filter(date__range=[start_date, end_date]).values(
        'service__name'
    ).annotate(
        total_appointments=Count('id'),
        total_revenue=Sum('totalCost')
    )
    return Response(service_summary)

@api_view(['GET'])
def revenue_report(request, start_date, end_date):
    revenue = Appointment.objects.filter(date__range=[start_date, end_date]).aggregate(
        total_revenue=Sum('totalCost')
    )
    return Response(revenue)
