'use client'

import { PDFViewerClient } from './pdf-viewer-client'

interface PDFViewerProps {
  url: string
  isLocked: boolean
  onUnlockRequest: () => void
}

export function PDFViewer({ url, isLocked, onUnlockRequest }: PDFViewerProps) {
  return <PDFViewerClient url={url} isLocked={isLocked} onUnlockRequest={onUnlockRequest} />
}