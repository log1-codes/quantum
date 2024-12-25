"use client"
import { SessionProvider } from 'next-auth/react';
import '../app/globals.css';
import Navbar from '../components/Navbar';
import ThemeToggle from '../components/ThemeToggle';
import { Toaster } from 'react-hot-toast';
export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
               <SessionProvider>
               <Navbar />
                <ThemeToggle />
                {children}
               
               </SessionProvider>
               <Toaster/>
            </body>
        </html>
    );
}