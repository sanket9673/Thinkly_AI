import type { Metadata } from 'next';
import './globals.css';
import { AppStateProvider } from '@/context/AppStateContext';

export const metadata: Metadata = {
  title: 'VoiceCraft Studio | Voice Agent Engineering Workbench',
  description: 'YC-startup level Voice Agent Engineering Workbench, Prompt Compiler, and Live Call Simulator',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-emerald-500/30">
        <AppStateProvider>{children}</AppStateProvider>
      </body>
    </html>
  );
}
