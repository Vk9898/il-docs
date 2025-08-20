'use client'

import { useState, useEffect, useRef, memo } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Lock, Maximize2, Minimize2 } from 'lucide-react'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// Set up PDF.js worker - use CDN to ensure version match
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PDFViewerProps {
  url: string
  isLocked: boolean
  onUnlockRequest: () => void
}

function PDFViewerClientComponent({ url, isLocked, onUnlockRequest }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [fitToWidth, setFitToWidth] = useState(true)
  const [pageWidth, setPageWidth] = useState<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile and set initial scale
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile && fitToWidth) {
        // Auto fit to width on mobile
        const containerWidth = containerRef.current?.clientWidth || window.innerWidth
        const padding = 16 // Account for padding
        const availableWidth = containerWidth - padding * 2
        if (pageWidth > 0) {
          const newScale = availableWidth / pageWidth
          setScale(Math.min(newScale, 1.5))
        }
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [pageWidth, fitToWidth])


  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if (isLocked) {
        e.preventDefault()
        return false
      }
    }

    const handleSelectStart = (e: Event) => {
      if (isLocked) {
        e.preventDefault()
        return false
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLocked && (e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p')) {
        e.preventDefault()
        return false
      }
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('selectstart', handleSelectStart)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('selectstart', handleSelectStart)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isLocked])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  function onPageLoadSuccess({ width }: { width: number }) {
    setPageWidth(width)
    if (isMobile && fitToWidth && containerRef.current) {
      const containerWidth = containerRef.current.clientWidth
      const padding = 16
      const availableWidth = containerWidth - padding * 2
      const newScale = availableWidth / width
      setScale(Math.min(newScale, 1.5))
    }
  }

  const toggleFitToWidth = () => {
    setFitToWidth(!fitToWidth)
    if (!fitToWidth && pageWidth > 0 && containerRef.current) {
      const containerWidth = containerRef.current.clientWidth
      const padding = 16
      const availableWidth = containerWidth - padding * 2
      const newScale = availableWidth / pageWidth
      setScale(Math.min(newScale, 1.5))
    } else {
      setScale(1.0)
    }
  }

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset
      if (newPageNumber < 1) return 1
      if (numPages && newPageNumber > numPages) return numPages
      return newPageNumber
    })
  }

  const changeZoom = (delta: number) => {
    setScale(prevScale => {
      const newScale = prevScale + delta
      if (newScale < 0.5) return 0.5
      if (newScale > 2.0) return 2.0
      return newScale
    })
  }

  return (
    <div className="flex relative flex-col h-full max-h-full">
      {/* PDF Controls - Fixed position on mobile */}
      <div className="flex-shrink-0 z-20 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700 sticky top-0">
        <div className="px-2 py-2 sm:px-4 sm:py-3">
          <div className="flex justify-between items-center gap-2">
            {/* Page Navigation */}
            <div className="flex gap-1 items-center flex-1 justify-start">
              <button
                type="button"
                onClick={() => changePage(-1)}
                disabled={pageNumber <= 1}
                className="p-1.5 sm:p-2 rounded-lg bg-gray-50 dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs sm:text-sm font-medium px-1 sm:px-2 whitespace-nowrap min-w-[80px] text-center">
                {pageNumber} / {numPages || '...'}
              </span>
              <button
                type="button"
                onClick={() => changePage(1)}
                disabled={!numPages || pageNumber >= numPages}
                className="p-1.5 sm:p-2 rounded-lg bg-gray-50 dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex gap-1 items-center">
              {isMobile && (
                <button
                  type="button"
                  onClick={toggleFitToWidth}
                  className="p-1.5 sm:p-2 rounded-lg bg-gray-50 dark:bg-gray-800"
                  aria-label={fitToWidth ? "Original size" : "Fit to width"}
                >
                  {fitToWidth ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              )}
              <button
                type="button"
                onClick={() => changeZoom(-0.1)}
                disabled={scale <= 0.5}
                className="p-1.5 sm:p-2 rounded-lg bg-gray-50 dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="w-10 sm:w-14 text-xs sm:text-sm font-medium text-center hidden sm:inline">
                {Math.round(scale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => changeZoom(0.1)}
                disabled={scale >= 2.0}
                className="p-1.5 sm:p-2 rounded-lg bg-gray-50 dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>
          
        </div>
      </div>

      {/* PDF Document - Optimized for mobile */}
      <div 
        ref={containerRef}
        className="flex-1 min-h-0 overflow-auto bg-gray-50 dark:bg-gray-950"
      >
        <div className={`pdf-container ${isLocked ? 'relative' : ''} min-h-full`}>
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            className="min-w-fit"
            loading={
              <div className="flex justify-center items-center h-64 sm:h-96">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border-b-2 border-primary"></div>
              </div>
            }
            error={
              <div className="flex justify-center items-center h-64 sm:h-96 text-red-500 px-4 text-center">
                <p className="text-sm sm:text-base">Failed to load PDF. Please try again later.</p>
              </div>
            }
          >
            <div className="flex justify-center py-2 sm:py-8 px-2 sm:px-4">
              <div className="max-w-full overflow-x-auto">
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  className={`${isLocked && pageNumber > 1 ? 'pdf-blur' : ''} max-w-full`}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  onLoadSuccess={onPageLoadSuccess}
                  loading={
                    <div className="flex justify-center items-center h-[400px] sm:h-[600px]">
                      <div className="w-8 h-8 rounded-full border-b-2 border-primary"></div>
                    </div>
                  }
                />
              </div>
            </div>
          </Document>

          {/* Lock overlay for pages after the first - Mobile optimized */}
          {isLocked && pageNumber > 1 && (
            <div className="flex fixed inset-0 z-30 justify-center items-center bg-white/95 dark:bg-gray-900/95 p-4">
              <div className="p-6 sm:p-8 w-full max-w-[90%] sm:max-w-md text-center bg-white dark:bg-gray-900 rounded-xl border border-border">
                <Lock className="mx-auto mb-4 w-14 h-14 sm:w-16 sm:h-16 text-gray-400" />
                <h3 className="mb-3 text-xl sm:text-2xl font-bold">Document Locked</h3>
                <p className="mb-6 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Sign up with your email to unlock the full document and access all pages.
                </p>
                <button
                  type="button"
                  onClick={onUnlockRequest}
                  className="px-6 py-3 w-full text-base font-medium rounded-lg border bg-primary text-primary-foreground"
                >
                  Unlock Full Document
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const PDFViewerClient = memo(PDFViewerClientComponent)