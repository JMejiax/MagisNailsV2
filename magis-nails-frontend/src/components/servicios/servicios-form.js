import React, { useState } from 'react';
import { Container, Box, TextField, FormControlLabel, Switch, Button, Typography, InputAdornment } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../../util/apiUrl';

const Input = styled('input')({
    display: 'none',
});

export default function ServiciosForm() {
    const navigate = useNavigate();

    const [formValues, setFormValues] = useState({
        serviceName: '',
        serviceDescription: '',
        servicePrice: '',
        serviceDuration: '',
        isActive: true,
        serviceImage: null
    });

    const [errors, setErrors] = useState({
        servicePrice: '',
        serviceDuration: '',
        serviceImage: ''
    });

    const handleChange = (event) => {
        const { name, value, type, files } = event.target;
        setFormValues({
            ...formValues,
            [name]: type === 'file' ? files[0] : value
        });

        if (type === 'file' && files.length > 0) {
            setErrors({ ...errors, serviceImage: '' });
        } else if (name === 'servicePrice') {
            const pricePattern = /^[0-9]+(\.[0-9]{1,2})?$/;
            setErrors((prevErrors) => ({
                ...prevErrors,
                servicePrice: pricePattern.test(value) ? '' : 'Ingresar un número.'
            }));
        } else if (name === 'serviceDuration') {
            const durationPattern = /^[0-9]+$/;
            setErrors((prevErrors) => ({
                ...prevErrors,
                serviceDuration: durationPattern.test(value) ? '' : 'Ingresar un número.'
            }));
        } else if (name === 'serviceImage') {
            if (files.length === 0) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    serviceImage: 'Campo requerido.'
                }));
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    serviceImage: ''
                }));
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        
        const newErrors = {
            serviceName: formValues.serviceName ? '' : 'Este campo es requerido.',
            serviceDescription: formValues.serviceDescription ? '' : 'Este campo es requerido.',
            servicePrice: formValues.servicePrice ? '' : 'Este campo es requerido.',
            serviceDuration: formValues.serviceDuration ? '' : 'Este campo es requerido.',
            serviceImage: formValues.serviceImage ? '' : 'Este campo es requerido.',
        };

        setErrors(newErrors);

        if (Object.values(newErrors).some(error => error)) {
            return;
        }

        const formData = new FormData();
        formData.append('name', formValues.serviceName);
        formData.append('description', formValues.serviceDescription);
        formData.append('price', formValues.servicePrice);
        formData.append('duration', formValues.serviceDuration);
        formData.append('image', formValues.serviceImage);
        formData.append('isActive', formValues.isActive);

        const response = await fetch(`${apiUrl}/services`, {
            method: 'POST',
            body: formData
        }).catch(error => {
            alert("Error al conectar con el servidor.")
        })

        const newServiceResponse = await response.json();

        if (newServiceResponse.status === 201 || newServiceResponse.status === undefined) {
            // console.log(formValues)
            // console.log(newServiceResponse)
            alert(`Servicio de (${formValues.serviceName}) creado con éxito.`);
        } else {
            // console.log(newServiceResponse)
            alert("Ocurrio un error al guardar el servicio.");
        }
    };

    return (
        <Container sx={{ marginTop: '25px', marginBottom: "25px" }}>
            <Box
                sx={{
                    background: 'linear-gradient(to right, #fd5da573, #ffffff6e)',
                    padding: '10px',
                    borderRadius: '5px',
                    marginBottom: '20px',
                    textAlign: 'center'
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
                    AÑADIR SERVICIO
                </Typography>
            </Box>
            <Box
                component="form"
                encType="multipart/form-data"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px'
                }}
            >
                <TextField
                    label="Nombre"
                    name="serviceName"
                    value={formValues.serviceName}
                    onChange={handleChange}
                    error={!!errors.serviceName}
                    helperText={errors.serviceName}
                    fullWidth
                />
                <TextField
                    label="Descripción"
                    name="serviceDescription"
                    value={formValues.serviceDescription}
                    onChange={handleChange}
                    error={!!errors.serviceDescription}
                    helperText={errors.serviceDescription}
                    fullWidth
                    multiline
                    rows={4}
                />
                <TextField
                    label="Precio"
                    name="servicePrice"
                    value={formValues.servicePrice}
                    onChange={handleChange}

                    fullWidth
                    error={!!errors.servicePrice}
                    helperText={errors.servicePrice}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">₡</InputAdornment>,
                    }}
                />
                <TextField
                    label="Duración (minutos)"
                    name="serviceDuration"
                    value={formValues.serviceDuration}
                    onChange={handleChange}

                    fullWidth
                    error={!!errors.serviceDuration}
                    helperText={errors.serviceDuration}
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={formValues.isActive}
                            onChange={(e) => setFormValues({ ...formValues, isActive: e.target.checked })}
                            name="isActive"
                        />
                    }
                    label="Activo"
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '30px 0px' }}>
                    <label htmlFor="serviceImage">
                        <Input accept="image/*" id="serviceImage" type="file" name="serviceImage" onChange={handleChange} />
                        <Button variant="contained" component="span">
                            Agregar Imagen
                        </Button>
                    </label>
                    {formValues.serviceImage && (
                        <Typography variant="body2">{formValues.serviceImage.name}</Typography>
                    )}
                    {!!errors.serviceImage && (
                        <Typography variant="body2" color="error">{errors.serviceImage}</Typography>
                    )}
                </Box>
                <Box sx={{ display: 'flex', gap: '20px' }}>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            backgroundColor: '#f48fb1',
                            '&:hover': { backgroundColor: '#f06292' },
                            color: '#fff'
                        }}
                    >
                        CREAR SERVICIO
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#e0e0e0',
                            '&:hover': { backgroundColor: '#bdbdbd' },
                            color: '#000'
                        }}
                        onClick={() => { navigate('/servicios') }}
                    >
                        CANCELAR
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
