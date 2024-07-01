import React, { useEffect, useState } from 'react';
import { Modal, Box, TextField, Typography, Button, Grid, FormControl, InputLabel, Select, MenuItem, FormHelperText, FormControlLabel, Checkbox } from '@mui/material';
import dayjs from 'dayjs';
import { apiUrl } from '../../util/apiUrl';

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

function EventModal({ open, handleClose, events, handleSave, isAdmin }) {
    const [date, setDate] = useState(dayjs(events[0].date).format('YYYY-MM-DD'));
    const [time, setTime] = useState('');
    const [availableTime, setAvailableTime] = useState([]);
    const [isComplete, setIsComplete] = useState(events[0].isComplete);
    const [showOptionalFields, setShowOptionalFields] = useState(!events[0].isComplete);
    const [paymentFile, setPaymentFile] = useState(null);
    const [errors, setErrors] = useState({ date: '', time: '' });

    const hasPaymentFile = events[0].payment;

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === 'time' && value !== '') {
            setTime(value);
            if (!isComplete && dayjs(date).format('YYYY-MM-DD') === dayjs(new Date()).format('YYYY-MM-DD')) {
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
            if (!isComplete && value >= dayjs(new Date()).format('YYYY-MM-DD')) {
                setErrors({ time: '', date: '' });
            } else if (!isComplete) {
                setErrors({ time: '', date: 'La fecha debe ser igual o después de la fecha de hoy.' });
            }
        } else if (name === 'isComplete') {
            setIsComplete(event.target.checked);
            if (event.target.checked) {
                setErrors({ date: '', time: '' });
            }
        }
    };

    const handleFileChange = (event) => {
        setPaymentFile(event.target.files[0]);
    };

    const handleSubmit = () => {
        const newErrors = {
            date: paymentFile===null && !isComplete && date < dayjs(new Date()).format('YYYY-MM-DD') ? 'La fecha debe ser igual o después de la fecha de hoy.' : '',
            time: paymentFile===null && !isComplete && !time ? 'Este campo es requerido.' : '',
        };
        setErrors(newErrors);

        if (Object.values(newErrors).some(error => error)) {
            return;
        }

        handleSave(date, time, isComplete, paymentFile);
        handleClose();
    };

    const getTimes = async (event) => {
        if (event) event.preventDefault();

        const duration = events
            .map(service => service.duration)
            .reduce((acc, duration) => acc + duration, 0);
        try {
            const response = await fetch(`${apiUrl}/availabletime/${date}?duration=${duration}`, {
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
    };

    useEffect(() => {
        getTimes();
    }, [date]);

    useEffect(() => {
        setShowOptionalFields(!events[0].isComplete);
    }, [events]);

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
                            disabled={isComplete}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth error={!!errors.time} disabled={isComplete}>
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
                    {showOptionalFields && (
                        <>
                            {isAdmin && <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isComplete}
                                            onChange={handleChange}
                                            name="isComplete"
                                            color="primary"
                                        />
                                    }
                                    label="Completado"
                                />
                            </Grid>}
                            <Grid item xs={12}>
                                {hasPaymentFile ? (
                                    <Button
                                        variant="contained"
                                        disabled
                                    >
                                        Pago ya subido
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        component="label"
                                    >
                                        Subir Pago
                                        <input
                                            type="file"
                                            hidden
                                            onChange={handleFileChange}
                                        />
                                    </Button>
                                )}
                                {paymentFile && <Typography variant="body2">{paymentFile.name}</Typography>}
                            </Grid>
                        </>
                    )}
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

