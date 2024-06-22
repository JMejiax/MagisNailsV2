import React from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";

export default function NavbarSlide() {
    return (
        <Link to='/' style={{
            position: 'relative',
            width: '100%',
            height: '25vmin',
            margin: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
            overflow: 'hidden'
        }}>
            {/* Image */}
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                }}
            >
                {/* Image */}
                <img
                    alt="Imagen sobre pinturas"
                    src={process.env.PUBLIC_URL + '/pictures/navbar-slide.jpg'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {/* Overlay */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(0, 0, 0, 0.2)',
                        zIndex: 1
                    }}
                />
            </Box>
            <Box
                sx={{
                    width: '100%',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'linear-gradient(to right, #ffffff6e, #ffffff6e)',
                    padding: '10px',
                    borderRadius: '5px',
                    marginBottom: '20px',
                    textAlign: 'center',
                    zIndex: 2
                }}
            >
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        fontWeight: 500,
                        letterSpacing: '0.1em',
                        color: '#fff',
                    }}
                >
                    MAGIS NAILS | ALAJUELA
                </Typography>
            </Box>
            {/* Text Overlay */}
            {/* <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    color: '#FFFFFF',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    textShadow: '2px 2px 4px #FD5DA5',
                    zIndex: 2
                }}
            >
                MAGIS NAILS | ALAJUELA
            </Box> */}
        </Link>
    );
}
