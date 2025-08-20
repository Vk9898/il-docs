'use client'

import { EmailSignupModal } from '@/components/email-signup-modal'
import { PDFViewer } from '@/components/pdf-viewer'
import { MessageCircle, Send, Share2, Twitter } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function LegalDocumentViewer() {
  const [isLocked, setIsLocked] = useState(true)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [hasSignedUp, setHasSignedUp] = useState(false)

  useEffect(() => {
    const signedUp = localStorage.getItem('ftx_document_access')
    if (signedUp) {
      setIsLocked(false)
      setHasSignedUp(true)
    }
  }, [])

  const handleSignupSuccess = (email: string) => {
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-sm border-b border-border sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img src="/favicon.svg" alt="FTXCLAIMS.COM" className="w-9 h-9 drop-shadow-sm" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold tracking-tight text-foreground">FTXCLAIMS.COM <span className="text-muted-foreground font-normal">|</span> Document Viewer</h1>
                <p className="text-xs text-muted-foreground font-medium">powered by <span className="text-primary font-semibold">InstalLaw</span></p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground font-medium hidden sm:block">Case No. 1:25-cv-01319</span>
              <span className="text-muted-foreground hidden sm:block">•</span>
              <span className="text-muted-foreground">•</span>
              <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
              <button
                type="button"
                onClick={() => handleShare('twitter')}
                className="p-2 rounded-md hover:bg-background/80 transition-all duration-200 text-muted-foreground hover:text-foreground"
                aria-label="Share on Twitter"
              >
                <Twitter className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleShare('reddit')}
                className="p-2 rounded-md hover:bg-background/80 transition-all duration-200 text-muted-foreground hover:text-foreground"
                aria-label="Share on Reddit"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleShare('telegram')}
                className="p-2 rounded-md hover:bg-background/80 transition-all duration-200 text-muted-foreground hover:text-foreground"
                aria-label="Share on Telegram"
              >
                <Send className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleShare('copy')}
                className="p-2 rounded-md hover:bg-background/80 transition-all duration-200 text-muted-foreground hover:text-foreground"
                aria-label="Copy link"
              >
                <Share2 className="w-4 h-4" />
              </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Document Information */}
      <section className="bg-card py-4 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-xl font-semibold mb-1">
              Repko v. Kroll Restructuring Administration LLC
            </h1>
            <p className="text-sm text-muted-foreground mb-3">Class Action Complaint</p>
            
            <div className="grid md:grid-cols-2 gap-4 mb-2 text-sm text-muted-foreground">
              <p><span className="font-medium text-foreground">Court:</span> U.S. District Court for the Western District of Texas</p>
              <p><span className="font-medium text-foreground">Case #:</span> 1:25-cv-01319</p>
              <p><span className="font-medium text-foreground">Filed:</span> August 19, 2025</p>
              <p><span className="font-medium text-foreground">Type:</span> Class Action Complaint</p>
            </div>
          </div>
        </div>
      </section>

      {/* Document Viewer */}
      <section className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6 h-[calc(100vh-200px)]">
        <div className="bg-card rounded-lg shadow-sm border border-border h-full flex flex-col">
          {!hasSignedUp && (
            <div className="bg-amber-50 text-amber-900 dark:bg-amber-900/20 dark:text-amber-100 border-b border-border p-3 flex items-start gap-2">
              <div className="text-sm">
                <p className="font-medium">Document access required</p>
                <p className="opacity-90">Preview shows the first page. Provide your email to unlock the full document.</p>
              </div>
              <button type="button" onClick={() => setShowSignupModal(true)} className="ml-auto text-sm font-medium px-3 py-1.5 rounded bg-primary text-primary-foreground hover:bg-primary/90">
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
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 mt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground mb-4">
            This document is made available for informational purposes. 
            Consult with qualified legal counsel regarding specific matters related to your situation.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <span className="text-primary">
              Powered by InstaLaw
            </span>
            <span className="text-gray-300">•</span>
            <a href="https://www.ftxclaims.com/policies/terms" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">Terms</a>
            <span className="text-gray-300">•</span>
            <a href="https://www.ftxclaims.com/policies/privacy" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">Privacy</a>
            <span className="text-gray-300">•</span>
            <a href="mailto:contact@ftxclaims.com" className="text-muted-foreground hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>

      {/* Email Signup Modal */}
      <EmailSignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSuccess={handleSignupSuccess}
      />
    </div>
  )
}