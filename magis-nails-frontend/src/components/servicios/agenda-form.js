import React, { useCallback, useEffect, useState } from 'react';
import {
  Container, TextField, Button, Typography, Box, MenuItem, Grid, FormControl, InputLabel, Select, FormHelperText,
  InputAdornment,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { styled } from '@mui/system';
import AuthContext from '../../context/AuthContext';
import _ from 'lodash';

const Input = styled('input')({
  display: 'none',
});

export default function AgendaForm() {

  const { userData } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [queryParameters] = useSearchParams();
  const selectedServiceId = queryParameters.get("id");
  const [availableTime, setAvailableTime] = useState([]);
  const [services, setServices] = useState([]);
  const [price, setPrice] = useState(0);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingTimes, setLoadingTimes] = useState(false);

  const [formValues, setFormValues] = useState({
    selectedServices: [],
    date: dayjs(),
    time: '',
    paymentFile: null,
  });

  const [errors, setErrors] = useState({
    selectedServices: '',
    paymentFile: '',
  });

  const handleChange = (event) => {
    const { name, value, type, files } = event.target;

    setFormValues({
      ...formValues,
      [name]: type === 'file' ? files[0] : value,
    });

    if (type === 'file' && files.length > 0) {
      setErrors({ ...errors, paymentFile: '' });
    } else if (name === 'selectedServices' && value.length > 0) {
      setErrors({ ...errors, selectedServices: '' });
    } else if (name === 'time' && value !== '') {
      setErrors({ ...errors, time: '' });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let postStatus = '';

    const newErrors = {
      selectedServices: formValues.selectedServices.length > 0 ? '' : 'Seleccione al menos un servicio.',
      paymentFile: formValues.paymentFile ? '' : 'Este campo es requerido.',
      time: formValues.time ? '' : 'Este campo es requerido.',
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    const formattedDate = formValues.date.format('YYYY-MM-DD');

    for (const service of formValues.selectedServices) {
      const serviceInfo = services
        .find(serv => serv.name === service)

      console.log(serviceInfo)

      const formData = new FormData();
      formData.append('user', userData.id);
      formData.append('service', serviceInfo.id);
      formData.append('date', formattedDate);
      formData.append('time', formValues.time);
      formData.append('payment', formValues.paymentFile);

      const response = await fetch(`http://127.0.0.1:8000/appointments`, {
        method: 'POST',
        body: formData
      }).catch(error => {
        alert("Error al conectar con el servidor.")
      })

      const newAppResponse = await response.json();

      if (newAppResponse.status === 201) {
        // console.log(newAppResponse)
        postStatus = (`Cita para ${serviceInfo.name} el ${formattedDate} a las ${formValues.time} programa con éxito.`);
      } else if (newAppResponse.errors[0] === "['Not enough product available for appointment']") {
        postStatus = ("Debido a la falta de productos necesarios para este servicio, no podemos agendar la cita. Por favor contactarnos para más información.");
    } else {
        postStatus = ("Ocurrio un error al guardar el servicio.");
      }
    };

    alert(postStatus);
    window.location.reload()
  };

  const getServices = async (event) => {
    if (event) event.preventDefault();
    setLoadingServices(true);
    try {
      console.log('Fetching services');
      const response = await fetch(`http://127.0.0.1:8000/services`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const servicesResponse = await response.json();
        setServices(servicesResponse);
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        alert(`Client error: ${errorResponse.message}`);
      } else {
        alert(`Server error: ${response.status}`);
      }
    } catch (error) {
      alert("Error al conectar con el servidor.");
    } finally {
      setLoadingServices(false);
    }
  };

  const getTimes = useCallback(_.debounce(async (date, duration, event) => {
    if (event) event.preventDefault();
    setLoadingTimes(true);
    try {
      console.log('Fetching available times');
      const response = await fetch(`http://127.0.0.1:8000/availabletime/${date}?duration=${duration}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const timesResponse = await response.json();
        setAvailableTime(timesResponse.available_times);
      } else if (response.status === 400) {
        const errorResponse = await response.json();
        alert(`Client error: ${errorResponse.message}`);
      } else {
        alert(`Server error: ${response.status}`);
      }
    } catch (error) {
      alert("Error al conectar con el servidor.");
    } finally {
      setLoadingTimes(false);
    }
  }, 500), []); // Debounced function

  useEffect(() => {
    getServices();
  }, []);

  useEffect(() => {
    if (services.length > 0) {
      const selectedServices = services
        .filter(service => Number(service.id) === Number(selectedServiceId))
        .map(service => service.name);

      setFormValues(prevValues => ({
        ...prevValues,
        selectedServices: selectedServices,
      }));
    }
  }, [services, selectedServiceId]);

  useEffect(() => {
    if (services.length === 0) return;

    const totalDuration = services
      .filter(service => formValues.selectedServices.includes(service.name))
      .map(service => service.duration)
      .reduce((acc, duration) => acc + duration, 30);

    const totalPrice = services
      .filter(service => formValues.selectedServices.includes(service.name))
      .map(service => parseFloat(service.price))
      .reduce((acc, price) => acc + price, 0);

    const formattedDate = formValues.date.format('YYYY-MM-DD');
    setPrice(totalPrice);
    getTimes(formattedDate, totalDuration - 30);
  }, [services, formValues.date, formValues.selectedServices, getTimes]);

  return (
    <Container sx={{ paddingBottom: '25px', paddingTop: '25px' }}>
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
          AGENDAR SERVICIO
        </Typography>
      </Box>
      <form noValidate encType="multipart/form-data" autoComplete="off" onSubmit={handleSubmit}>
        <Typography variant="h6" gutterBottom align="left" sx={{ margin: '15px 0' }}>Información del Cliente</Typography>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Nombre"
                value={`${userData.name} ${userData.lastname}`}
                fullWidth
                disabled
                sx={{ backgroundColor: '#fff', '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: '#000' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Número de teléfono"
                value={userData.phone}
                fullWidth
                disabled
                sx={{ backgroundColor: '#fff', '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: '#000' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Correo"
                value={userData.email}
                fullWidth
                disabled
                sx={{ backgroundColor: '#fff', '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: '#000' } }}
              />
            </Grid>
          </Grid>
        </Box>

        <Typography variant="h6" gutterBottom align="left" sx={{ margin: '15px 0' }}>Información del Servicio</Typography>
        <FormControl fullWidth error={!!errors.selectedServices}>
          <InputLabel id="service-select-label">Servicios</InputLabel>
          <Select
            label="Servicios"
            labelId="service-select-label"
            multiple
            value={formValues.selectedServices}
            name="selectedServices"
            onChange={handleChange}
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

        <Typography variant="h6" gutterBottom align="left" sx={{ margin: '15px 0' }}>Información de la Cita</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Seleccione una Fecha"
                type="date"
                name="date"
                value={formValues.date.format('YYYY-MM-DD')}
                onChange={(e) => setFormValues({ ...formValues, date: dayjs(e.target.value) })}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Horas disponibles</InputLabel>
                <Select
                  label="Horas disponibles"
                  name="time"
                  value={formValues.time}
                  onChange={handleChange}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Seleccione la Hora
                  </MenuItem>
                  {availableTime.map((time) => (
                    <MenuItem key={time} value={time}>
                      {time}
                    </MenuItem>
                  ))}
                </Select>
                {!!errors.time && (
                  <Typography variant="body2" color="error" sx={{ textAlign: 'left' }}>{errors.time}</Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Costo Total"
                name="total"
                value={price}
                disabled
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">₡</InputAdornment>,
                }}
                sx={{ backgroundColor: '#fff', '& .MuiInputBase-input.Mui-disabled': { WebkitTextFillColor: '#000' } }}
              />
            </Grid>
          </Grid>
        </LocalizationProvider>

        <Typography variant="h6" gutterBottom align="left" sx={{ margin: '15px 0px' }}>Comprobante de Pago</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '25px' }}>

          <label htmlFor="paymentFile">
            <Input accept="image/*" id="paymentFile" type="file" name="paymentFile" onChange={handleChange} />
            <Button variant="contained" component="span">
              Agregar Archivo
            </Button>
          </label>
          {formValues.paymentFile && (
            <Typography variant="body2">{formValues.paymentFile.name}</Typography>
          )}
          {!!errors.paymentFile && (
            <Typography variant="body2" color="error">{errors.paymentFile}</Typography>
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
            AGENDAR
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#e0e0e0',
              '&:hover': { backgroundColor: '#bdbdbd' },
              color: '#000'
            }}
            onClick={() => { navigate('/agenda') }}
          >
            CANCELAR
          </Button>
        </Box>
      </form>
    </Container>
  );
}
