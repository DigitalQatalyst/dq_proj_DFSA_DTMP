import React, { useEffect, useState, createContext, useContext } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle as CheckCircleIcon, XCircle as XCircleIcon, X as XIcon } from 'lucide-react'

export type ToastType = 'success' | 'error'

export interface ToastProps {
  message: string
  type: ToastType
  onClose: () => void
  duration?: number
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div className={`flex items-center p-4 mb-4 rounded-lg shadow-lg ${type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`} role="alert">
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 mr-3">
        {type === 'success' ? <CheckCircleIcon className="w-5 h-5 text-green-500" /> : <XCircleIcon className="w-5 h-5 text-red-500" />}
      </div>
      <div className="text-sm font-medium">{message}</div>
      <button
        type="button"
        className={`ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8 ${type === 'success' ? 'bg-green-50 text-green-500 hover:bg-green-100 focus:ring-green-400' : 'bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-400'}`}
        aria-label="Close"
        onClick={onClose}
      >
        <XIcon className="w-5 h-5" />
      </button>
    </div>
  )
}

export interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type: ToastType }>
  onClose: (id: string) => void
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  const portalRoot = typeof document !== 'undefined' ? document.body : null
  if (!portalRoot) return null
  return createPortal(
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end space-y-2 max-w-xs">
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => onClose(toast.id)} />
      ))}
    </div>,
    portalRoot,
  )
}

// Toast context for global access
interface ToastContextType { showToast: (message: string, type: ToastType) => void }
export const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType }>>([])
  const showToast = (message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
  }
  const closeToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id))
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={closeToast} />
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}

