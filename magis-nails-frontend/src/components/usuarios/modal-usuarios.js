import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, FormControlLabel, Switch, Button, Typography, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function UserModal({ open, handleClose, user, handleSave }) {

    const [showPassword, setShowPassword] = useState(false);
    const [formValues, setFormValues] = useState({
        name: user.name,
        lastname: user.lastname,
        phone: user.phone,
        email: user.email,
        password: '',
        admin: user.isAdmin,
        active: user.isActive,
        isLocked: user.isLocked,
    });

    const [errors, setErrors] = useState({
        phone: '',
        email: ''
    });

    const handleChange = (event) => {
        const { name, value, checked, type } = event.target;
        setFormValues({
            ...formValues,
            [name]: type === 'checkbox' ? checked : value
        });

        if (name === 'phone') {
            const phonePattern = /^[0-9]{8}$/;
            setErrors({
                ...errors,
                phone: phonePattern.test(value) ? '' : 'El número de teléfono debe ser de 8 dígitos.'
            });
        }

        if (name === 'email') {
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            setErrors({
                ...errors,
                email: emailPattern.test(value) ? '' : 'Dirección inválida.'
            });
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Check for any existing validation errors before submitting
        if (errors.phone || errors.email) {
            alert('Verifique los errores antes de guardar.');
            return;
        }
        handleSave(user, formValues);
        handleClose();
    };

    const handleClickShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword);
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px'
                }}
            >
                <Typography variant="h6" component="h2">Actualiza Usuario</Typography>
                <TextField
                    label="Nombre"
                    name="name"
                    value={formValues.name}
                    onChange={handleChange}
                    required
                    fullWidth
                />
                <TextField
                    label="Apellido"
                    name="lastname"
                    value={formValues.lastname}
                    onChange={handleChange}
                    required
                    fullWidth
                />
                <TextField
                    label="Número de teléfono"
                    name="phone"
                    value={formValues.phone}
                    onChange={handleChange}
                    required
                    fullWidth
                    error={!!errors.phone}
                    helperText={errors.phone}
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
                    required
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

                <FormControlLabel
                    control={
                        <Switch
                            checked={formValues.admin}
                            onChange={handleChange}
                            name="admin"
                        />
                    }
                    label="Admin"
                />
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
                <FormControlLabel
                    control={
                        <Switch
                            checked={formValues.isLocked}
                            onChange={handleChange}
                            name="isLocked"
                        />
                    }
                    label="Bloqueado"
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2, gap: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        sx={{ backgroundColor: '#f48fb1', '&:hover': { backgroundColor: '#f06292' }, color: '#fff' }}
                    >
                        Guardar
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleClose}
                        sx={{ backgroundColor: '#e0e0e0', '&:hover': { backgroundColor: '#bdbdbd' }, color: '#000' }}
                    >
                        Cancelar
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}
