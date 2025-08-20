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
      <div className="sticky top-0 z-20 p-4 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700">
        <div className="flex justify-between items-center mx-auto max-w-4xl">
          <div className="flex gap-2 items-center">
            <button
              type="button"
              onClick={() => changePage(-1)}
              disabled={pageNumber <= 1}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium">
              Page {pageNumber} of {numPages || '...'}
            </span>
            <button
              type="button"
              onClick={() => changePage(1)}
              disabled={!numPages || pageNumber >= numPages}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-2 items-center">
            <button
              type="button"
              onClick={() => changeZoom(-0.1)}
              disabled={scale <= 0.5}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="w-16 text-sm font-medium text-center">{Math.round(scale * 100)}%</span>
            <button
              type="button"
              onClick={() => changeZoom(0.1)}
              disabled={scale >= 2.0}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* PDF Document */}
      <div className="overflow-auto flex-1 bg-gray-50 dark:bg-gray-950">
        <div className={`pdf-container ${isLocked ? 'relative' : ''}`}>
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            className="flex justify-center py-8"
            loading={
              <div className="flex justify-center items-center h-96">
                <div className="w-12 h-12 rounded-full border-b-2 animate-spin border-primary"></div>
              </div>
            }
            error={
              <div className="flex justify-center items-center h-96 text-red-500">
                <p>Failed to load PDF. Please try again later.</p>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              className={isLocked && pageNumber > 1 ? 'pdf-blur' : ''}
              renderTextLayer={!isLocked || pageNumber === 1}
              renderAnnotationLayer={false}
            />
          </Document>

          {/* Lock overlay for pages after the first */}
          {isLocked && pageNumber > 1 && (
            <div className="flex absolute inset-0 justify-center items-center backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
              <div className="p-8 max-w-md text-center">
                <Lock className="mx-auto mb-4 w-16 h-16 text-gray-400" />
                <h3 className="mb-2 text-2xl font-bold">Document Locked</h3>
                <p className="mb-6 text-gray-600 dark:text-gray-400">
                  Sign up with your email to unlock the full document and access all pages.
                </p>
                <button
                  type="button"
                  onClick={onUnlockRequest}
                  className="px-6 py-3 font-medium rounded-lg border transition-colors bg-background text-foreground border-border hover:bg-accent"
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