import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useNavigate } from "react-router-dom";

export default function AgendaServicios() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);

  const redirectWhatsapp = (service) => {
    // `https://wa.me/+50661119446?text=`
    const phoneNumber = '+50661119446';
    const text = `Hola, me gustaría obtener más información sobre el servicio: ${service.name} (${service.description}) que cuesta ₡${service.price} y dura ${service.duration} minutos.`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }

  const getServices = async () => {
    const response = await fetch(`http://127.0.0.1:8000/services`, {
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
      // console.log(servicesResponse)
    } else {
      alert("Ocurrio un error al obtener los usuarios.");
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
                image={`http://127.0.0.1:8000${service.image}`}
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
