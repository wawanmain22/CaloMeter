import { ReactNode } from 'react';

interface AuthOnlyLayoutProps {
  children: ReactNode;
}

export default function AuthOnlyLayout({ children }: AuthOnlyLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* No navbar - clean auth experience */}
      <main>
        {children}
      </main>
    </div>
  );
}