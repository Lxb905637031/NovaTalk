import { create } from 'zustand'
import { Theme, Language, ChatState, defaultServices } from '@/types/settings'

const useSettingsStore = create<ChatState>((set) => ({
  theme: Theme.Light,
  language: Language.Zh,
  selectedModel: '',
  apiKey: '',
  models: [] as string[],
  services: defaultServices,
  chats: [],
  currentChatId: null,
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
  addChat: (title) => set((state) => ({
    chats: [
      { id: Date.now().toString(), title, time: '', preview: '' },
      ...state.chats,
    ],
    currentChatId: Date.now().toString(),
  })),
  setCurrentChat: (id) => set({ currentChatId: id }),
  setSelectedModel: (selectedModel) => set({ selectedModel }),
  setApiKey: (apiKey) => set({ apiKey }),
  setModels: (models) => set({ models }),
  setServices: (services) => set({ services }),
  toggleService: (serviceId: string) => set((state) => {
    const service = state.services.find((s) => s.id === serviceId)
    if (!service) return state

    const newEnabled = !service.enabled
    let newModels = state.models

    if (newEnabled && service.apiKey && service.apiBaseUrl) {
      newModels = [...new Set([...state.models, service.name])]
    } else if (!newEnabled) {
      newModels = state.models.filter((m) => m !== service.name)
    }

    const newServices = state.services.map((s) =>
      s.id === serviceId ? { ...s, enabled: newEnabled } : s
    )

    if (typeof window !== 'undefined') {
      window.electronAPI?.updateServices?.(newServices)
      window.electronAPI?.updateModels?.(newModels)
    }

    return {
      services: newServices,
      models: newModels,
    }
  }),
  updateServiceApiKey: (serviceId: string, apiKey: string) => set((state) => {
    const newServices = state.services.map((s) =>
      s.id === serviceId ? { ...s, apiKey } : s
    )
    if (typeof window !== 'undefined') {
      window.electronAPI?.updateServices?.(newServices)
    }
    return { services: newServices }
  }),
  updateServiceApiBaseUrl: (serviceId: string, apiBaseUrl: string) => set((state) => {
    const newServices = state.services.map((s) =>
      s.id === serviceId ? { ...s, apiBaseUrl } : s
    )
    if (typeof window !== 'undefined') {
      window.electronAPI?.updateServices?.(newServices)
    }
    return { services: newServices }
  }),
}))

export default useSettingsStore