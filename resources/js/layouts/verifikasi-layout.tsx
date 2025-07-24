import Navbar from './navbar';
import { ReactNode } from 'react';

interface VerifikasiLayoutProps {
  children: ReactNode;
}

export default function VerifikasiLayout({ children }: VerifikasiLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar showAuthButtons={true} />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}