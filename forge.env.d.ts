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
  getModels: () => string[]
  getSelectedModel: () => string
  getServices: () => any[]

  // Settings - setters
  setTheme: (theme: string) => void
  setNotifications: (enabled: boolean) => void
  setAutoSave: (enabled: boolean) => void
  setLanguage: (lang: string) => void

  // Model settings
  updateModels: (models: string[]) => void
  updateSelectedModel: (model: string) => void
  updateServices: (services: any[]) => void

  // Settings change listeners
  onThemeChange: (callback: (theme: string) => void) => void
  onLanguageChange: (callback: (lang: string) => void) => void
  onSettingsChange: (callback: (settings: { theme?: string; notifications?: boolean; autoSave?: boolean; language?: string }) => void) => void
  onModelsChange: (callback: (models: string[]) => void) => void
  onSelectedModelChange: (callback: (model: string) => void) => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}
