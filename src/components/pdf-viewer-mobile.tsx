'use client'

import { useState, useRef, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react'

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PDFViewerMobileProps {
  url: string
  isLocked: boolean
  onUnlockRequest: () => void
}

export function PDFViewerMobile({ url, isLocked, onUnlockRequest }: PDFViewerMobileProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Fixed scale for mobile - no dynamic resizing
  const scale = 0.8

  useEffect(() => {
    // Prevent any gestures that might cause flickering
    const container = containerRef.current
    if (!container) return

    const preventGestures = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    }

    container.addEventListener('touchstart', preventGestures, { passive: false })
    container.addEventListener('touchmove', preventGestures, { passive: false })

    return () => {
      container.removeEventListener('touchstart', preventGestures)
      container.removeEventListener('touchmove', preventGestures)
    }
  }, [])

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-950" ref={containerRef}>
      {/* Simple Controls */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-50 dark:bg-gray-900 border-b">
        <button
          onClick={() => setPageNumber(p => Math.max(1, p - 1))}
          disabled={pageNumber <= 1}
          className="p-2 disabled:opacity-30"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <span className="text-sm font-medium">
          {pageNumber} / {numPages || '...'}
        </span>
        
        <button
          onClick={() => setPageNumber(p => Math.min(numPages || p, p + 1))}
          disabled={!numPages || pageNumber >= numPages}
          className="p-2 disabled:opacity-30"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* PDF Display - No animations, no dynamic sizing */}
      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 overflow-auto">
          <div className="flex justify-center p-4">
            <Document
              file={url}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              loading={
                <div className="flex justify-center items-center h-96">
                  <div className="text-sm">Loading...</div>
                </div>
              }
              error={
                <div className="text-center text-red-500 p-4">
                  Failed to load PDF
                </div>
              }
              options={{
                cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
                standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
              }}
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                loading={null}
                className={isLocked && pageNumber > 1 ? 'opacity-20' : ''}
              />
            </Document>
          </div>
        </div>

        {/* Lock overlay */}
        {isLocked && pageNumber > 1 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/95 dark:bg-gray-900/95">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 m-4 text-center border">
              <Lock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <h3 className="text-lg font-bold mb-2">Document Locked</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Sign up to unlock all pages
              </p>
              <button
                onClick={onUnlockRequest}
                className="w-full py-2 px-4 bg-black text-white dark:bg-white dark:text-black rounded-lg"
              >
                Unlock Document
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}