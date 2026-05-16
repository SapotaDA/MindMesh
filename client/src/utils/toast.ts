const listeners: Array<(msg: string) => void> = []

export function toast(message: string) {
  for (const l of listeners) l(message)
}

export function subscribeToast(fn: (msg: string) => void) {
  listeners.push(fn)
  return () => {
    const idx = listeners.indexOf(fn)
    if (idx >= 0) listeners.splice(idx, 1)
  }
}


