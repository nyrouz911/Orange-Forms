import './globals.css';
import PlausibleProvider from 'next-plausible';

export const metadata = {
  title: 'Forms',
  description: 'AI-powered form builder',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <PlausibleProvider domain={process.env.PLAUSIBLE_DOMAIN || ''} />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
