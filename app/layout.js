"use client"
import { SessionProvider } from 'next-auth/react';
import '../app/globals.css';
import Navbar from '../components/Navbar';
import { Toaster } from 'react-hot-toast';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body style={{ fontFamily: 'GeistSans, sans-serif' }}>
                <SessionProvider>
                    <Navbar />
                    {children}
                </SessionProvider>
                <Toaster />
            </body>
        </html>
    );
}