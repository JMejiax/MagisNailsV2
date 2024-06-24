import React, { useEffect, useState } from 'react';
import { Grid, Container, Divider, Box, Typography } from '@mui/material';
import Calendar from '../calendar/calendar';
import UpcomingEventsTable from './proximas-citas-tbl';
import AuthContext from '../../context/AuthContext';

const months = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function Home() {
  const { userData } = React.useContext(AuthContext);

  const [apps, setApps] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  }

  const getApp = async () => {
    const response = await fetch(`http://127.0.0.1:8000/appointment/${selectedDate.getFullYear()}/${selectedDate.getMonth()+1}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).catch(error => {
      alert("Error al conectar con el servidor.")
    })

    const appsResponse = await response.json();

    if (response.ok) {
      // console.log(appsResponse)
      if (userData.isAdmin) {
        setApps(appsResponse);
      } else {
        const currUserApp = appsResponse.filter((app) => app.user === userData.id)
        setApps(currUserApp);
      }
    } else {
      alert("Ocurrio un error al obtener los usuarios.");
    }
  }

  useEffect(() => {
    getApp();
  }, [selectedDate]);


  return (
    <Container maxWidth="xl" sx={{ paddingTop: '20px', overflow: 'hidden', marginBottom: "25px" }}>
      <Box
        sx={{
          width: '100%',
          boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
          borderRadius: '10px',
          backgroundColor: '#f2f2f2',
          overflow: 'hidden',
          padding: '20px'
        }}
      >
        <Grid container justifyContent="space-around" spacing={2}>
          <Grid item xs={12} md={6}>
            <Calendar changeDate={handleDateChange} appointments={apps} />
          </Grid>
          <Divider orientation="vertical" flexItem />
          <Grid item xs={12} md={5}>
            <Box>
              <Typography variant="h6">Citas de: {months[selectedDate.getMonth()]}, {selectedDate.getFullYear()}</Typography>
              <Divider sx={{ marginBottom: '10px' }} />
              <UpcomingEventsTable events={apps} date={selectedDate} updateApp={getApp} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
