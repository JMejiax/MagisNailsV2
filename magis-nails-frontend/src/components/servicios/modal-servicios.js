import React, { useState } from 'react';
import {
    Modal, Box, TextField, Button, Typography, Switch, FormControlLabel
} from '@mui/material';

import { apiUrl } from '../../util/apiUrl';

export default function ModalServicio({ open, handleClose, service, handleSave }) {
    const [name, setName] = useState(service.name);
    const [description, setDescription] = useState(service.description);
    const [price, setPrice] = useState(service.price);
    const [duration, setDuration] = useState(service.duration);
    const [active, setActive] = useState(service.isActive);
    const [image, setImage] = useState(service.image);

    const [errors, setErrors] = useState({});

    const validate = () => {
        const errors = {};

        if (!name) errors.name = "El nombre es obligatorio.";
        if (!description) errors.description = "La descripción es obligatoria.";
        if (!price || price <= 0) errors.price = "El precio debe ser un número positivo.";
        if (!duration || duration <= 0) errors.duration = "La duración debe ser un número positivo.";

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = () => {
        if (!validate()) return;

        const updatedService = {
            id: service.id,
            name: name,
            description: description,
            price: price,
            duration: duration,
            active: active,
            image: image
        };
        // console.log(updatedService)
        handleSave(updatedService);
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                component="form"
                encType="multipart/form-data"
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
                    borderRadius: '8px'
                }}
            >
                <Typography variant="h6" component="h2" gutterBottom>
                    Editar Servicio
                </Typography>
                <TextField
                    fullWidth
                    required
                    margin="normal"
                    label="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={!!errors.name}
                    helperText={errors.name}
                />
                <TextField
                    fullWidth
                    required
                    margin="normal"
                    label="Descripción"
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    error={!!errors.description}
                    helperText={errors.description}
                />
                <TextField
                    fullWidth
                    required
                    margin="normal"
                    label="Precio"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    error={!!errors.price}
                    helperText={errors.price}
                />
                <TextField
                    fullWidth
                    required
                    margin="normal"
                    label="Duración (minutos)"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    error={!!errors.duration}
                    helperText={errors.duration}
                />
                {image && (
                    <Box sx={{ textAlign: 'left', mt: 2 }}>
                        <img src={`${apiUrl}${image}`} alt="Service" style={{ maxHeight: 100, maxWidth: '100%' }} />
                    </Box>
                )}
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="raised-button-file"
                    type="file"
                    onChange={handleImageChange}
                />
                <label htmlFor="raised-button-file">
                    <Button
                        variant="contained"
                        color="primary"
                        component="span"
                        sx={{ display: 'block', width: '50%', margin: '10px 0' }}
                    >
                        Actualizar Imagen
                    </Button>
                </label>
                <FormControlLabel
                    control={
                        <Switch
                            checked={active}
                            onChange={(e) => setActive(e.target.checked)}
                            color="primary"
                        />
                    }
                    label="Activo"
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2, gap: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        type='submit'
                        sx={{ backgroundColor: '#f48fb1', '&:hover': { backgroundColor: '#f06292' }, color: '#fff' }}
                    >
                        Guardar
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        type='button'
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
