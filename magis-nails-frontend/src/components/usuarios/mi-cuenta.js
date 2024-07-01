import React, { useState } from 'react';
import {
    Container, Box, TextField, Button, Typography, IconButton, InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { apiUrl } from '../../util/apiUrl';

export default function MiCuentaForm() {
    const navigate = useNavigate();

    const { userData, setUserData } = React.useContext(AuthContext);

    const [formValues, setFormValues] = useState({
        firstName: userData.name,
        lastName: userData.lastname,
        phoneNumber: userData.phone,
        email: userData.email,
        password: ''
    });

    const [errors, setErrors] = useState({
        phoneNumber: '',
        email: ''
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValues({
            ...formValues,
            [name]: value
        });

        if (name === 'phoneNumber') {
            const phoneNumberPattern = /^[0-9]{8}$/;
            setErrors({
                ...errors,
                phoneNumber: phoneNumberPattern.test(value) ? '' : 'Phone number must be 8 digits'
            });
        }

        if (name === 'email') {
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            setErrors({
                ...errors,
                email: emailPattern.test(value) ? '' : 'Invalid email address'
            });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Check for any existing validation errors before submitting
        if (errors.phoneNumber || errors.email) {
            alert('Por favor solucionar los errores.');
            return;
        }

        const newUserData = {
            name: formValues.firstName,
            lastname: formValues.lastName,
            phone: formValues.phoneNumber,
            email: formValues.email,
        };

        if (formValues.password !== '') {
            newUserData.password = formValues.password;
        }

        const response = await fetch(`${apiUrl}/user/${userData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUserData)
        }).catch(error => {
            alert("Error al conectar con el servidor.")
        })

        const infoChangeResponse = await response.json();

        if (infoChangeResponse.status === 200 || infoChangeResponse.status === undefined) {
            alert("Se actualizó el usuario satisfactoriamente.")
            window.location.reload();
        } else {
            alert("Ya existe un usuario con este correo.")
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
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
                    ACTUALIZAR PERFIL
                </Typography>
            </Box>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px'
                }}
            >
                <TextField
                    label="Nombre"
                    name="firstName"
                    value={formValues.firstName}
                    onChange={handleChange}
                    required
                    fullWidth
                />
                <TextField
                    label="Apellido"
                    name="lastName"
                    value={formValues.lastName}
                    onChange={handleChange}
                    required
                    fullWidth
                />
                <TextField
                    label="Número de teléfono"
                    name="phoneNumber"
                    value={formValues.phoneNumber}
                    onChange={handleChange}
                    required
                    fullWidth
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber}
                />
                <TextField
                    label="Correo"
                    name="email"
                    type="email"
                    value={formValues.email}
                    onChange={handleChange}
                    required
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email}
                />
                <TextField
                    label="Contraseña"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formValues.password}
                    onChange={handleChange}

                    fullWidth
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
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
                        ACTUALIZAR
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#e0e0e0',
                            '&:hover': { backgroundColor: '#bdbdbd' },
                            color: '#000'
                        }}
                        onClick={() => { navigate('/') }}
                    >
                        CANCELAR
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
