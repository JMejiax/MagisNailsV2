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

export default function ResetForm({ open, handleClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError('Invalid email address');
      return;
    }
    setError('');

    // Get user id with the email
    const response = await fetch(`http://127.0.0.1:8000/users/email/?email=${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).catch(error => {
      alert("Error al conectar con el servidor.")
    })

    const userData = await response.json();

    if (response.status === 200) {
      //If user is correct, change the password
      const response = await fetch(`${apiUrl}/user/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "name": userData.name,
          "lastname": userData.lastname,
          "phone": userData.phone,
          "email": userData.email,
          "password": password,
          "failedLogins": 0,
          "isLocked": false
        })
      }).catch(error => {
        alert("Error al conectar con el servidor.")
      })

      const pswdChangeResponse = await response.json();
      
      if(pswdChangeResponse.status === 200 || pswdChangeResponse.status === undefined){
        alert("Se realiza el cambio de contraseña.")
      }else{
        alert("Ocurrió un error al cambiar la contraseña.")
      }


  } else if (response.status === 404) {
      alert("El usuario no existe.");
  }
    setPassword('');
    setEmail('');
    handleClose();
  };

  const handleClickShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
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
          Cambiar Contraseña
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Correo Electronico"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!error}
            helperText={error}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="newPassword"
            label="Contraseña Nueva"
            type={showPassword ? 'text' : 'password'}
            id="newPassword"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: '#FD5DA5' }}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

