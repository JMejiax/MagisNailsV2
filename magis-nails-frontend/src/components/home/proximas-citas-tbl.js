import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Alert
} from '@mui/material';
import EventModal from './citas-modal';
import dayjs from 'dayjs';

export default function UpcomingEventsTable({ events, date, updateApp }) {
  // Filter and group events by date and time
  const groupedEvents = events
    .reduce((groups, event) => {
      const key = `${event.date}-${event.time}`; // Unique key based on date and time

      if (!groups[key]) {
        groups[key] = []; // Initialize array if key doesn't exist
      }

      groups[key].push(event); // Push event to corresponding group
      return groups;
    }, {});

  const [services, setServices] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedEventsGroup, setSelectedEventsGroup] = useState(null); // State to store selected events group

  // Fetch services
  const getServices = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/services`, {
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
      // console.error('Error fetching services:', error.message);
      alert('Error al obtener los servicios.');
    }
  };

  useEffect(() => {
    getServices();
  }, []);

  useEffect(() => {
    // Reset page to 0 whenever events or date changes
    setPage(0);
  }, [events, date]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (eventsGroup) => {
    const currDate = dayjs().format('YYYY-MM-DD');
    if(eventsGroup[0].date < currDate){
      alert("La cita seleccionada es de una fecha pasada por lo que no se puede editar.")
    }else{
      setSelectedEventsGroup(eventsGroup);
    }
  };

  const handleModalClose = () => {
    setSelectedEventsGroup(null);
  };

  const handleSaveEvent = async (updatedDate, updatedTime) => {

    let putStatus = "";

    for (const app of selectedEventsGroup) {

      const response = await fetch(`http://127.0.0.1:8000/appointment/${app.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "date": updatedDate,
          "time": updatedTime,
        })
      }).catch(error => {
        alert("Error al conectar con el servidor.");
      })

      const infoChangeResponse = await response.json();
      // console.log(response.ok)
      if (response.ok) {
        putStatus = "Se actualizó la cita satisfactoriamente.";
        updateApp();
        // console.log(infoChangeResponse)
      } else if (infoChangeResponse.errors[0] === "['Not enough product available for appointment']") {
        putStatus = "Debido a la falta de productos necesarios para este servicio, no podemos agendar la cita. Por favor contactarnos para más información.";
        // console.log(infoChangeResponse)
      } else {
        putStatus = "Error al actualizar la cita.";
        // console.log(infoChangeResponse)
      }

    };

    alert(putStatus)
    setSelectedEventsGroup(null); // Close modal after saving
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, Object.keys(groupedEvents).length - page * rowsPerPage);

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#f48fb1' }}>
              <TableCell>Servicio</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Hora</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(groupedEvents).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((key, index) => {
              const eventsGroup = groupedEvents[key];
              const serviceNames = eventsGroup.map(event => {
                const service = services.find(serv => serv.id === event.service);
                return service ? service.name : 'Servicio no encontrado';
              }).join(', ');

              return (
                <TableRow key={index} onClick={() => handleRowClick(eventsGroup)} style={{ cursor: 'pointer' }}>
                  <TableCell>{serviceNames}</TableCell>
                  <TableCell>{eventsGroup[0].date}</TableCell>
                  <TableCell>{eventsGroup[0].time}</TableCell>
                </TableRow>
              );
            })}
            {Object.keys(groupedEvents).length === 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={3} sx={{ textAlign: 'center' }}>No tiene citas programadas.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={Object.keys(groupedEvents).length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {selectedEventsGroup && (
        <EventModal
          open={Boolean(selectedEventsGroup)}
          handleClose={handleModalClose}
          events={selectedEventsGroup}
          handleSave={handleSaveEvent}
        />
      )}
    </Paper>
  );
}
