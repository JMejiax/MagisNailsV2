import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Avatar, IconButton, InputAdornment } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { apiUrl } from '../../util/apiUrl';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function RegistroForm({ open, handleClose }) {
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    phone: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{8}$/;
    return phoneRegex.test(phone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone' && value !== '' && !/^\d+$/.test(value)) {
      return; // Prevent non-numeric input
    }
    setFormValues({ ...formValues, [name]: value });

    if (name === 'email') {
      setErrors({ ...errors, email: validateEmail(value) ? '' : 'Correo inválido' });
    }

    if (name === 'phone') {
      setErrors({ ...errors, phone: validatePhone(value) ? '' : 'El número de teléfono debe ser de 8 dígitos.' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation check
    const emailError = validateEmail(formValues.email) ? '' : 'Correo inválido';
    const phoneError = validatePhone(formValues.phone) ? '' : 'El número de teléfono debe ser de 8 dígitos.';

    if (emailError || phoneError) {
      setErrors({ email: emailError, phone: phoneError });
      return;
    }

    const response = await fetch(`${apiUrl}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "name": formValues.firstName,
        "lastname": formValues.lastName,
        "phone": formValues.phone,
        "email": formValues.email,
        "password": formValues.password,
        "isAdmin": false,
        "isActive": true,
        "failedLogins": 0,
        "isLocked": false
      })
    }).catch(error => {
      alert("Error al conectar con el servidor.")
    })

    // const newUserResponse = await response.json();

    if (response.ok) {
      alert(`Usuario (${formValues.email}) creado con éxito.`);
    } else {
      alert("Ya existe un usuario con el correo ingresado.");
    }

    handleClose();
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Avatar sx={{ m: 1, bgcolor: '#FD5DA5', mx: 'auto' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }}>
          Crear Cuenta
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="Nombre"
            name="firstName"
            autoFocus
            value={formValues.firstName}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="lastName"
            label="Apellido"
            name="lastName"
            value={formValues.lastName}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="phone"
            label="Número de Teléfono"
            name="phone"
            value={formValues.phone}
            onChange={handleChange}
            error={!!errors.phone}
            helperText={errors.phone}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} // Only allow numeric input
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={formValues.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: '#FD5DA5' }}
          >
            Crear cuenta
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

