'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; reset: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Filter out extension-related errors
    if (
      error.message?.includes('mobx-state-tree') ||
      error.message?.includes('tx_attempts_exceeded') ||
      error.message?.includes('messaging') ||
      error.stack?.includes('extension')
    ) {
      console.warn('Browser extension error caught and ignored:', error.message)
      return { hasError: false }
    }
    
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Filter out extension-related errors
    if (
      error.message?.includes('mobx-state-tree') ||
      error.message?.includes('tx_attempts_exceeded') ||
      error.message?.includes('messaging') ||
      error.stack?.includes('extension')
    ) {
      return
    }
    
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return (
        <FallbackComponent
          error={this.state.error}
          reset={() => this.setState({ hasError: false, error: undefined })}
        />
      )
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, reset }: { error?: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="text-muted-foreground mb-6">
          {error?.message || 'An unexpected error occurred'}
        </p>
        <button
          type="button"
          onClick={reset}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    </div>
  )
}