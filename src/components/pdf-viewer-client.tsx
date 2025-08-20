'use client'

import { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Lock } from 'lucide-react'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// Set up PDF.js worker - use CDN to ensure version match
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PDFViewerProps {
  url: string
  isLocked: boolean
  onUnlockRequest: () => void
}

export function PDFViewerClient({ url, isLocked, onUnlockRequest }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.0)
  const [containerWidth, setContainerWidth] = useState<number | null>(null)

  // Auto-scale based on container width
  useEffect(() => {
    const updateContainerWidth = () => {
      const container = document.querySelector('.pdf-container')
      if (container) {
        const width = container.clientWidth
        setContainerWidth(width)
        // Auto-scale for mobile: fit to container width, with reasonable limits
        if (width < 768) { // mobile breakpoint
          setScale(Math.min(width / 600, 1.2)) // Adjust base scale for mobile
        } else {
          setScale(1.0)
        }
      }
    }

    updateContainerWidth()
    window.addEventListener('resize', updateContainerWidth)
    return () => window.removeEventListener('resize', updateContainerWidth)
  }, [])

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
    <div className="flex relative flex-col h-full">
      {/* PDF Controls */}
      <div className="sticky top-0 z-20 p-2 sm:p-4 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-center mx-auto max-w-4xl gap-2 sm:gap-0">
          <div className="flex gap-1 sm:gap-2 items-center">
            <button
              type="button"
              onClick={() => changePage(-1)}
              disabled={pageNumber <= 1}
              className="p-2 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <span className="text-xs sm:text-sm font-medium px-2 whitespace-nowrap">
              Page {pageNumber} of {numPages || '...'}
            </span>
            <button
              type="button"
              onClick={() => changePage(1)}
              disabled={!numPages || pageNumber >= numPages}
              className="p-2 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <div className="flex gap-1 sm:gap-2 items-center">
            <button
              type="button"
              onClick={() => changeZoom(-0.1)}
              disabled={scale <= 0.5}
              className="p-2 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <span className="w-12 sm:w-16 text-xs sm:text-sm font-medium text-center">{Math.round(scale * 100)}%</span>
            <button
              type="button"
              onClick={() => changeZoom(0.1)}
              disabled={scale >= 2.0}
              className="p-2 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* PDF Document */}
      <div className="overflow-auto flex-1 bg-gray-50 dark:bg-gray-950 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
        <div className={`pdf-container ${isLocked ? 'relative' : ''} min-h-full`}>
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            className="flex justify-center py-4 sm:py-8 px-2 sm:px-4"
            loading={
              <div className="flex justify-center items-center h-64 sm:h-96">
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border-b-2 animate-spin border-primary"></div>
              </div>
            }
            error={
              <div className="flex justify-center items-center h-64 sm:h-96 text-red-500 px-4 text-center">
                <p className="text-sm sm:text-base">Failed to load PDF. Please try again later.</p>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              className={`${isLocked && pageNumber > 1 ? 'pdf-blur' : ''} max-w-full shadow-lg`}
              renderTextLayer={!isLocked || pageNumber === 1}
              renderAnnotationLayer={false}
              width={containerWidth ? Math.min(containerWidth - 32, 800) : undefined}
            />
          </Document>

          {/* Lock overlay for pages after the first */}
          {isLocked && pageNumber > 1 && (
            <div className="flex absolute inset-0 justify-center items-center backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 p-4">
              <div className="p-4 sm:p-8 max-w-sm sm:max-w-md text-center bg-white/95 dark:bg-gray-900/95 rounded-lg shadow-xl border border-border">
                <Lock className="mx-auto mb-3 sm:mb-4 w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                <h3 className="mb-2 text-lg sm:text-2xl font-bold">Document Locked</h3>
                <p className="mb-4 sm:mb-6 text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Sign up with your email to unlock the full document and access all pages.
                </p>
                <button
                  type="button"
                  onClick={onUnlockRequest}
                  className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium rounded-lg border transition-colors bg-background text-foreground border-border hover:bg-accent touch-manipulation w-full sm:w-auto"
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