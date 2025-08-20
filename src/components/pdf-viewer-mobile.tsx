'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Lock } from 'lucide-react'

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
  const [scale, setScale] = useState(1.0)
  const [pageWidth, setPageWidth] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  // Calculate optimal scale for mobile
  useEffect(() => {
    const updateContainerWidth = () => {
      const width = window.innerWidth - 32 // Account for padding
      if (pageWidth > 0) {
        const newScale = width / pageWidth
        setScale(Math.min(newScale, 1.2))
      }
    }

    updateContainerWidth()
    
    // Debounced resize handler
    let timeoutId: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(updateContainerWidth, 150)
    }
    
    window.addEventListener('resize', handleResize)
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', handleResize)
    }
  }, [pageWidth])

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setIsLoading(false)
  }, [])

  const onPageLoadSuccess = useCallback(({ width }: { width: number }) => {
    setPageWidth(width)
    const availableWidth = window.innerWidth - 32
    const newScale = availableWidth / width
    setScale(Math.min(newScale, 1.2))
  }, [])

  const changePage = useCallback((offset: number) => {
    setPageNumber(prev => {
      const newPage = prev + offset
      if (newPage < 1) return 1
      if (numPages && newPage > numPages) return numPages
      return newPage
    })
  }, [numPages])

  const changeZoom = useCallback((delta: number) => {
    setScale(prev => {
      const newScale = prev + delta
      return Math.max(0.5, Math.min(2.0, newScale))
    })
  }, [])

  // Memoize the document options
  const documentOptions = useMemo(() => ({
    file: url,
    onLoadSuccess: onDocumentLoadSuccess,
    options: {
      cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
      standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
    }
  }), [url, onDocumentLoadSuccess])

  // Prevent context menu and selection on locked content
  useEffect(() => {
    if (!isLocked) return

    const preventActions = (e: Event) => {
      if (pageNumber > 1) {
        e.preventDefault()
        return false
      }
    }

    document.addEventListener('contextmenu', preventActions)
    document.addEventListener('selectstart', preventActions)

    return () => {
      document.removeEventListener('contextmenu', preventActions)
      document.removeEventListener('selectstart', preventActions)
    }
  }, [isLocked, pageNumber])

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-950">
      {/* Controls */}
      <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center px-3 py-2">
          {/* Page Navigation */}
          <div className="flex gap-1 items-center">
            <button
              type="button"
              onClick={() => changePage(-1)}
              disabled={pageNumber <= 1}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-50"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-sm font-medium min-w-[60px] text-center">
              {pageNumber}/{numPages || '...'}
            </span>
            <button
              type="button"
              onClick={() => changePage(1)}
              disabled={!numPages || pageNumber >= numPages}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-50"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex gap-1 items-center">
            <button
              type="button"
              onClick={() => changeZoom(-0.1)}
              disabled={scale <= 0.5}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-50"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="w-12 text-xs font-medium text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              type="button"
              onClick={() => changeZoom(0.1)}
              disabled={scale >= 2.0}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-50"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* PDF Container */}
      <div className="flex-1 overflow-auto">
        <div className="min-h-full p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <div className="w-10 h-10 rounded-full border-2 border-t-transparent border-primary animate-spin" />
            </div>
          ) : (
            <Document {...documentOptions}>
              <div className="flex justify-center">
                <Page
                  key={`page_${pageNumber}`}
                  pageNumber={pageNumber}
                  scale={scale}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  onLoadSuccess={onPageLoadSuccess}
                  className={isLocked && pageNumber > 1 ? 'opacity-10' : ''}
                  loading={
                    <div className="flex justify-center items-center h-96">
                      <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-primary animate-spin" />
                    </div>
                  }
                />
              </div>
            </Document>
          )}

          {/* Lock overlay */}
          {isLocked && pageNumber > 1 && (
            <div className="fixed inset-0 z-30 flex items-center justify-center bg-white/95 dark:bg-gray-900/95 p-4">
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6 max-w-sm w-full text-center">
                <Lock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <h3 className="text-xl font-bold mb-2">Document Locked</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Sign up to unlock all pages
                </p>
                <button
                  type="button"
                  onClick={onUnlockRequest}
                  className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-lg font-medium"
                >
                  Unlock Document
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}