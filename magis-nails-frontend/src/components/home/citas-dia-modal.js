import React, { useEffect, useState, useContext } from 'react';
import { Modal, Box, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@mui/material';
import dayjs from 'dayjs';
import AuthContext from '../../context/AuthContext';
import { apiUrl } from '../../util/apiUrl';

export default function DayModal({ open, handleClose, selectedDay, apps }) {
    const { userData } = useContext(AuthContext);
    const [services, setServices] = useState([]);
    const [users, setUsers] = useState([]);

    const getServices = async () => {
        try {
            const response = await fetch(`${apiUrl}/services`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Error fetching services');
            }
            const servicesResponse = await response.json();
            setServices(servicesResponse);
        } catch (error) {
            alert('Error al obtener los servicios.');
        }
    };

    const getUsers = async () => {
        try {
            const response = await fetch(`${apiUrl}/users`, {
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
            alert('Error al obtener los usuarios.');
        }
    };

    useEffect(() => {
        getServices();
        getUsers();
    }, []);

    const appointmentsForTheDay = apps.filter(app => {
        const appDate = dayjs(app.date);
        return appDate.date() === selectedDay;
    });

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '50%',
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px'
                }}
            >
                <Typography variant="h6" component="h2">
                    Citas para el {selectedDay}
                </Typography>
                <Paper>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow style={{ backgroundColor: '#f48fb1' }}>
                                    {userData.isAdmin && <TableCell>Cliente</TableCell>}
                                    <TableCell>Servicio</TableCell>
                                    <TableCell>Hora</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {appointmentsForTheDay.length > 0 ? (
                                    appointmentsForTheDay.map((appointment, index) => {
                                        const service = services.find(serv => serv.id === appointment.service);
                                        const user = users.find(usr => usr.id === appointment.user);
                                        return (
                                            <TableRow key={index}>
                                                {userData.isAdmin && (
                                                    <TableCell>{user ? `${user.name} ${user.lastname}` : 'Usuario no encontrado'}</TableCell>
                                                )}
                                                <TableCell>{service ? service.name : 'Servicio no encontrado'}</TableCell>
                                                <TableCell>{appointment.time}</TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={userData.isAdmin ? 4 : 3} sx={{ textAlign: 'center' }}>
                                            No tiene citas programadas.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
        </Modal>
    );
}
