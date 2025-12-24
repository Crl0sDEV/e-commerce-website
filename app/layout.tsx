import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | BossStore', // E.g., "Black T-Shirt | BossStore"
    default: 'BossStore | Premium E-commerce', // Default sa Home
  },
  description: "The best quality items for the best price. Shop now!",
  openGraph: {
    title: 'BossStore',
    description: 'The best quality items for the best price.',
    type: 'website',
    locale: 'en_PH',
    siteName: 'BossStore',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <div className="min-h-screen flex flex-col">
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </div>

        <Toaster richColors position="top-center" />

      </body>
    </html>
  );
}
