import type { Metadata } from 'next';
import './globals.css';
import { CampusProvider } from '@/context/CampusContext';

export const metadata: Metadata = {
  title: 'CampusPulse AI – Your Campus, Organised by AI',
  description:
    'AI-powered Campus Event, Notice, Deadline and Personal Productivity Management Platform for college students.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 dark:bg-campus-navy-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-indigo-500 selection:text-white transition-colors duration-200">
        <CampusProvider>
          {children}
        </CampusProvider>
      </body>
    </html>
  );
}

