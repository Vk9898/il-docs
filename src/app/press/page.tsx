import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, ExternalLink, Scale } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Press Release: Hall Attorneys Files Class Action Against Kroll | FTXCLAIMS.COM',
  description: 'W.D. Tex. complaint alleges notice and verification failures harming FTX, BlockFi, and Genesis creditors.',
  openGraph: {
    title: 'Hall Attorneys Files Class Action Against Kroll',
    description: 'Class action complaint filed alleging negligent claims administration harmed FTX, BlockFi, and Genesis creditors',
    type: 'article',
    publishedTime: '2025-08-20T09:00:00-05:00',
    authors: ['Hall Attorneys, P.C.'],
    siteName: 'FTXCLAIMS.COM',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hall Attorneys Files Class Action Against Kroll',
    description: 'Class action complaint filed in U.S. District Court for the Western District of Texas',
  },
}

export default function PressReleasePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": "Hall Attorneys Files Class Action Against Kroll Alleging Negligent Claims Administration",
    "datePublished": "2025-08-20T09:00:00-05:00",
    "dateModified": "2025-08-20T09:00:00-05:00",
    "author": {
      "@type": "Organization",
      "name": "Hall Attorneys, P.C."
    },
    "publisher": {
      "@type": "Organization",
      "name": "FTXCLAIMS.COM",
      "url": "https://dockets.ftxclaims.com"
    },
    "description": "Class action complaint alleges post-incident email-only notices for rights-affecting deadlines, KYC verification holds, months-long support delays, and a blocked tax-form path",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://dockets.ftxclaims.com/press"
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b">
          <div className="container max-w-4xl mx-auto px-4 py-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              ← Back to Document Viewer
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="container max-w-4xl mx-auto px-4 py-8">
          {/* Legal Notice Banner */}
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4 mb-8">
            <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
              Attorney Advertising
            </p>
            <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
              The complaint contains allegations only; no findings have been made.
            </p>
          </div>

          {/* Press Release Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <span>FOR IMMEDIATE RELEASE</span>
              <span>•</span>
              <span>August 20, 2025</span>
              <span>•</span>
              <span>Austin, Texas</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Hall Attorneys Files Class Action Against Kroll Alleging Negligent Claims Administration Harmed FTX, BlockFi, and Genesis Creditors
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              W.D. Tex. complaint alleges post-incident email-only notices for rights-affecting deadlines, KYC verification holds, months-long support delays, and a blocked tax-form path; seeks damages and practical reforms to claimant communications and processing.
            </p>
          </div>

          {/* Document Links Section */}
          <div className="grid gap-4 md:grid-cols-2 mb-8">
            {/* Complaint Document */}
            <Link 
              href="/"
              className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <Scale className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Class Action Complaint</h3>
                <p className="text-sm text-muted-foreground">
                  Repko v. Kroll Restructuring Administration LLC, No. 1:25-cv-01319
                </p>
                <p className="text-xs text-primary mt-2">View PDF Document →</p>
              </div>
            </Link>

            {/* Press Release PDF */}
            <a 
              href="/Hall_Attorneys_Kroll_Class_Action_2025-08-20.pdf"
              className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Press Release (PDF)</h3>
                <p className="text-sm text-muted-foreground">
                  Full press release from Hall Attorneys, P.C.
                </p>
                <p className="text-xs text-primary mt-2">Download PDF →</p>
              </div>
            </a>
          </div>

          {/* Docket Notice Content */}
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold mb-4">Docket Notice</h2>
            
            <p className="mb-4">
              On August 20, 2025, Hall Attorneys, P.C. filed a putative class action lawsuit against Kroll Restructuring Administration LLC in the U.S. District Court for the Western District of Texas. The case, <em>Repko v. Kroll Restructuring Administration LLC</em>, No. 1:25-cv-01319, alleges that Kroll&apos;s post-incident claims administration practices harmed FTX, BlockFi, and Genesis customer-creditors.
            </p>

            <p className="mb-4">
              The complaint alleges that following an August 2023 security incident, crypto-customer creditors were subjected to sophisticated phishing attacks while Kroll continued to rely solely on email communications for rights-affecting deadlines. The suit further alleges the claims verification process was compromised, resulting in account lockouts, processing delays, and in some cases, loss of claims.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Relief Sought</h3>
            <p className="mb-4">
              Beyond damages for phishing, delay-related harms, and expunged claims, the lawsuit seeks practical reforms including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Multi-channel notice (email and First-Class Mail)</li>
              <li>Mailed status-change letters with mandatory cure windows</li>
              <li>A non-gated, manual tax-form option</li>
              <li>Change-control hardening (mailed code to existing addresses before email/phone changes)</li>
              <li>Deliverability safeguards and independent audits</li>
            </ul>

            <div className="bg-muted rounded-lg p-6 my-8">
              <h3 className="text-lg font-semibold mb-3">For Affected Creditors</h3>
              <p className="mb-3">
                FTX/BlockFi/Genesis creditors experiencing phishing, KYC/AML delays, blocked form submissions, or disputed claims are encouraged to preserve emails and screenshots.
              </p>
              <p className="font-semibold">
                Contact: Nicholas Hall, Lead Counsel
              </p>
              <p className="text-sm mt-2">
                Email: nhall@hallattorneys.com<br />
                Phone: 713-428-8967<br />
                X.com: @nicholashall
              </p>
              <p className="text-xs text-muted-foreground mt-3">
                Do not share sensitive data by DM. Type web addresses manually.
              </p>
            </div>
          </div>

          {/* External Links */}
          <div className="border-t pt-8 mt-8">
            <h3 className="text-lg font-semibold mb-4">Additional Resources</h3>
            <div className="flex flex-wrap gap-4">
              <a 
                href="https://ftxclaims.com/press/kroll-class-action-2025-08-20"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                Full Press Release on FTXClaims.com
              </a>
              <a 
                href="https://hallattorneys.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                Hall Attorneys Website
              </a>
            </div>
          </div>

          {/* Footer Disclaimer */}
          <div className="border-t mt-8 pt-8">
            <p className="text-xs text-muted-foreground">
              <strong>Attorney Advertising.</strong> The complaint contains allegations only; no findings have been made. 
              Do not send confidential information unless through the secure email address. 
              This docket notice is for informational purposes only and does not constitute legal advice.
            </p>
          </div>
        </main>
      </div>
    </>
  )
}