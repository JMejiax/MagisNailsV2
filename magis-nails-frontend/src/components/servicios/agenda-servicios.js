import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Card, CardMedia, CardContent, Typography, CardActions, Button, Tooltip } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ErrorIcon from '@mui/icons-material/Error'; // Icon for indicating no products available
import { useNavigate } from "react-router-dom";
import { apiUrl } from '../../util/apiUrl';

export default function AgendaServicios() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);

  const redirectWhatsapp = (service) => {
    const phoneNumber = '+50661119446';
    const text = `Hola, me gustaría obtener más información sobre el servicio: ${service.name} (${service.description}) que cuesta ₡${service.price} y dura ${service.duration} minutos.`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }

  const checkServiceAvailability = async (serviceId) => {
    try {
      const response = await fetch(`${apiUrl}/validate_service/${serviceId}/`);
      const data = await response.json();
      return data.available; // Return true or false based on availability
    } catch (error) {
      console.error('Error checking service availability:', error);
      return false; // Default to false if there's an error
    }
  }

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
      const activeServices = servicesResponse.filter(serv => serv.isActive);
      setServices(activeServices);
      // Check availability for each service
      activeServices.forEach(async (service) => {
        const isAvailable = await checkServiceAvailability(service.id);
        service.isAvailable = isAvailable; // Add a property to service indicating availability
        setServices([...activeServices]); // Update state to trigger re-render
      });
    } else {
      alert("Ocurrio un error al obtener los servicios.");
    }
  }

  useEffect(() => {
    getServices();
  }, [])

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
          NUESTROS SERVICIOS
        </Typography>
      </Box>
      <Grid container spacing={4}>
        {services.map(service => (
          <Grid item key={service.id} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="150"
                image={`${apiUrl}${service.image}`}
                alt={service.name}
              />
              <CardContent>
                <Typography variant="h5" component="div" sx={{
                  fontWeight: 300,
                  letterSpacing: '0.1em',
                  color: '#901447',
                }}>
                  {service.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {service.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px', justifyContent: 'center', gap: '20px' }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: '400' }}>
                    ₡{service.price}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTimeIcon sx={{ color: '#901447', marginRight: '5px' }} />
                    <Typography variant="body2" color="text.secondary">
                      {service.duration} mins
                    </Typography>
                  </Box>
                  { !service.isAvailable && (
                    <Tooltip title={'Debido a la falta de materiales este servicio no esta disponible. Click en "Mas Información" para hablar con un agente.'}>
                    <ErrorIcon sx={{ color: 'red', fontSize: 20 }} />
                    </Tooltip>
                  )}
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#f48fb1',
                    '&:hover': { backgroundColor: '#f06292' },
                    color: '#fff'
                  }}
                  onClick={() => { redirectWhatsapp(service) }}
                >
                  MÁS INFORMACIÓN
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#e0e0e0',
                    '&:hover': { backgroundColor: '#bdbdbd' },
                    color: '#000'
                  }}
                  onClick={() => { navigate(`/agenda/form?id=${service.id}`) }}
                >
                  AGENDAR
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
