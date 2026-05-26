// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  openSettingsWindow: () => ipcRenderer.send('open-settings-window'),
  openThemeWindow: () => ipcRenderer.send('open-theme-window'),
  closeWindow: () => ipcRenderer.send('close-window'),

  // Settings - getters
  getTheme: () => ipcRenderer.sendSync('get-theme'),
  getNotifications: () => ipcRenderer.sendSync('get-notifications'),
  getAutoSave: () => ipcRenderer.sendSync('get-autosave'),
  getLanguage: () => ipcRenderer.sendSync('get-language'),
  getModels: () => ipcRenderer.sendSync('get-models'),
  getSelectedModel: () => ipcRenderer.sendSync('get-selected-model'),
  getServices: () => ipcRenderer.sendSync('get-services'),

  // Settings - setters
  setTheme: (theme: string) => ipcRenderer.send('set-theme', theme),
  setNotifications: (enabled: boolean) => ipcRenderer.send('set-notifications', enabled),
  setAutoSave: (enabled: boolean) => ipcRenderer.send('set-autosave', enabled),
  setLanguage: (lang: string) => ipcRenderer.send('set-language', lang),

  // Model settings
  updateModels: (models: string[]) => ipcRenderer.send('update-models', models),
  updateSelectedModel: (model: string) => ipcRenderer.send('update-selected-model', model),
  updateServices: (services: any[]) => ipcRenderer.send('update-services', services),

  // Settings change listeners
  onThemeChange: (callback: (theme: string) => void) => {
    ipcRenderer.on('theme-changed', (_, theme) => callback(theme))
  },
  onLanguageChange: (callback: (lang: string) => void) => {
    ipcRenderer.on('language-changed', (_, lang) => callback(lang))
  },
  onSettingsChange: (callback: (settings: { theme?: string; notifications?: boolean; autoSave?: boolean; language?: string }) => void) => {
    ipcRenderer.on('settings-changed', (_, settings) => callback(settings))
  },
  onModelsChange: (callback: (models: string[]) => void) => {
    ipcRenderer.on('models-changed', (_, models) => callback(models))
  },
  onSelectedModelChange: (callback: (model: string) => void) => {
    ipcRenderer.on('selected-model-changed', (_, model) => callback(model))
  },
  onServicesChange: (callback: (services: any[]) => void) => {
    ipcRenderer.on('services-changed', (_, services) => callback(services))
  },
})
