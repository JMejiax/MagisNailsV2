import React from "react";

import Navbar from "./navbar";
import Box from "@mui/material/Box";
import NavbarSlide from "./navbarSlide";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';


export default function Header() {

    return (
        <>
            <AppBar position="relative" style={{
                padding: "0"
            }}>
                <Toolbar style={{
                    backgroundColor: '#F5F3F4',
                    paddingLeft: '0',
                    paddingRight: '0',
                }}>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        margin: 'auto',
                        flexDirection: 'column',
                    }}>
                        <NavbarSlide />
                        <Navbar />
                    </Box>
                </Toolbar>
            </AppBar>
        </>
    )
}