from rest_framework import serializers
from .models import User, Service, Appointment, Product, ServiceProduct
from django.contrib.auth import authenticate


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        return data

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'lastname', 'phone', 'email', 'password', 'isAdmin', 'isActive', 'failedLogins', 'isLocked']
        # extra_kwargs = {
        #     'password': {'write_only': True}
        # }

    def create(self, validated_data):
        is_admin = validated_data.pop('isAdmin', False)
        if is_admin:
            user = User.objects.create_superuser(**validated_data)
        else:
            user = User.objects.create_user(**validated_data)
        return user
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['id', 'user', 'service', 'totalCost', 'date', 'time', 'duration', 'payment']
        extra_kwargs = {
            'totalCost': {'required': False}
        }

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'description', 'price', 'duration', 'image', 'isActive']

class ServiceProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceProduct
        fields = [ 'product', 'service', 'units_to_reduce']
        extra_kwargs = {
            'product': {'required': False}
        }

class ProductSerializer(serializers.ModelSerializer):
    services = ServiceProductSerializer(source='serviceproduct_set', many=True)  #read_only=True

    class Meta:
        model = Product
        fields = ['id', 'name', 'quantity', 'isActive', 'services']

    def create(self, validated_data):
        services_data = validated_data.pop('serviceproduct_set', [])
        product = Product.objects.create(**validated_data)
        
        for service_data in services_data:
            ServiceProduct.objects.create(product=product, **service_data)
        
        return product
    
    def update(self, instance, validated_data):
        services_data = validated_data.pop('serviceproduct_set')
        instance = super().update(instance, validated_data)

        # Update ServiceProduct relationships
        instance.serviceproduct_set.all().delete()
        for service_data in services_data:
            ServiceProduct.objects.create(product=instance, **service_data)

        return instance


