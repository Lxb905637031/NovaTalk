/// <reference types="@electron-forge/plugin-vite/forge-vite-env" />

interface ElectronAPI {
  // Window controls
  openSettingsWindow: () => void
  openThemeWindow: () => void
  closeWindow: () => void

  // Settings - getters
  getTheme: () => string
  getNotifications: () => boolean
  getAutoSave: () => boolean
  getLanguage: () => string

  // Settings - setters
  setTheme: (theme: string) => void
  setNotifications: (enabled: boolean) => void
  setAutoSave: (enabled: boolean) => void
  setLanguage: (lang: string) => void

  // Settings change listeners
  onThemeChange: (callback: (theme: string) => void) => void
  onLanguageChange: (callback: (lang: string) => void) => void
  onSettingsChange: (callback: (settings: { theme?: string; notifications?: boolean; autoSave?: boolean; language?: string }) => void) => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}
