import React from "react";
import { Box, Container, Typography, IconButton } from '@mui/material';
import { Facebook, Instagram, WhatsApp } from '@mui/icons-material';

export default function Footer() {
    return (
        <footer>
            <Container
                maxWidth={false} // Override default maxWidth
                sx={{
                    boxShadow: 4,
                    bgcolor: '#F5F3F4',
                    padding: 0,
                    maxWidth: '100%'
                }}
            >
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between', // Space between content
                    alignItems: 'center',
                    height: '15vh',
                    width: '100%', // Ensure the box takes the full width
                    maxWidth: 'none', // Override any maxWidth settings
                    padding: '0 2rem' // Add padding for better spacing
                }}>
                    <Typography component="p">
                        Magis Nails &reg; {new Date().getFullYear()}
                    </Typography>
                    <Box>
                        <IconButton
                            href="https://www.instagram.com/magisnails_cr?igsh=MWJkemNjeDVkeHJjeg=="
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ color: '#0B090A' }}
                        >
                            <Instagram />
                        </IconButton>
                        <IconButton
                            href="https://www.facebook.com/share/LX1EnugFVRMvjUMr/?mibextid=qi2Omg"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ color: '#0B090A' }}
                        >
                            <Facebook />
                        </IconButton>
                        <IconButton
                            href="https://wa.me/+50661119446"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ color: '#0B090A' }}
                        >
                            <WhatsApp />
                        </IconButton>
                    </Box>
                </Box>
            </Container>
        </footer>
    );
}
