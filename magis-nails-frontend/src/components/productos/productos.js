import React, { useEffect, useState } from 'react';
import {
    Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, Typography, Box, TablePagination
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ProductModal from './modal-productos.js';

export default function Productos() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [services, setServices] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRowClick = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const handleCreateProduct = () => {
        navigate('form');
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const updateProduct = async (id, name, newQuantity, active, updatedServices) => {
        const formData = {
            "id": id,
            "name": name,
            "quantity": newQuantity,
            "isActive": active,
            "services": updatedServices.map(service => ({
                "service": service.service,
                "units_to_reduce": service.units_to_reduce
            }))
        };

        console.log(formData)

        // Handle form submission
        const response = await fetch(`http://127.0.0.1:8000/product/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        }).catch(error => {
            alert("Error al conectar con el servidor.")
        })

        const newProdResponse = await response.json();

        if (newProdResponse.status === 200 || (newProdResponse.status === undefined && !(newProdResponse.name[0] === 'product with this name already exists.'))) {
            // console.log('Form submitted', newProdResponse);
            alert(`Producto (${name}) actualizado con éxito.`);
            getProducts();
        } else if (newProdResponse.name[0] === 'product with this name already exists.') {
            alert("Ya existe un producto con el nombre ingresado.");
        } else {
            // console.log(newUserResponse)
            alert("Ocurrio un error al guardar el usuario.");
        }
    };

    const getProducts = async () => {
        const response = await fetch(`http://127.0.0.1:8000/products`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }).catch(error => {
            alert("Error al conectar con el servidor.")
          })
      
          const productsResponse = await response.json();
      
          if (productsResponse.status === 200 || productsResponse.status === undefined) {
            setProducts(productsResponse);
          } else {
            alert("Ocurrio un error al obtener los usuarios.");
          }
    }

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
        } else {
            alert("Ocurrio un error al obtener los usuarios.");
        }
    }

    useEffect(() => {
        getProducts();
        getServices();
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
                    PRODUCTOS
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
                    onClick={handleCreateProduct}
                >
                    Crear Nuevo Producto
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table aria-label="product table">
                    <TableHead sx={{ backgroundColor: '#e0e0e0' }}>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Cantidad</TableCell>
                            <TableCell>Activo</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) => (
                            <TableRow
                                key={product.id}
                                hover
                                sx={{ cursor: 'pointer' }}
                                onClick={() => handleRowClick(product)}
                            >
                                <TableCell>{product.id}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.quantity}</TableCell>
                                <TableCell>{product.isActive ? 'Activo' : 'Inactivo'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={products.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
            {selectedProduct && (
                <ProductModal
                    open={isModalOpen}
                    handleClose={handleCloseModal}
                    product={selectedProduct}
                    handleSave={updateProduct}
                    availableServices={services}
                />
            )}
        </Container>
    );
}
