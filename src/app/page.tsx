'use client'

import { EmailSignupModal } from '@/components/email-signup-modal'
import { PDFViewer } from '@/components/pdf-viewer'
import { ThemeToggle } from '@/components/theme-toggle'
import { Share2, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function LegalDocumentViewer() {
  const [isLocked, setIsLocked] = useState(true)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [hasSignedUp, setHasSignedUp] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const signedUp = localStorage.getItem('ftx_document_access')
    if (signedUp) {
      setIsLocked(false)
      setHasSignedUp(true)
    } else {
      // Show signup modal immediately for new users
      setShowSignupModal(true)
    }
  }, [])

  const handleSignupSuccess = () => {
    setIsLocked(false)
    setHasSignedUp(true)
    setShowSignupModal(false)
    localStorage.setItem('ftx_document_access', 'true')
    toast.success('Access granted. You can now view the complete document.')
  }

  const handleShare = (platform: string) => {
    const url = 'https://dockets.ftxclaims.com'
    const text = 'Important legal document regarding FTX bankruptcy proceedings'
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
    } else if (platform === 'reddit') {
      window.open(`https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`, '_blank')
    } else if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank')
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(`${text} ${url}`)
      toast.success('Link copied to clipboard')
    }
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <header className="bg-card/95 backdrop-blur-sm border-b border-border shadow-sm flex-shrink-0">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-1 rounded hover:bg-muted"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/favicon-16.svg" alt="FTXCLAIMS.COM" className="w-8 h-8" />
              <div className="hidden sm:block">
                <h1 className="text-base font-bold tracking-tight text-foreground">FTXCLAIMS.COM <span className="text-muted-foreground font-normal">|</span> Document Viewer</h1>
                <p className="text-xs text-muted-foreground">powered by <span className="text-primary font-semibold">InstalLaw</span></p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => handleShare('twitter')}
                className="p-1.5 rounded hover:bg-background/80 text-muted-foreground hover:text-foreground"
                aria-label="Share on Twitter"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/twitter.svg" alt="Twitter" className="w-4 h-4 dark:invert dark:opacity-70" />
              </button>
              <button
                type="button"
                onClick={() => handleShare('reddit')}
                className="p-1.5 rounded hover:bg-background/80 text-muted-foreground hover:text-foreground"
                aria-label="Share on Reddit"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/reddit.svg" alt="Reddit" className="w-4 h-4 dark:invert dark:opacity-70" />
              </button>
              <button
                type="button"
                onClick={() => handleShare('telegram')}
                className="p-1.5 rounded hover:bg-background/80 text-muted-foreground hover:text-foreground"
                aria-label="Share on Telegram"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/telegram.svg" alt="Telegram" className="w-4 h-4 dark:invert dark:opacity-70" />
              </button>
              <button
                type="button"
                onClick={() => handleShare('copy')}
                className="p-1.5 rounded hover:bg-background/80 text-muted-foreground hover:text-foreground"
                aria-label="Copy link"
              >
                <Share2 className="w-4 h-4" />
              </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area - Mobile optimized */}
      <div className="flex-1 flex overflow-hidden relative min-h-0">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div 
            className="lg:hidden absolute inset-0 bg-black/50 z-10"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Left Sidebar - Document Info - Hidden on mobile by default */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative top-0 left-0 z-30 lg:z-0 w-80 lg:w-96 bg-card border-r border-border flex-shrink-0 overflow-y-auto transition-transform duration-300 h-full lg:h-auto`}>
          <div className="p-6">
            {/* Mobile close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-muted"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold mb-1">
              Repko v. Kroll Restructuring Administration LLC
            </h2>
            <p className="text-sm text-muted-foreground mb-4">Class Action Complaint</p>
            
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-foreground">Court</p>
                <p className="text-muted-foreground">U.S. District Court for the Western District of Texas</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Case Number</p>
                <p className="text-muted-foreground">1:25-cv-01319</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Filed</p>
                <p className="text-muted-foreground">August 19, 2025</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Type</p>
                <p className="text-muted-foreground">Class Action Complaint</p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                This document is made available for informational purposes. 
                Consult with qualified legal counsel regarding specific matters.
              </p>
            </div>

            <div className="mt-6 text-xs text-muted-foreground space-y-1">
              <a href="https://www.ftxclaims.com/policies/terms" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Terms</a>
              <span className="mx-2">•</span>
              <a href="https://www.ftxclaims.com/policies/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Privacy</a>
              <span className="mx-2">•</span>
              <a href="mailto:contact@ftxclaims.com" className="hover:text-foreground">Contact</a>
            </div>
          </div>
        </aside>

        {/* PDF Viewer Area - Mobile optimized */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0 relative">
          {!hasSignedUp && (
            <div className="bg-amber-50 text-amber-900 dark:bg-amber-900/20 dark:text-amber-100 border-b border-border p-3 flex items-start gap-2 flex-shrink-0">
              <div className="text-sm">
                <p className="font-medium">Document access required</p>
                <p className="opacity-90">Preview shows the first page. Provide your email to unlock the full document.</p>
              </div>
              <button type="button" onClick={() => setShowSignupModal(true)} className="ml-auto text-sm font-medium px-3 py-1.5 rounded bg-primary text-primary-foreground hover:bg-primary/90 whitespace-nowrap">
                Unlock full document
              </button>
            </div>
          )}
          <PDFViewer
            url="/api/document"
            isLocked={isLocked}
            onUnlockRequest={() => setShowSignupModal(true)}
          />
        </div>
      </div>

      {/* Email Signup Modal */}
      <EmailSignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSuccess={handleSignupSuccess}
      />
    </div>
  )
}