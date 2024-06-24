import React, { useState } from 'react';
import {
  Container, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, Box, TablePagination, Button,
} from '@mui/material';
import ReportModal from './modal-reportes';

const reports = [
  { id: 1, title: 'Actividad de Inicio de Sesión de Usuarios', description: 'Lista de usuarios con el número de intentos fallidos de inicio de sesión. Incluye detalles como nombre, correo electrónico y si están bloqueados.', requiresDates: false, requiresUser: false, url: '' },
  { id: 2, title: 'Uso de Servicios', description: 'Número de citas para cada servicio. Incluye detalles como nombre del servicio, número total de citas y los ingresos totales generados por cada servicio.', requiresDates: false, requiresUser: false, url: '' },
  { id: 3, title: 'Uso de Productos', description: 'Número de unidades de cada producto utilizadas en servicios. Incluye detalles como nombre del producto, total de unidades utilizadas y stock restante.', requiresDates: false, requiresUser: false, url: '' },
  { id: 4, title: 'Historial de Citas por Usuario', description: 'Lista de todas las citas de un usuario específico. Incluye detalles como nombre del servicio, fecha y hora de la cita y costo total.', requiresDates: false, requiresUser: true, url: '' },
  { id: 5, title: 'Citas por Servicio por fecha', description: 'Resumen de las citas para cada servicio durante un período específico. Incluye detalles como nombre del servicio, número de citas y los ingresos totales.', requiresDates: true, requiresUser: false, url: '' },
  { id: 6, title: 'Informe de Ingresos por fecha', description: 'Ingresos totales generados durante un período específico, desglosados por servicio y uso de productos.', requiresDates: true, requiresUser: false, url: '' },
];

export default function Reportes() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedReport(null);
    setIsModalOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
          REPORTES
        </Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table aria-label="reports table">
          <TableHead sx={{ backgroundColor: '#e0e0e0' }}>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Titulo</TableCell>
              <TableCell>Descripcion</TableCell>
              <TableCell>Accion</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((report) => (
              <TableRow key={report.id} hover sx={{ cursor: 'pointer' }}>
                <TableCell>{report.id}</TableCell>
                <TableCell>{report.title}</TableCell>
                <TableCell>{report.description}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"                    
                    onClick={() => handleClick(report)}
                    sx={{ marginRight: 1, backgroundColor: '#f48fb1' }}
                  >
                    Generar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={reports.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      {selectedReport && (
        <ReportModal
          open={isModalOpen}
          handleClose={handleCloseModal}
          report={selectedReport}
        />
      )}
    </Container>
  );
}
