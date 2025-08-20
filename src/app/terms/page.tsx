import Link from 'next/link'
import { Scale, ArrowLeft } from 'lucide-react'

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Dockets, you agree to be bound by these Terms of Service. 
            If you do not agree to these terms, please do not use our service.
          </p>

          <h2>2. Use of Service</h2>
          <p>
            Dockets provides access to legal documents for informational purposes only. 
            The content provided does not constitute legal advice and should not be relied upon as such.
          </p>

          <h2>3. User Registration</h2>
          <p>
            To access certain features, you may be required to provide your email address. 
            You agree to provide accurate information and to keep this information current.
          </p>

          <h2>4. Intellectual Property</h2>
          <p>
            All documents and content provided through Dockets are protected by copyright and other intellectual property laws. 
            You may not reproduce, distribute, or create derivative works without explicit permission.
          </p>

          <h2>5. Privacy</h2>
          <p>
            Your use of our service is also governed by our Privacy Policy. 
            Please review our Privacy Policy to understand our practices.
          </p>

          <h2>6. Disclaimer of Warranties</h2>
          <p>
            The service is provided &quot;as is&quot; without warranties of any kind, either express or implied. 
            We do not warrant that the service will be uninterrupted or error-free.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            Dockets shall not be liable for any indirect, incidental, special, consequential, or punitive damages 
            resulting from your use or inability to use the service.
          </p>

          <h2>8. Modifications</h2>
          <p>
            We reserve the right to modify these terms at any time. 
            Continued use of the service after changes constitutes acceptance of the modified terms.
          </p>

          <h2>9. Governing Law</h2>
          <p>
            These terms shall be governed by and construed in accordance with the laws of the United States 
            and the State of Texas, without regard to conflict of law principles.
          </p>

          <h2>10. Contact Information</h2>
          <p>
            For questions about these Terms of Service, please contact us at legal@dockets.com.
          </p>
        </div>
      </main>
    </div>
  )
}