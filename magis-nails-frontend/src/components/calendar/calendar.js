// Calendar.js
import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Grid, Paper } from '@mui/material';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CalendarDays from './calendar-days';


export default function Calendar( {changeDate, appointments} ) {
  const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const [currentDay, setCurrentDay] = useState(new Date());
  // const [appointments, setAppointments] = useState([]);


  const changeCurrentDay = (day) => {
    setCurrentDay(new Date(day.year, day.month, day.number));
  };

  const nextMonth = () => {
    const nextMonthDate = new Date(currentDay.getFullYear(), currentDay.getMonth() + 1, 1);
    setCurrentDay(nextMonthDate);
    changeDate(nextMonthDate);
  };

  const previousMonth = () => {
    const previousMonthDate = new Date(currentDay.getFullYear(), currentDay.getMonth() - 1, 1);
    setCurrentDay(previousMonthDate);
    changeDate(previousMonthDate);

  };

  const nextYear = () => {
    const nextYearDate = new Date(currentDay.getFullYear() + 1, currentDay.getMonth(), 1);
    setCurrentDay(nextYearDate);
    changeDate(nextYearDate);

  };

  const previousYear = () => {
    const previousYearDate = new Date(currentDay.getFullYear() - 1, currentDay.getMonth(), 1);
    setCurrentDay(previousYearDate);
    changeDate(previousYearDate);

  };

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '50px', mb: 2, px: 2 }}>
        <IconButton onClick={previousYear} sx={{ backgroundColor: '#f48fb1' }}>
          <KeyboardDoubleArrowLeftIcon />
        </IconButton>
        <IconButton onClick={previousMonth} sx={{ backgroundColor: '#f48fb1' }}>
          <NavigateBeforeIcon />
        </IconButton>
        <Typography variant="h6" sx={{ textAlign: 'center', flexGrow: 1 }}>
          {currentDay.getDate()} de {months[currentDay.getMonth()]} del {currentDay.getFullYear()}
        </Typography>
        <IconButton onClick={nextMonth} sx={{ backgroundColor: '#f48fb1' }}>
          <NavigateNextIcon />
        </IconButton>
        <IconButton onClick={nextYear} sx={{ backgroundColor: '#f48fb1' }}>
          <KeyboardDoubleArrowRightIcon />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 2, px: 2 , boxShadow: '0px 1px 0px #f48fb1'}}>
        {weekdays.map((weekday, index) => (
          <Box key={index} sx={{ textAlign: 'center', flex: 1 }}>
            <Typography>{weekday}</Typography>
          </Box>
        ))}
      </Box>
      <Paper elevation={3} sx={{ width: '100%', overflow: 'hidden' }}>
        <Grid container spacing={0} columns={7} sx={{ p: 2 }}>
          <CalendarDays day={currentDay} changeCurrentDay={changeCurrentDay} appointments={appointments} />
        </Grid>
      </Paper>
    </Box>
  );
}
