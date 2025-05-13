import '../app/globals.css';
import Navbar from '../components/Navbar';
import { Toaster } from 'react-hot-toast';
import SessionWrapper from '../components/SessionWrapper';
export const metadata = {
  title: 'quantum',
  description: 'Welcome to the Quantum. Join the next generation of developers mastering algorithms through AI-powered learning.',
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'GeistSans, sans-serif' }}>
        <SessionWrapper>
          <Navbar />
          {children}
          <Toaster
          position="top-right"
          reverseOrder={false}
           />
        </SessionWrapper>
      </body>
    </html>
  );
}
