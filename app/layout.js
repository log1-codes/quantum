"use client"
import { SessionProvider } from 'next-auth/react';
import '../app/globals.css';
import Navbar from '../components/Navbar';
import { Toaster } from 'react-hot-toast';
export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
               <SessionProvider>
               <Navbar />
                {children}
               
               </SessionProvider>
               <Toaster/>
            </body>
        </html>
    );
}


