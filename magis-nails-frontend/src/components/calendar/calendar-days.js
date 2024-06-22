// CalendarDays.js
import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import dayjs from 'dayjs';


export default function CalendarDays(props) {
  const { day, appointments, changeCurrentDay } = props;
  const firstDayOfMonth = new Date(day.getFullYear(), day.getMonth(), 1);
  const weekdayOfFirstDay = firstDayOfMonth.getDay();
  let currentDays = [];


  for (let i = 0; i < 42; i++) {
    if (i === 0 && weekdayOfFirstDay === 0) {
      firstDayOfMonth.setDate(firstDayOfMonth.getDate() - 7);
    } else if (i === 0) {
      firstDayOfMonth.setDate(firstDayOfMonth.getDate() + (i - weekdayOfFirstDay));
    } else {
      firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1);
    }

    let calendarDay = {
      currentMonth: (firstDayOfMonth.getMonth() === day.getMonth()),
      date: new Date(firstDayOfMonth),
      month: firstDayOfMonth.getMonth(),
      number: firstDayOfMonth.getDate(),
      selected: (firstDayOfMonth.toDateString() === day.toDateString()),
      year: firstDayOfMonth.getFullYear()
    };

    currentDays.push(calendarDay);
  }


  const hasAppointments = (date) => {
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    return appointments.some(appointment =>
      dayjs(appointment.date).format('YYYY-MM-DD') === formattedDate)
  };

  return (
    <Grid container spacing={0} columns={7}>
      {
        currentDays.map((day, index) => (
          <Grid item xs={1} key={index}>
            <Box
              sx={{
                height: 75,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #a6a6a6',
                backgroundColor: day.selected ? '#f48fb1' : 'inherit',
                cursor: 'pointer',
                position: 'relative',
                '&:hover': {
                  backgroundColor: day.currentMonth ? 'rgba(0, 0, 0, 0.1)' : 'inherit',
                }
              }}
              onClick={() => changeCurrentDay(day)}
            >
              <Typography color={day.selected ? '#901447' : day.currentMonth ? 'black' : '#a6a6a6'}>
                {day.number}
              </Typography>
              {day.currentMonth && hasAppointments(day.date) && (
                <EventAvailableIcon
                  sx={{
                    position: 'absolute',
                    bottom: 5,
                    right: 5,
                    fontSize: 18,
                    color: '#f06292'
                  }}
                />
              )}
            </Box>
          </Grid>
        ))
      }
    </Grid>
  );
}


