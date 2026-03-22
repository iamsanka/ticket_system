import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Script from "next/script";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Taprobane Tickets",
  description: "Premium ticketing for Taprobane events",

  icons: {
    icon: "/logo.png",
  },

  openGraph: {
    title: "Taprobane Tickets",
    description: "Premium ticketing for Taprobane events",
    url: "https://tickets-taprobane.com/",
    siteName: "Taprobane Tickets",
    images: [
      {
        url: "https://tickets-taprobane.com/logo.png",
        width: 1200,
        height: 630,
        alt: "Taprobane Tickets",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Taprobane Tickets",
    description: "Premium ticketing for Taprobane events",
    images: ["https://tickets-taprobane.com/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-YHFX8X9ZX3"
          strategy="afterInteractive"
        />
        <Script id="ga-setup" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-YHFX8X9ZX3');
          `}
        </Script>
      </head>

      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
