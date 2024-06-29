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
  Button
} from '@mui/material';
import EventModal from './citas-modal';
import dayjs from 'dayjs';
import AuthContext from '../../context/AuthContext';

export default function UpcomingEventsTable({ events, date, updateApp }) {
  const { userData } = React.useContext(AuthContext);

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
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isButton, setIsButton] = useState(false);
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

  const getUsers = async () => {
    const response = await fetch(`http://127.0.0.1:8000/users`, {
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
    getServices();
    getUsers();
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
    if (!isButton) {
      const currDate = dayjs().format('YYYY-MM-DD');
      if (eventsGroup[0].date < currDate || eventsGroup[0].isComplete) {
        alert("La cita seleccionada ya fue completada por lo que no se puede editar.")
      } else {
        setSelectedEventsGroup(eventsGroup);
      }
    }
    setIsButton(false)
  };

  const handleModalClose = () => {
    setSelectedEventsGroup(null);
  };


  const handleSaveEvent = async (updatedDate, updatedTime, isComplete, paymentFile) => {
    let putStatus = "";

    for (const app of selectedEventsGroup) {
      const formData = new FormData();
      if (isComplete) {
        formData.append("isComplete", isComplete);

      } else if (!isComplete && !paymentFile) {
        formData.append("date", updatedDate);
        formData.append("time", updatedTime);
      }

      if (paymentFile) {
        formData.append("payment", paymentFile);
      }



      const response = await fetch(`http://127.0.0.1:8000/appointment/${app.id}`, {
        method: 'PUT',
        body: formData,
      }).catch(error => {
        alert("Error al conectar con el servidor.");
      });

      const infoChangeResponse = await response.json();
      if (response.ok) {
        putStatus = "Se actualizó la cita satisfactoriamente.";
        updateApp();
      } else if (infoChangeResponse.errors[0] === "['Not enough product available for appointment']") {
        putStatus = "Debido a la falta de productos necesarios para este servicio, no podemos agendar la cita. Por favor contactarnos para más información.";
      } else {
        putStatus = "Error al actualizar la cita.";
      }
    };

    alert(putStatus);
    setSelectedEventsGroup(null); // Close modal after saving
  };


  const handleDownloadPayment = (paymentUrl, event) => {
    event.stopPropagation();
    setIsButton(true);
    if (!paymentUrl) {
      alert("No tiene imagen")
    } else {
      window.open(`http://127.0.0.1:8000${paymentUrl}`, '_blank');
    }
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, Object.keys(groupedEvents).length - page * rowsPerPage);

  return (
    services.length > 0 && users.length > 0 && events.length > 0 && Object.keys(groupedEvents).length > 0 ? (<Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#f48fb1' }}>
              {userData.isAdmin && <TableCell>Cliente</TableCell>}
              <TableCell>Servicio</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Hora</TableCell>
              <TableCell>Completada</TableCell>
              <TableCell>Pago</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(groupedEvents).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((key, index) => {
              const eventsGroup = groupedEvents[key];
              const serviceNames = eventsGroup.map(event => {
                const service = services.find(serv => serv.id === event.service);
                return service ? service.name : 'Servicio no encontrado';
              }).join(', ');

              const user = users.find(user => user.id === groupedEvents[key][0].user);
              const paymentUrl = groupedEvents[key][0].payment;

              return (
                <TableRow key={index} onClick={() => handleRowClick(eventsGroup)} style={{ cursor: 'pointer' }}>
                  {userData.isAdmin && <TableCell>{user.name}&nbsp;{user.lastname}</TableCell>}
                  <TableCell>{serviceNames}</TableCell>
                  <TableCell>{eventsGroup[0].date}</TableCell>
                  <TableCell>{eventsGroup[0].time}</TableCell>
                  <TableCell>{eventsGroup[0].isComplete ? 'Si' : 'No'}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={(event) => handleDownloadPayment(paymentUrl, event)}
                      style={{ backgroundColor: '#f48fb1', color: '#fff', fontSize: '12px', padding: '10px 20px' }}
                    >
                      Ver Pago
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {Object.keys(groupedEvents).length === 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={5} sx={{ textAlign: 'center' }}>No tiene citas programadas.</TableCell>
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
          isAdmin={userData.isAdmin}
        />
      )}
    </Paper>) : (<Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: '#f48fb1' }}>
              <TableCell>Servicio</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Hora</TableCell>
              <TableCell>Completada</TableCell>
              <TableCell>Pago</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow style={{}}>
              <TableCell colSpan={5} sx={{ textAlign: 'center' }}>No tiene citas programadas.</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>)
  );
}
