// EventModal.js
import React, { useEffect, useState } from 'react';
import { Modal, Box, TextField, Typography, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

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
    const [date, setDate] = useState(events[0].date);
    const [time, setTime] = useState('');
    const [availableTime, setAvailableTime] = useState(['']);

    const handleSubmit = () => {
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
                // console.log(timesResponse.available_times)
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
    }, []);

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
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Nueva Hora</InputLabel>
                            <Select
                                label='Nueva Hora'
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                displayEmpty
                            >
                                {/* <MenuItem value="" disabled>
                                    Seleccione la Hora
                                </MenuItem> */}
                                {availableTime.map((time) => (
                                    <MenuItem key={time} value={time}>
                                        {time}
                                    </MenuItem>
                                ))}
                            </Select>
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
