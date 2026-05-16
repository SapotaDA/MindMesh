import { Component, type ReactNode } from 'react'

type Props = { children: ReactNode }

type State = { hasError: boolean; message?: string }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: undefined }

  static getDerivedStateFromError(err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { hasError: true, message }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="w-full max-w-xl glass-card">
            <div className="text-lg font-semibold">Something went wrong</div>
            <div className="text-sm text-white/70 mt-2">{this.state.message}</div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

