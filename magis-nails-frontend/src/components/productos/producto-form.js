import React, { useState, useEffect } from 'react';
import { Container, Box, TextField, FormControlLabel, Switch, Button, Typography, FormControl, InputLabel, Select, MenuItem, FormHelperText, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { apiUrl } from '../../util/apiUrl';

export default function ProductForm() {
    const navigate = useNavigate();

    const [formValues, setFormValues] = useState({
        id: '',
        name: '',
        quantity: '',
        selectedServices: [],
        active: true
    });

    const [services, setServices] = useState([]);
    const [serviceQuantities, setServiceQuantities] = useState({});

    const [errors, setErrors] = useState({
        name: '',
        quantity: '',
        selectedServices: '',
    });


    const handleChange = (event) => {
        const { name, value, checked, type } = event.target;
        if (name.startsWith('serviceQuantity-')) {
            const serviceId = name.split('-')[1];
            setServiceQuantities({
                ...serviceQuantities,
                [serviceId]: value,
            });
        } else {
            setFormValues({
                ...formValues,
                [name]: type === 'checkbox' ? checked : value,
            });
        }

        if (name === 'quantity') {
            const quantityPattern = /^[0-9]+$/;
            setErrors({
                ...errors,
                quantity: quantityPattern.test(value) ? '' : 'Ingresar un número',
            });
        }

        if (name === 'selectedServices') {
            setErrors({
                ...errors,
                selectedServices: value.length > 0 ? '' : 'Seleccione al menos un servicio.',
            });
        }
    };

    const handleServiceChange = (event) => {
        const { value } = event.target;
        const newSelectedServices = typeof value === 'string' ? value.split(',') : value;
        setFormValues({ ...formValues, selectedServices: newSelectedServices });

        // Initialize quantities for new services
        const newServiceQuantities = { ...serviceQuantities };
        newSelectedServices.forEach((serviceName) => {
            const service = services.find((s) => s.name === serviceName);
            if (service && !newServiceQuantities[service.id]) {
                newServiceQuantities[service.id] = 1;
            }
        });
        setServiceQuantities(newServiceQuantities);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newErrors = {
            name: formValues.name ? '' : 'Nombre es requerido',
            quantity: formValues.quantity ? '' : 'Cantidad es requerida',
            selectedServices: formValues.selectedServices.length > 0 ? '' : 'Seleccione al menos un servicio.',
        };

        setErrors(newErrors);

        if (Object.values(newErrors).some(error => error)) {
            alert('Arreglar los errores antes de enviar el formulario.');
            return;
        }

        // Add service quantities to the form values
        const servicesWithQuantities = formValues.selectedServices.map((serviceName) => {
            const service = services.find((s) => s.name === serviceName);
            return {
                'service': service.id,
                'units_to_reduce': serviceQuantities[service.id],
            };
        });

        const formData = {
            "name": formValues.name,
            "quantity": formValues.quantity,
            "isActive": formValues.active,
            'services': servicesWithQuantities
        };

        // Handle form submission
        const response = await fetch(`${apiUrl}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        }).catch(error => {
            alert("Error al conectar con el servidor.")
        })

        const newProdResponse = await response.json();

        if (newProdResponse.status === 201 || (newProdResponse.status === undefined && !(newProdResponse.name[0] === 'product with this name already exists.'))) {
            // console.log('Form submitted', newProdResponse);
            alert(`Producto (${formValues.name}) creado con éxito.`);
        } else if (newProdResponse.name[0] === 'product with this name already exists.') {
            alert("Ya existe un producto con el nombre ingresado.");
        } else {
            // console.log(newUserResponse)
            alert("Ocurrio un error al guardar el usuario.");
        }
    };


    const getServices = async () => {
        const response = await fetch(`${apiUrl}/services`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).catch(error => {
            alert("Error al conectar con el servidor.")
        })

        const servicesResponse = await response.json();

        if (servicesResponse.status === 200 || servicesResponse.status === undefined) {
            setServices(servicesResponse);
        } else {
            alert("Ocurrio un error al obtener los usuarios.");
        }
    }

    useEffect(() => {
        getServices();
    }, []);

    return (
        <Container sx={{ marginTop: '25px', marginBottom: '25px' }}>
            <Box
                sx={{
                    background: 'linear-gradient(to right, #fd5da573, #ffffff6e)',
                    padding: '10px',
                    borderRadius: '5px',
                    marginBottom: '20px',
                    textAlign: 'center',
                }}
            >
                <Typography
                    variant="h3"
                    gutterBottom
                    sx={{
                        fontWeight: 300,
                        letterSpacing: '0.1em',
                        color: '#901447',
                    }}
                >
                    AÑADIR PRODUCTO
                </Typography>
            </Box>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                }}
            >
                <TextField
                    label="ID"
                    name="id"
                    value={formValues.id ? formValues.id : 'CAMPO DEFINIDO DESPUES DE GUARDAR'}
                    disabled={true}
                    fullWidth
                />
                <TextField
                    label="Nombre"
                    name="name"
                    value={formValues.name}
                    onChange={handleChange}
                    required
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name}
                />
                <TextField
                    label="Cantidad"
                    name="quantity"
                    value={formValues.quantity}
                    onChange={handleChange}
                    required
                    fullWidth
                    error={!!errors.quantity}
                    helperText={errors.quantity}
                />

                <FormControl fullWidth error={!!errors.selectedServices}>
                    <InputLabel id="service-select-label">Servicios Relacionados</InputLabel>
                    <Select
                        label="Servicios Relacionados"
                        labelId="service-select-label"
                        multiple
                        value={formValues.selectedServices}
                        name="selectedServices"
                        onChange={handleServiceChange}
                        renderValue={(selected) => selected.join(', ')}
                    >
                        {services.map((service) => (
                            <MenuItem key={service.id} value={service.name}>
                                {service.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>{errors.selectedServices}</FormHelperText>
                </FormControl>

                <Grid container spacing={2} sx={{ padding: '0 20px' }}>
                    {formValues.selectedServices.map((serviceName) => {
                        const service = services.find((s) => s.name === serviceName);
                        return (
                            <Grid item xs={12} sm={3} key={service.id}>
                                <TextField
                                    label={`Cantidad para ${service.name}`}
                                    name={`serviceQuantity-${service.id}`}
                                    type="number"
                                    value={serviceQuantities[service.id]}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                        );
                    })}
                </Grid>

                <FormControlLabel
                    control={
                        <Switch
                            checked={formValues.active}
                            onChange={handleChange}
                            name="active"
                        />
                    }
                    label="Activo"
                />
                <Box sx={{ display: 'flex', gap: '20px' }}>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            backgroundColor: '#f48fb1',
                            '&:hover': { backgroundColor: '#f06292' },
                            color: '#fff',
                        }}
                    >
                        CREAR PRODUCTO
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#e0e0e0',
                            '&:hover': { backgroundColor: '#bdbdbd' },
                            color: '#000',
                        }}
                        onClick={() => { navigate('/productos'); }}
                    >
                        CANCELAR
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
