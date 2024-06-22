import React, { useState } from 'react';
import {
  Container, Box, TextField, FormControlLabel, Switch,
  Button, Typography, IconButton, InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function UserCreationForm() {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    isActive: true,
    isAdmin: false
  });

  const [errors, setErrors] = useState({
    phoneNumber: '',
    email: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setFormValues({
      ...formValues,
      [name]: type === 'checkbox' ? checked : value
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
      alert('Porfavor verificar los errores.');
      return;
    }

    const response = await fetch(`http://127.0.0.1:8000/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "name": formValues.firstName,
        "lastname": formValues.lastName,
        "phone": formValues.phoneNumber,
        "email": formValues.email,
        "password": formValues.password,
        "isAdmin": formValues.isAdmin,
        "isActive": formValues.isActive,
        "failedLogins": 0,
        "isLocked": false
      })
    }).catch(error => {
      alert("Error al conectar con el servidor.")
    })

    const newUserResponse = await response.json();

    if (newUserResponse.status === 201) {
      alert(`Usuario (${formValues.email}) creado con éxito.`);
    } else if (newUserResponse.email[0] === 'user with this email already exists.') {
      alert("Ya existe un usuario con el correo ingresado.");
    } else {
      // console.log(newUserResponse)
      alert("Ocurrio un error al guardar el usuario.");
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
          AÑADIR USUARIO
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
        <Box sx={{ display: 'flex', gap: '20px' }}>
          <FormControlLabel
            control={
              <Switch
                checked={formValues.isActive}
                onChange={handleChange}
                name="isActive"
              />
            }
            label="Activo"
          />
          <FormControlLabel
            control={
              <Switch
                checked={formValues.isAdmin}
                onChange={handleChange}
                name="isAdmin"
              />
            }
            label="Admin"
          />
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
            CREAR USUARIO
          </Button>

          <Button
            variant="contained"
            sx={{
              backgroundColor: '#e0e0e0',
              '&:hover': { backgroundColor: '#bdbdbd' },
              color: '#000'
            }}
            onClick={() => { navigate('/usuarios') }}
          >
            CANCELAR
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
