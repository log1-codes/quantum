import '../app/globals.css';
import Navbar from '../components/Navbar';
import { Toaster } from 'react-hot-toast';
import SessionWrapper from '../components/SessionWrapper';
// Import the StatsProvider to provide stats context globally
import { StatsProvider } from '../components/StatsContext';

export const metadata = {
  title: 'quantum',
  description: 'Welcome to the Quantum. Join the next generation of developers mastering algorithms through AI-powered learning.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Wrap the app in StatsProvider so stats are cached and accessible everywhere */}
        <StatsProvider>
          <SessionWrapper>
            <Navbar />
            {children}
            <Toaster
              position="top-right"
              reverseOrder={false}
            />
          </SessionWrapper>
        </StatsProvider>
      </body>
    </html>
  );
}
