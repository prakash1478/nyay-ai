import React from 'react'
import { AlertTriangle } from 'lucide-react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught an error:', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-parchment-100 dark:bg-ink-950 px-6">
          <div className="text-center max-w-md">
            <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-crimson-500/10 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-crimson-600" />
            </div>
            <h1 className="text-2xl font-display font-semibold text-ink-900 dark:text-parchment-100 mb-2">
              Something went off the record
            </h1>
            <p className="text-sm text-ink-500 dark:text-parchment-300 mb-6">
              An unexpected error interrupted this session. You can return to the homepage and try again.
            </p>
            <button onClick={this.handleReset} className="btn-primary">
              Return home
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
