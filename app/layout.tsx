import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Footer from "@/components/Footer";
import Script from "next/script";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

// Load local Geist Sans only
const geistSans = localFont({
  src: "../public/fonts/Geist-Regular.ttf",
  variable: "--font-geist-sans",
  weight: "400",
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
        className={`${geistSans.variable} antialiased bg-white text-black`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
