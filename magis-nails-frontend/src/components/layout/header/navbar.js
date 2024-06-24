import React from "react";
import AuthContext from "../../../context/AuthContext";
import Box from '@mui/material/Box';
import { NavLink } from "react-router-dom";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Tooltip, IconButton, Drawer, List, ListItem, ListItemText, AppBar, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

export default function Navbar() {

  const { user, userData, logoutUser } = React.useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const ActiveStyle = {
    color: '#FD5DA5',
    fontWeight: '500',
    borderBottom: '1px solid #FD5DA5'
  }

  const navLinkStyle = {
    margin: '0 1rem',
    padding: '8px',
    textDecoration: 'none',
    fontWeight: '300',
    fontSize: '1rem',
    color: '#0B090A',
    '&:hover': {
      color: '#E5383B',
      fontWeight: '400',
      borderBottom: '1px solid #E5383B'
    },
    '&:active': {
      fontWeight: '500',
    },
  }

  const menuItems = () => {
    if (userData.isAdmin) {
      return [
        { text: 'MI CUENTA', to: '/micuenta' },
        { text: 'MI CALENDARIO', to: '/' },
        { text: 'AGENDAR SERVICIOS', to: 'agenda' },
        { text: 'USUARIOS', to: 'usuarios' },
        { text: 'SERVICIOS', to: 'servicios' },
        { text: 'PRODUCTOS', to: 'productos' },
        { text: 'REPORTES', to: 'reportes' },
      ];
    } else {
      return [
        { text: 'MI CUENTA', to: '/micuenta' },
        { text: 'MI CALENDARIO', to: '/' },
        { text: 'AGENDAR SERVICIOS', to: 'agenda' },
        // { text: 'USUARIOS', to: 'usuarios' },
        // { text: 'SERVICIOS', to: 'servicios' },
        // { text: 'PRODUCTOS', to: 'productos' },
        // { text: 'REPORTES', to: 'reportes' },
      ];
    }
  }

  const drawer = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {menuItems().map((item, index) => (
          <ListItem button key={index} component={NavLink} to={item.to} style={({ isActive }) => (isActive ? { ...navLinkStyle, ...ActiveStyle } : { ...navLinkStyle })} hidden={true}>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#F5F3F4' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { xs: 'block', md: 'none' } }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon sx={{ color: '#0B090A' }} />
          </IconButton>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1 }}>
            {menuItems().map((item, index) => (
              <NavLink key={index} to={item.to} style={({ isActive }) => (isActive ? { ...navLinkStyle, ...ActiveStyle } : { ...navLinkStyle })}>
                {item.text}
              </NavLink>
            ))}
          </Box>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', paddingRight: '10px' }}>
              <Tooltip title={userData.email}>
                <ExitToAppIcon onClick={logoutUser} sx={{ cursor: 'pointer', color: '#FD5DA5', fontSize: '35px' }} />
              </Tooltip>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
