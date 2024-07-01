
import React, { useState, useEffect } from 'react';
import {
    Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, Typography, Box, TablePagination
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import UserModal from './modal-usuarios';
import { apiUrl } from '../../util/apiUrl';

export default function Usuarios() {
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [users, setUsers] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRowClick = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const handleSaveUser = async (selectedUser, updatedUser) => {
        // Handle saving the updated user
        console.log(updatedUser)

        const newUserData = {
            name: updatedUser.name,
            lastname: updatedUser.lastname,
            phone: updatedUser.phone,
            email: updatedUser.email,
            isAdmin: updatedUser.admin,
            isActive: updatedUser.active,
            isLocked: updatedUser.isLocked
        };
    
        if (updatedUser.password !== '') {
            newUserData.password = updatedUser.password;
        }


        const response = await fetch(`${apiUrl}/user/${selectedUser.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUserData)
        }).catch(error => {
            alert("Error al conectar con el servidor.")
        })

        const infoChangeResponse = await response.json();

        if (infoChangeResponse.status === 200 || infoChangeResponse.status === undefined) {
            alert("Se actualizó el usuario satisfactoriamente.")
            getUsers();
        } else{
            alert("Ya existe un usuario con este correo.")
        }
    };

    const handleCreateUser = () => {
        navigate('form');
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getUsers = async () => {
        const response = await fetch(`${apiUrl}/users`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }).catch(error => {
            alert("Error al conectar con el servidor.")
          })
      
          const usersResponse = await response.json();
      
          if (usersResponse.status === 200 || usersResponse.status === undefined) {
            setUsers(usersResponse);
          } else {
            alert("Ocurrio un error al obtener los usuarios.");
          }
    }

    useEffect(() => {
        getUsers();
    }, []);
    
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
                    USUARIOS
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
                    sx={{
                        backgroundColor: '#f48fb1',
                        '&:hover': { backgroundColor: '#f06292' },
                        color: '#fff'
                    }}
                    onClick={handleCreateUser}
                >
                    Crear Nuevo Usuario
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table aria-label="user table">
                    <TableHead sx={{ backgroundColor: '#e0e0e0' }}>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Rol</TableCell>
                            <TableCell>Estado</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                            <TableRow
                                key={user.id}
                                hover
                                sx={{ cursor: 'pointer' }}
                                onClick={() => handleRowClick(user)}
                            >
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.name} {user.lastname}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.isAdmin ? 'Admin' : 'Cliente'}</TableCell>
                                <TableCell>{user.isActive ? 'Activo' : 'Inactivo'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={users.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
            {selectedUser && (
                <UserModal
                    open={isModalOpen}
                    handleClose={handleCloseModal}
                    user={selectedUser}
                    handleSave={handleSaveUser}
                />
            )}
        </Container>
    );
}
