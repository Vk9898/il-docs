'use client'

import { useState } from 'react'
import { X, CheckCircle, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface EmailSignupModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (email: string) => void
}

export function EmailSignupModal({ isOpen, onClose, onSuccess }: EmailSignupModalProps) {
  const [email, setEmail] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [acceptedMarketing, setAcceptedMarketing] = useState(true)
  const [acceptedLegal, setAcceptedLegal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) {
      setError('Please enter your email address')
      return
    }

    if (!acceptedTerms) {
      setError('You must accept the Terms of Service and Privacy Policy')
      return
    }

    if (!acceptedLegal) {
      setError('You must acknowledge the legal disclaimer')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          acceptedTerms,
          acceptedMarketing,
          acceptedLegal,
          source: 'dockets',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign up')
      }

      onSuccess(email)
      setEmail('')
      setAcceptedTerms(false)
      setAcceptedMarketing(true)
      setAcceptedLegal(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 backdrop-blur-sm bg-black/60"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex fixed inset-0 z-50 justify-center items-center p-4"
          >
            <div className="relative p-6 w-full max-w-md bg-white rounded-2xl shadow-2xl dark:bg-gray-900">
              {/* Close button */}
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header */}
              <div className="mb-6">
                <h2 className="mb-2 text-2xl font-bold text-center">Access Full Document</h2>
                <p className="text-center text-gray-600 dark:text-gray-400">
                  We promise not to spam you - we&apos;ll only send important updates about this case.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="px-4 py-3 w-full bg-white rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                {/* Checkbox Cards */}
                <div className="space-y-3">
                  {/* Terms checkbox card */}
                  <label 
                    htmlFor="terms" 
                    className={`block p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      acceptedTerms 
                        ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={acceptedTerms}
                        onChange={e => setAcceptedTerms(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-foreground">
                          I agree to the{' '}
                          <a
                            href="https://www.ftxclaims.com/policies/terms"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                            onClick={e => e.stopPropagation()}
                          >
                            Terms of Service
                          </a>{' '}
                          and{' '}
                          <a
                            href="https://www.ftxclaims.com/policies/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                            onClick={e => e.stopPropagation()}
                          >
                            Privacy Policy
                          </a>
                        </span>
                        <div className="mt-1 text-xs text-muted-foreground">Required</div>
                      </div>
                    </div>
                  </label>

                  {/* Legal disclaimer checkbox card */}
                  <label 
                    htmlFor="legal" 
                    className={`block p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      acceptedLegal 
                        ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="legal"
                        checked={acceptedLegal}
                        onChange={e => setAcceptedLegal(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-foreground">
                          I acknowledge that signing up for the FTXClaims.com mailing list does not establish an attorney-client relationship or privilege
                        </span>
                        <div className="mt-1 text-xs text-muted-foreground">Required</div>
                      </div>
                    </div>
                  </label>

                  {/* Marketing checkbox card */}
                  <label 
                    htmlFor="marketing" 
                    className={`block p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      acceptedMarketing 
                        ? 'border-primary bg-primary/5 dark:bg-primary/10' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="marketing"
                        checked={acceptedMarketing}
                        onChange={e => setAcceptedMarketing(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <div className="flex-1">
                        <span className="text-sm font-medium text-foreground">
                          Receive notifications about related legal proceedings and document updates
                        </span>
                        <div className="mt-1 text-xs text-muted-foreground">Optional</div>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Error message */}
                {error && (
                  <div className="flex gap-2 items-center p-3 text-red-600 bg-red-50 rounded-lg dark:bg-red-900/20 dark:text-red-400">
                    <AlertCircle className="flex-shrink-0 w-5 h-5" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex gap-2 justify-center items-center px-4 py-3 w-full font-medium text-primary-foreground rounded-lg transition-colors bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 rounded-full border-b-2 border-white animate-spin"></div>
                      <span>Signing up...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Access Document</span>
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  Your information is protected and will not be shared with third parties.
                </p>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
