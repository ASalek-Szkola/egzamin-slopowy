import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Egzamin Slopowy",
  description: "Nauka do egzaminów zawodowych",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Egzamin",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,     // Zapobiega zoomowaniu na kliknięcie w input
  userScalable: false, // Daje odczucie natywnej aplikacji "app-like"
  themeColor: "#000000",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pl"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="bg-black text-white antialiased overscroll-none min-h-[100dvh]">
        {children}
      </body>
    </html>
  );
}