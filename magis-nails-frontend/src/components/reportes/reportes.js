import React, { useState } from 'react';
import {
  Container, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Typography, Box, TablePagination
} from '@mui/material';
import { PDFDownloadLink, Document, Page, Text, StyleSheet } from '@react-pdf/renderer';

const reports = [
  { id: 1, title: 'Monthly Sales', description: 'A report of the monthly sales.' },
  { id: 2, title: 'Yearly Sales', description: 'A report of the yearly sales.' },
  { id: 3, title: 'Customer Feedback', description: 'A report of the customer feedback.' },
  { id: 4, title: 'Employee Performance', description: 'A report on employee performance.' },
  { id: 5, title: 'Inventory Status', description: 'A report of the inventory status.' },
  { id: 6, title: 'Quarterly Analysis', description: 'A report of the quarterly analysis.' },
  { id: 7, title: 'Market Trends', description: 'A report of the market trends.' },
  { id: 8, title: 'Profit and Loss', description: 'A report of the profit and loss.' },
  { id: 9, title: 'Annual Budget', description: 'A report of the annual budget.' },
  { id: 10, title: 'Strategic Plan', description: 'A report of the strategic plan.' },
];

const ReportDocument = ({ title, description }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </Page>
  </Document>
);

const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 24, marginBottom: 10 },
  description: { fontSize: 14 },
});

export default function Reportes() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
                  <PDFDownloadLink
                    document={<ReportDocument title={report.title} description={report.description} />}
                    fileName={`${report.title}.pdf`}
                    style={{
                      textDecoration: 'none',
                      color: '#fff',
                      backgroundColor: '#f48fb1',
                      padding: '5px 10px',
                      borderRadius: '4px'
                    }}
                  >
                    {({ loading }) => (loading ? 'Cargando...' : 'Descargar')}
                  </PDFDownloadLink>
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
    </Container>
  );
}
