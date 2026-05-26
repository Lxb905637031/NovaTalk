import * as React from 'react'
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

const icons = {
  destructive: AlertCircle,
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
  default: Info,
} as const

type ToastVariant = keyof typeof icons

interface ToastData {
  id: number
  variant: ToastVariant
  title?: string
  message: string
}

let toastContainer: HTMLDivElement | null = null
let toasts: ToastData[] = []

function createToastContainer() {
  if (toastContainer) return
  toastContainer = document.createElement('div')
  toastContainer.className = 'fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80'
  toastContainer.style.cssText = `
    position: fixed;
    bottom: 16px;
    right: 16px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 320px;
  `
  document.body.appendChild(toastContainer)
}

function renderToasts() {
  if (!toastContainer) return
  
  toastContainer.innerHTML = ''
  
  toasts.forEach((toast) => {
    const toastElement = document.createElement('div')
    toastElement.className = `flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg transition-all duration-200 ${
      toast.variant === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-700' :
      toast.variant === 'success' ? 'bg-green-50 border-green-200 text-green-700' :
      toast.variant === 'destructive' ? 'bg-red-50 border-red-200 text-red-700' :
      toast.variant === 'info' ? 'bg-blue-50 border-blue-200 text-blue-700' :
      'bg-gray-50 border-gray-200 text-gray-700'
    }`
    toastElement.style.animation = 'slideIn 0.3s ease-out'
    
    const iconElement = document.createElement('span')
    iconElement.innerHTML = toast.variant === 'warning' ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 9-3 5h4l-3 5"/><circle cx="12" cy="12" r="10"/></svg>' :
                           toast.variant === 'success' ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 11.08-7.29-7.29a2 2 0 0 0-2.83 0L2 12.71"/><path d="m16 16 6 6"/><path d="m22 16 2 2-6-6-4 4-6-6"/></svg>' :
                           toast.variant === 'destructive' ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 9-3 5h4l-3 5"/><circle cx="12" cy="12" r="10"/></svg>' :
                           '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
    
    const contentElement = document.createElement('div')
    contentElement.style.flex = '1'
    contentElement.style.minWidth = '0'
    
    if (toast.title) {
      const titleElement = document.createElement('p')
      titleElement.className = 'text-sm font-medium'
      titleElement.textContent = toast.title
      contentElement.appendChild(titleElement)
    }
    
    const messageElement = document.createElement('p')
    messageElement.className = 'text-sm opacity-90'
    messageElement.textContent = toast.message
    contentElement.appendChild(messageElement)
    
    const closeButton = document.createElement('button')
    closeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'
    closeButton.style.opacity = '0.7'
    closeButton.style.cursor = 'pointer'
    closeButton.onmouseenter = () => { closeButton.style.opacity = '1' }
    closeButton.onmouseleave = () => { closeButton.style.opacity = '0.7' }
    closeButton.onclick = () => removeToast(toast.id)
    
    toastElement.appendChild(iconElement)
    toastElement.appendChild(contentElement)
    toastElement.appendChild(closeButton)
    
    toastContainer?.appendChild(toastElement)
  })
  
  const styleElement = document.createElement('style')
  styleElement.textContent = `
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `
  document.head.appendChild(styleElement)
}

function removeToast(id: number) {
  toasts = toasts.filter((toast) => toast.id !== id)
  renderToasts()
}

export function showToast(message: string, variant: ToastVariant = 'default', title?: string) {
  createToastContainer()
  
  const id = Date.now()
  toasts.push({ id, variant, title, message })
  renderToasts()
  
  setTimeout(() => {
    removeToast(id)
  }, 3000)
  
  return id
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function useToast() {
  return { addToast: showToast }
}