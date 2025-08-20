import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export const metadata: Metadata = {
  title: "FTX Legal Documents - FTXCLAIMS.COM",
  description: "Access important legal documents related to FTX bankruptcy proceedings - Repko v. Kroll Restructuring Administration LLC Class Action Complaint",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FTXCLAIMS.COM",
  },
  openGraph: {
    title: "Repko v. Kroll Restructuring Administration LLC - FTXCLAIMS.COM",
    description: "Class Action Complaint filed in U.S. District Court for the Western District of Texas. Case Number: 1:25-cv-01319. Access the full legal document.",
    url: "https://dockets.ftxclaims.com",
    siteName: "FTXCLAIMS.COM",
    images: [
      {
        url: "https://dockets.ftxclaims.com/api/og",
        width: 1200,
        height: 630,
        alt: "Repko v. Kroll Restructuring Administration LLC - Legal Document Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Repko v. Kroll - FTX Legal Document",
    description: "Class Action Complaint filed in U.S. District Court. Access the full legal document on FTXCLAIMS.COM",
    images: ["https://dockets.ftxclaims.com/api/og"],
    site: "@ftxclaims",
    creator: "@ftxclaims",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
