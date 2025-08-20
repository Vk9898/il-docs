'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Lazy load components based on device type
const PDFViewerDesktop = dynamic(
  () => import('./pdf-viewer-client').then(mod => ({ default: mod.PDFViewerClient })),
  { 
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-96">
        <div className="w-12 h-12 rounded-full border-2 border-t-transparent border-primary animate-spin" />
      </div>
    )
  }
)

const PDFViewerMobile = dynamic(
  () => import('./pdf-viewer-mobile').then(mod => ({ default: mod.PDFViewerMobile })),
  { 
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center h-96">
        <div className="w-10 h-10 rounded-full border-2 border-t-transparent border-primary animate-spin" />
      </div>
    )
  }
)

interface PDFViewerProps {
  url: string
  isLocked: boolean
  onUnlockRequest: () => void
}

export function PDFViewer({ url, isLocked, onUnlockRequest }: PDFViewerProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if mobile on client side only
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkDevice()
    
    // Listen for resize events with debouncing
    let timeoutId: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(checkDevice, 200)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Don't render until we know the device type
  if (isMobile === null) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="w-10 h-10 rounded-full border-2 border-t-transparent border-primary animate-spin" />
      </div>
    )
  }

  // Render appropriate component based on device
  return isMobile ? (
    <PDFViewerMobile url={url} isLocked={isLocked} onUnlockRequest={onUnlockRequest} />
  ) : (
    <PDFViewerDesktop url={url} isLocked={isLocked} onUnlockRequest={onUnlockRequest} />
  )
}