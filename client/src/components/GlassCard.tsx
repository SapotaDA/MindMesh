import type { ReactNode } from 'react'

export default function GlassCard({ children }: { children: ReactNode }) {
  return <section className="glass-card">{children}</section>
}

