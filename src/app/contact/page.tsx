import Link from 'next/link'
import { Scale, ArrowLeft, Mail, MessageSquare, Phone } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Scale className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold">Dockets</h1>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Document
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We&apos;re here to help with any questions about accessing legal documents or understanding the information provided on our platform.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Email</p>
                  <a href="mailto:support@dockets.com" className="text-primary hover:underline">
                    support@dockets.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Legal Inquiries</p>
                  <a href="mailto:legal@dockets.com" className="text-primary hover:underline">
                    legal@dockets.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">Phone Support</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Available Monday-Friday, 9 AM - 5 PM CST
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold mb-4">Important Notice</h2>
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <p>
                <strong>Not Legal Advice:</strong> The information provided on this platform is for informational purposes only and does not constitute legal advice.
              </p>
              <p>
                <strong>Consult an Attorney:</strong> For specific legal questions or advice regarding your situation, please consult with a qualified attorney.
              </p>
              <p>
                <strong>Document Access:</strong> We provide access to publicly available legal documents. We do not represent any parties involved in the litigation.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 p-6 bg-primary/5 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">How do I access the full document?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Simply provide your email address through our secure signup form to unlock full access to all pages of the document.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Is my information secure?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, we use industry-standard security measures to protect your personal information. Please review our Privacy Policy for details.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Can I download the documents?</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Documents are available for viewing only. Download functionality is restricted to protect intellectual property rights.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}