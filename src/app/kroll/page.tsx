import type { Metadata } from 'next'
import LegalDocumentViewer from '../page'

// This metadata sets the canonical URL to the homepage to avoid SEO duplication
export const metadata: Metadata = {
  title: 'Repko v. Kroll - Class Action Complaint | FTXCLAIMS.COM',
  description: 'Class Action Complaint filed in U.S. District Court for the Western District of Texas against Kroll Restructuring Administration LLC',
  alternates: {
    canonical: 'https://dockets.ftxclaims.com' // Points to homepage as canonical
  },
  openGraph: {
    title: 'Repko v. Kroll Restructuring Administration LLC - FTXCLAIMS.COM',
    description: 'Class Action Complaint filed in U.S. District Court for the Western District of Texas. Case Number: 1:25-cv-01319. Access the full legal document.',
    url: 'https://dockets.ftxclaims.com/kroll',
    siteName: 'FTXCLAIMS.COM',
    images: [
      {
        url: 'https://dockets.ftxclaims.com/api/og',
        width: 1200,
        height: 630,
        alt: 'Repko v. Kroll Restructuring Administration LLC - Legal Document Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Repko v. Kroll - FTX Legal Document',
    description: 'Class Action Complaint filed in U.S. District Court. Access the full legal document on FTXCLAIMS.COM',
    images: ['https://dockets.ftxclaims.com/api/og'],
    site: '@ftxclaims',
    creator: '@ftxclaims',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// This page reuses the exact same component as the homepage
// The canonical link in metadata ensures search engines treat the homepage as the primary version
export default function KrollPage() {
  return <LegalDocumentViewer />
}