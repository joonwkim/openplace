'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import Providers from '../components/Providers';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { ToastContainer } from 'react-toastify';
import BootstrapClient from './components/bootstrapClient';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main className='container'>
            {children}
            <BootstrapClient />
          </main>
          <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
          <Footer />
        </Providers>
      </body>

    </html>
  );
}
