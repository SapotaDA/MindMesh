import { useEffect, useState } from 'react'
import { subscribeToast } from '../utils/toast'

export default function ToastHost() {
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    return subscribeToast((m) => {
      setMsg(m)
      window.setTimeout(() => setMsg(null), 1800)
    })
  }, [])

  if (!msg) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="px-4 py-3 rounded-2xl border border-white/10 bg-black/60 backdrop-blur text-sm text-white/80 shadow-glow animate-float">
        {msg}
      </div>
    </div>
  )
}

