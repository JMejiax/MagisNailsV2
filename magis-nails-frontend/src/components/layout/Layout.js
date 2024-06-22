import React from "react";
import Header from "./header/header";
import Footer from "./footer/footer";

import { Outlet } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline'

export default function Layout() {
    return (
        <div className="App">
            <CssBaseline />
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}