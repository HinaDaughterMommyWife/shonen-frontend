import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'El Shonen Semanal',
  description: 'Version Beta de la pagina de votaciones para: "El Shonen Semanal"',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /* const dataEmotes = await fetch('/public/emote-data.json').then((response) => response.json());

  const staticEmotes = Object.values(EmoteChannel)
    .map((channel) => dataEmotes[channel].static)
    .flat();
  const animatedEmotes = Object.values(EmoteChannel)
    .map((channel) => dataEmotes[channel].animated)
    .flat(); */

  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
