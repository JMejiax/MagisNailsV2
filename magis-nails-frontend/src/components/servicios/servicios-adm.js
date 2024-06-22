import React, { useEffect, useState } from 'react';
import {
    Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, Typography, Box, TablePagination
} from '@mui/material';
import ModalServicio from './modal-servicios';

import { useNavigate } from 'react-router-dom';

export default function Servicios() {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [ services, setServices ] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedService, setSelectedService] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRowClick = (service) => {
        setSelectedService(service);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedService(null);
    };

    const handleSaveService = async (updatedService) => {

        const formData = new FormData();
        formData.append('name', updatedService.name);
        formData.append('description', updatedService.description);
        formData.append('price', updatedService.price);
        formData.append('duration', updatedService.duration);
        formData.append('isActive', updatedService.active);

        if(!(typeof updatedService.image === 'string' && updatedService.image.includes('/files/service_images/')) ){
            formData.append('image', updatedService.image);
        }

        const response = await fetch(`http://127.0.0.1:8000/service/${updatedService.id}`, {
            method: 'PUT',
            body: formData
        }).catch(error => {
            alert("Error al conectar con el servidor.")
        })

        const updatedServiceResponse = await response.json();

        if (updatedServiceResponse.status === 201 || updatedServiceResponse.status === undefined) {
            getServices();
            alert(`Servicio de ${updatedService.name} actualizado con éxito.`);
        } else {
            // console.log(newServiceResponse)
            alert("Ocurrio un error al guardar el servicio.");
        }

    };

    const handleCreateService = () => {
        navigate('form');
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

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

    useEffect(()=>{
        getServices();
    }, [])

    return (
        <Container sx={{ paddingBottom: '25px', paddingTop: '25px' }}>
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
                    SERVICIOS
                </Typography>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    marginBottom: '20px'
                }}
            >
                <Button
                    variant="contained"
                    type='button'
                    sx={{
                        backgroundColor: '#f48fb1',
                        '&:hover': { backgroundColor: '#f06292' },
                        color: '#fff'
                    }}
                    onClick={handleCreateService}
                >
                    Crear Nuevo Servicio
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table aria-label="service table">
                    <TableHead sx={{ backgroundColor: '#e0e0e0' }}>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Descripción</TableCell>
                            <TableCell>Estado</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {services.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((service) => (
                            <TableRow
                                key={service.id}
                                hover
                                sx={{ cursor: 'pointer' }}
                                onClick={() => handleRowClick(service)}
                            >
                                <TableCell>{service.id}</TableCell>
                                <TableCell>{service.name}</TableCell>
                                <TableCell>{service.description}</TableCell>
                                <TableCell>{service.isActive ? 'Activo' : 'Inactivo'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={services.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
            {selectedService && (
                <ModalServicio
                    open={isModalOpen}
                    handleClose={handleCloseModal}
                    service={selectedService}
                    handleSave={handleSaveService}
                />
            )}
        </Container>
    );
}