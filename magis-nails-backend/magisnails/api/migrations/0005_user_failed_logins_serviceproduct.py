# Generated by Django 5.0.6 on 2024-06-13 03:56

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_alter_appointment_payment_alter_service_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='failed_logins',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.CreateModel(
            name='ServiceProduct',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('units_to_reduce', models.PositiveIntegerField(default=1, help_text='Number of units to reduce when this service is booked')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.product')),
                ('service', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.service')),
            ],
        ),
    ]
