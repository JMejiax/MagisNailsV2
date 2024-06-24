import React, { useState } from 'react';
import AuthContext from "../../context/AuthContext";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import RegistroForm from './registrarse';
import ResetForm from './reset';
import { IconButton, InputAdornment } from '@mui/material';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';

const theme = createTheme();

export default function LoginPage() {

  const { loginUser } = React.useContext(AuthContext);

  const [isCreateAccountModalOpen, setCreateAccountModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setForgotPasswordModalOpen] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleOpenCreateAccountModal = () => setCreateAccountModalOpen(true);
  const handleCloseCreateAccountModal = () => setCreateAccountModalOpen(false);

  const handleOpenForgotPasswordModal = () => setForgotPasswordModalOpen(true);
  const handleCloseForgotPasswordModal = () => setForgotPasswordModalOpen(false);

  const handleClickShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(/pictures/magisnails_login.jpeg)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: '#f48fb1' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Magis Nails
            </Typography>
            <Box component="form" onSubmit={loginUser} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                placeholder='Ingrese el usuario...'
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder='Ingrese la contraseña...'
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
                  )}}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, bgcolor: '#f48fb1' }}
              >
                Iniciar Sesion
              </Button>
              <Box sx={{
                padding: '1rem',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Typography
                  component="p"
                  color={'#000'}
                  sx={{
                    fontWeight: '300',
                    textDecoration: 'underline',
                    textDecorationColor: '#f48fb1',
                    textDecorationThickness: '1px',
                    textUnderlineOffset: '4px',
                    cursor: 'pointer' // Makes the text look clickable
                  }}
                  onClick={handleOpenForgotPasswordModal}
                >
                  OLVIDÉ MI CONTRASEÑA
                </Typography>
                <Typography
                  component="p"
                  color={'#000'}
                  sx={{
                    fontWeight: '300',
                    textDecoration: 'underline',
                    textDecorationColor: '#f48fb1',
                    textDecorationThickness: '1px',
                    textUnderlineOffset: '4px',
                    cursor: 'pointer'
                  }}
                  onClick={handleOpenCreateAccountModal}
                >
                  CREAR CUENTA
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <RegistroForm open={isCreateAccountModalOpen} handleClose={handleCloseCreateAccountModal} />
      <ResetForm open={isForgotPasswordModalOpen} handleClose={handleCloseForgotPasswordModal} />
    </ThemeProvider>
  );
}
