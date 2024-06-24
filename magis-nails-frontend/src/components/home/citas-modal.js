import React, { useEffect, useState } from 'react';
import { Modal, Box, TextField, Typography, Button, Grid, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import dayjs from 'dayjs';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px'
};

function EventModal({ open, handleClose, events, handleSave }) {
    const [date, setDate] = useState(dayjs(events[0].date).format('YYYY-MM-DD'));
    const [time, setTime] = useState('');
    const [availableTime, setAvailableTime] = useState([]);
    const [errors, setErrors] = useState({ date: '', time: '' });

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === 'time' && value !== '') {
            setTime(value);
            if (dayjs(date).format('YYYY-MM-DD') === dayjs(new Date()).format('YYYY-MM-DD')) {
                if (value <= dayjs().format('HH:mm:ss')) {
                    setErrors({ ...errors, time: 'La hora debe ser después de la hora actual.' });
                } else {
                    setErrors({ ...errors, time: '' });
                }
            } else {
                setErrors({ ...errors, time: '' });
            }
        } else if (name === 'date') {
            setDate(value);
            if (value >= dayjs(new Date()).format('YYYY-MM-DD')) {
                setErrors({ time: '', date: '' });
            } else {
                setErrors({ time: '', date: 'La fecha debe ser igual o después de la fecha de hoy.' });
            }
        }
    }

    const handleSubmit = () => {
        const newErrors = {
            date: date < dayjs(new Date()).format('YYYY-MM-DD') ? 'La fecha debe ser igual o después de la fecha de hoy.' : '',
            time: time ? '' : 'Este campo es requerido.',
          };
          setErrors(newErrors);
      
          if (Object.values(newErrors).some(error => error)) {
            return;
          }

        handleSave(date, time);
        handleClose();
    };

    const getTimes = async (event) => {
        if (event) event.preventDefault();

        const duration = events
            .map(service => service.duration)
            .reduce((acc, duration) => acc + duration, 0);
        try {
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
        }
    }

    useEffect(() => {
        getTimes();
    }, [date]);

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" component="h2" gutterBottom sx={{ marginBottom: '20px' }}>
                    Editar Evento
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Seleccione una Fecha"
                            type="date"
                            name='date'
                            value={date}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors.date}
                            InputLabelProps={{ shrink: true }}
                            helperText={errors.date}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth error={!!errors.time}>
                            <InputLabel>Nueva Hora</InputLabel>
                            <Select
                                label='Nueva Hora'
                                name='time'
                                value={time}
                                onChange={handleChange}
                                displayEmpty
                            >
                                {availableTime.map((time) => (
                                    <MenuItem key={time} value={time}>
                                        {time}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.time && <FormHelperText>{errors.time}</FormHelperText>}
                        </FormControl>
                    </Grid>
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2, gap: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        sx={{ backgroundColor: '#f48fb1', '&:hover': { backgroundColor: '#f06292' }, color: '#fff' }}
                    >
                        Guardar
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleClose}
                        sx={{ backgroundColor: '#e0e0e0', '&:hover': { backgroundColor: '#bdbdbd' }, color: '#000' }}
                    >
                        Cancelar
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default EventModal;
