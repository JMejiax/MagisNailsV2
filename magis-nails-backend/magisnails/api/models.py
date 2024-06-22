from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.core.exceptions import ValidationError

class UserManager(BaseUserManager):
    def create_user(self, email, name, lastname, phone, password, isAdmin=False, isActive=True, failedLogins=0, isLocked=False):
        if not email:
            raise ValueError(_('Users must have an email address'))
        if not password:
            raise ValueError(_('Users must have a password'))
        
        user = self.model(
            email=self.normalize_email(email),
            name=name,
            lastname=lastname,
            phone=phone,
            isAdmin=isAdmin,
            isActive=isActive,
            failedLogins=failedLogins,
            isLocked=isLocked
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, lastname, phone, password, isActive, failedLogins, isLocked):
        user = self.create_user(
            email=email,
            password=password,
            name=name,
            lastname=lastname,
            phone=phone,
            isAdmin=True,
            isActive=True,
            failedLogins=failedLogins,
            isLocked=isLocked
        )
        user.isAdmin = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    lastname = models.CharField(max_length=50)
    phone = models.CharField(max_length=15)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    isAdmin = models.BooleanField(default=False)
    isActive = models.BooleanField(default=True)
    failedLogins = models.IntegerField(default=0)
    isLocked = models.BooleanField(default=False)

    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'lastname', 'phone', 'password']
    
    def __str__(self):
        return f'{self.name} {self.lastname}'
    
    def has_perm(self, perm, obj=None):
        return self.isAdmin
    
    def has_module_perms(self, app_label):
        return self.isAdmin

    @property
    def is_staff(self):
        return self.isAdmin

    @property
    def is_superuser(self):
        return self.isAdmin

class Service(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.PositiveIntegerField(help_text='Duration in minutes')
    image = models.ImageField(upload_to='files/service_images/')
    isActive = models.BooleanField(default=True)

    REQUIRED_FIELDS = ['name', 'description', 'price', 'duration', 'image']
    
    def __str__(self):
        return self.name

class Product(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    quantity = models.PositiveIntegerField()
    isActive = models.BooleanField(default=True)

    REQUIRED_FIELDS = ['name', 'quantity']
    
    def __str__(self):
        return self.name


class ServiceProduct(models.Model):
    id = models.AutoField(primary_key=True)
    service = models.ForeignKey('Service', on_delete=models.CASCADE)
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    units_to_reduce = models.PositiveIntegerField(default=1, help_text='Number of units to reduce when this service is booked')

    REQUIRED_FIELDS = ['service', 'product', 'units_to_reduce']

    def __str__(self):
        return f"{self.service.name} - {self.product.name} ({self.units_to_reduce} units)"


class Appointment(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    service = models.ForeignKey('Service', on_delete=models.CASCADE)
    totalCost = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    time = models.TimeField()
    duration = models.PositiveIntegerField(help_text='Duration in minutes', default=0)
    payment = models.FileField(upload_to='files/appointment_payments/')

    REQUIRED_FIELDS = ['user', 'service', 'date', 'time', 'payment']

    def save(self, *args, **kwargs):
        is_new = self.pk is None  # Check if this is a new appointment (pk will be None if new)
        if self.service:
            self.duration = self.service.duration
            self.totalCost = self.service.price

            if is_new:  # Only reduce product quantities if this is a new appointment
                # Reduce applicable product quantities
                service_products = ServiceProduct.objects.filter(service=self.service)
                for service_product in service_products:
                    product = service_product.product
                    if product.isActive:  # Check if the product is active
                        if product.quantity >= service_product.units_to_reduce:
                            product.quantity -= service_product.units_to_reduce
                            product.save()
                        else:
                            raise ValidationError(f"Not enough {product.name} available for appointment")

        super().save(*args, **kwargs)

    def __str__(self):
        return f'Appointment for {self.user.name} on {self.date} at {self.time}'


