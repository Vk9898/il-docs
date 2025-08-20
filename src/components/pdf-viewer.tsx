import dynamic from 'next/dynamic'

const PDFViewerClient = dynamic(() => import('./pdf-viewer-client').then(mod => ({ default: mod.PDFViewerClient })), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-96">
      <div className="w-12 h-12 rounded-full border-b-2 border-primary"></div>
    </div>
  )
})

interface PDFViewerProps {
  url: string
  isLocked: boolean
  onUnlockRequest: () => void
}

export function PDFViewer({ url, isLocked, onUnlockRequest }: PDFViewerProps) {
  return <PDFViewerClient url={url} isLocked={isLocked} onUnlockRequest={onUnlockRequest} />
}