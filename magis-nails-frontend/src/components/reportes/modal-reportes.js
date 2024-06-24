import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Typography, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { PDFDownloadLink } from '@react-pdf/renderer';
import FetchReportData from './fetchReportData';
import dayjs from 'dayjs';

const ReportModal = ({ open, handleClose, report }) => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [disableDownload, setDisableDownload] = useState(false);
    const [errors, setErrors] = useState({ selectedUser: '', startDate: '', endDate: '' });

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Error fetching users');
            }

            const usersResponse = await response.json();
            setUsers(usersResponse);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert("Error al conectar con el servidor.");
        }
    };

    const handleStartDateChange = (event) => {
        const value = event.target.value;
        setStartDate(value);
        if (endDate && value > endDate) {
            setErrors(prevErrors => ({ ...prevErrors, startDate: 'La fecha inicial no puede ser posterior a la fecha final.' }));
            setDisableDownload(true);
        } else {
            setErrors(prevErrors => ({ ...prevErrors, startDate: '' }));
            setDisableDownload(false);
        }
    };

    const handleEndDateChange = (event) => {
        const value = event.target.value;
        setEndDate(value);
        if (startDate && value < startDate) {
            setErrors(prevErrors => ({ ...prevErrors, endDate: 'La fecha final no puede ser antes de la fecha inicial.' }));
            setDisableDownload(true);
        } else {
            setErrors(prevErrors => ({ ...prevErrors, endDate: '' }));
            setDisableDownload(false);
        }
    };

    const handleUserChange = (event) => {
        const value = event.target.value;
        setSelectedUser(value);
        setDisableDownload(false);
        setErrors(prevErrors => ({ ...prevErrors, selectedUser: '' }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        handleClose();
    };

    const getPdfButton = () => {
        if (report.requiresUser && !selectedUser) {
            return (
                <Button disabled variant="contained" sx={{ backgroundColor: '#f48fb1', color: '#fff' }}>
                    Descargar
                </Button>
            );
        } else if (report.requiresDates && (errors.startDate || errors.endDate)) {
            return (
                <Button disabled variant="contained" sx={{ backgroundColor: '#f48fb1', color: '#fff' }}>
                    Descargar
                </Button>
            );
        } else {
            return (
                <Button variant="contained" sx={{ backgroundColor: '#f48fb1', color: '#fff' }}>
                    <PDFDownloadLink
                        document={
                            <FetchReportData
                                report={report}
                                startDate={startDate}
                                endDate={endDate}
                                selectedUser={selectedUser}
                            />
                        }
                        fileName={`${report.title}.pdf`}
                        style={{ textDecoration: 'none', color: '#fff' }}
                    >
                        {({ loading }) => (loading ? 'Cargando...' : 'Descargar')}
                    </PDFDownloadLink>
                </Button>
            );
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 500,
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px'
                }}
            >
                {report.requiresUser && (
                    <FormControl fullWidth sx={{ marginBottom: '10px' }}>
                        <InputLabel>Seleccione un Usuario</InputLabel>
                        <Select
                            label="Seleccione un Usuario"
                            name="user"
                            value={selectedUser}
                            onChange={handleUserChange}
                            displayEmpty
                            required
                        >
                            <MenuItem value="" disabled>
                                Seleccione un Usuario
                            </MenuItem>
                            {users.map((user) => (
                                <MenuItem key={user.id} value={user.id}>
                                    <strong>{user.name} {user.lastname}</strong>&nbsp;({user.email})
                                </MenuItem>
                            ))}
                        </Select>
                        {!!errors.selectedUser && (
                            <Typography variant="body2" color="error" sx={{ textAlign: 'left' }}>{errors.selectedUser}</Typography>
                        )}
                    </FormControl>
                )}
                {report.requiresDates && (
                    <Box sx={{ marginBottom: 2, textAlign: 'center' }}>
                        <TextField
                            label="Fecha Inicial"
                            type="date"
                            value={startDate}
                            onChange={handleStartDateChange}
                            InputLabelProps={{ shrink: true }}
                            sx={{ marginRight: 2, width: '45%' }}
                            error={!!errors.startDate}
                            helperText={errors.startDate}
                        />
                        <TextField
                            label="Fecha Final"
                            type="date"
                            value={endDate}
                            onChange={handleEndDateChange}
                            InputLabelProps={{ shrink: true }}
                            sx={{ width: '45%' }}
                            error={!!errors.endDate}
                            helperText={errors.endDate}
                        />
                    </Box>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 0, gap: 2 }}>
                    {getPdfButton()}
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
};

export default ReportModal;
