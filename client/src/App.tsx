import { ErrorBoundary } from './components/ErrorBoundary'
import HomePage from './pages/HomePage'
import ToastHost from './components/ToastHost'

export default function App() {
  return (
    <ErrorBoundary>
      <ToastHost />
      <HomePage />
    </ErrorBoundary>
  )
}


