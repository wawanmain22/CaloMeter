import Navbar from './navbar';
import { ReactNode } from 'react';

interface NonVerifikasiLayoutProps {
  children: ReactNode;
}

export default function NonVerifikasiLayout({ children }: NonVerifikasiLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar showAuthButtons={true} />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}