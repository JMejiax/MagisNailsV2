import React, { useState, useEffect } from 'react';
import { Box, Button, Modal, TextField, Typography, FormControlLabel, Switch, FormControl, InputLabel, Select, MenuItem, Grid, FormHelperText } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function ProductModal({ open, handleClose, product, handleSave, availableServices }) {
    const [name, setName] = useState(product.name);
    const [quantity, setQuantity] = useState(product.quantity);
    const [active, setActive] = useState(product.isActive);
    const [selectedServices, setSelectedServices] = useState(product.services.map(service => service.service));
    const [serviceQuantities, setServiceQuantities] = useState(product.services.reduce((acc, service) => {
        acc[service.service] = service.units_to_reduce;
        return acc;
    }, {}));
    const [errors, setErrors] = useState({});

    useEffect(() => {
        setName(product.name);
        setQuantity(product.quantity);
        setActive(product.isActive);
        setSelectedServices(product.services.map(service => service.service));
        setServiceQuantities(product.services.reduce((acc, service) => {
            acc[service.service] = service.units_to_reduce;
            return acc;
        }, {}));
    }, [product]);

    const validate = () => {
        const newErrors = {};
        if (!name) newErrors.name = "El nombre es obligatorio.";
        if (!quantity && active) newErrors.quantity = "La cantidad es obligatoria si el producto está activo.";
        selectedServices.forEach(serviceId => {
            if (!serviceQuantities[serviceId]) {
                newErrors[`service-${serviceId}`] = "La cantidad es obligatoria para el servicio.";
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleQuantityChange = (event) => {
        setQuantity(event.target.value);
    };

    const handleActiveChange = (event) => {
        setActive(event.target.checked);
    };

    const handleServiceChange = (event) => {
        setSelectedServices(event.target.value);
    };

    const handleServiceQuantityChange = (serviceId, event) => {
        setServiceQuantities({
            ...serviceQuantities,
            [serviceId]: event.target.value,
        });
    };

    const handleSubmit = () => {
        // console.log(serviceQuantities)
        if (!validate()) return;
        const updatedServices = selectedServices.map(serviceId => ({
            service: serviceId,
            units_to_reduce: Number(serviceQuantities[serviceId]),
        }));
        handleSave(product.id, name, quantity, active, updatedServices);
        handleClose();
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Modificar {product.name}
                </Typography>
                <TextField
                    required
                    label="Nombre"
                    value={name}
                    onChange={handleNameChange}
                    fullWidth
                    disabled={!active}
                    sx={{ marginTop: 2 }}
                    error={!!errors.name}
                    helperText={errors.name}
                />
                <TextField
                    required
                    label="Cantidad"
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    fullWidth
                    disabled={!active}
                    sx={{ marginTop: 2 }}
                    error={!!errors.quantity}
                    helperText={errors.quantity}
                />
                <FormControl fullWidth error={!!errors.selectedServices} sx={{ marginTop: 2 }}>
                    <InputLabel id="service-select-label">Servicios Relacionados</InputLabel>
                    <Select
                        label="Servicios Relacionados"
                        labelId="service-select-label"
                        multiple
                        disabled={!active}
                        value={selectedServices}
                        onChange={handleServiceChange}
                        renderValue={(selected) => selected.map(serviceId => {
                            const service = availableServices.find(s => s.id === serviceId);
                            return service ? service.name : '';
                        }).join(', ')}
                    >
                        {availableServices.map((service) => (
                            <MenuItem key={service.id} value={service.id}>
                                {service.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>{errors.selectedServices}</FormHelperText>
                </FormControl>
                {selectedServices.map((serviceId) => (
                    <TextField
                        key={serviceId}
                        label={`Cantidad para ${availableServices.find(s => s.id === serviceId)?.name}`}
                        type="number"
                        value={serviceQuantities[serviceId] || ''}
                        onChange={(event) => handleServiceQuantityChange(serviceId, event)}
                        fullWidth
                        disabled={!active}
                        sx={{ marginTop: 2 }}
                        error={!!errors[`service-${serviceId}`]}
                        helperText={errors[`service-${serviceId}`]}
                    />
                ))}
                <FormControlLabel
                    control={
                        <Switch
                            checked={active}
                            onChange={handleActiveChange}
                            name="active"
                            color="primary"
                        />
                    }
                    label="Activo"
                    sx={{ marginTop: 2 }}
                />
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