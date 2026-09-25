import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import "aos/dist/aos.css";
import Script from 'next/script';
import Head from 'next/head';
import Aos from "@/lib/aos"; 


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const greatFighter = localFont({
  src: '../fonts/GreatFighter.woff2',
  variable: '--font-great-fighter',
});

const pixel = localFont({
  src: '../fonts/pixel.ttf',
  variable: '--font-pixel',
});

const ari = localFont({
  src: '../fonts/ari-w9500.ttf',
  variable: '--font-ari-w9500',
});

const fonts = `${geistSans.variable} ${geistMono.variable} ${greatFighter.variable} ${pixel.variable} ${ari.variable}`;

export const metadata: Metadata = {
  title: 'El Shonen Semanal',
  description: 'Version Beta de la pagina de votaciones para: "El Shonen Semanal"',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bodyStyles =
    '[scrollbar-gutter:stable] [&::-webkit-scrollbar-thumb]:rounded-md [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-track]:my-3 [&::-webkit-scrollbar]:absolute [&::-webkit-scrollbar]:w-[6px]';

  return (
    <html lang="en" className="dark">
      <Script
        defer
        src="https://assets.onedollarstats.com/stonks.js"
      />
      <body className={`${fonts} antialiased ${bodyStyles}`}>
        {children}
        <Aos />
      </body>
    </html>
  );
}
