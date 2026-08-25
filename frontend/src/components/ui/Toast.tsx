'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface ToastProps {
  open: boolean
  message: string
  onClose: () => void
  duration?: number
}

export function Toast({
  open,
  message,
  onClose,
  duration = 4000,
}: ToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!open) {
      setVisible(false)
      return
    }

    const frame = window.requestAnimationFrame(() => {
      setVisible(true)
    })

    const timeout = window.setTimeout(() => {
      setVisible(false)

      window.setTimeout(onClose, 200)
    }, duration)

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timeout)
    }
  }, [open, duration, onClose])

  if (!open) {
    return null
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-50 flex max-w-sm items-start gap-3 rounded-lg border border-border bg-[#18181b] px-4 py-3 text-sm text-white shadow-xl transition-all duration-200 ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-8 opacity-0'
      }`}
    >
      <p className="flex-1">{message}</p>

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onClose}
        aria-label="Close notification"
        className="shrink-0 text-muted-foreground hover:bg-white/10 hover:text-white"
      >
        <X />
      </Button>
    </div>
  )
}
