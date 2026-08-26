import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";
import { AppProvider } from "@/context/AppContext";
import SplashScreen from "@/components/SplashScreen";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LongeVita | Cuidado que conecta",
  description: "Plataforma avançada de cuidado humanizado a idosos com segurança LGPD, cuidadores verificados e diário de bordo em tempo real.",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" type="image/svg+xml" href="/logo.svg" />
      </head>
      <body className="min-h-full flex flex-col bg-[#fbfbfd] text-neutral-900 font-sans">
        <ToastProvider>
          <AppProvider>
            <SplashScreen />
            {children}
          </AppProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
