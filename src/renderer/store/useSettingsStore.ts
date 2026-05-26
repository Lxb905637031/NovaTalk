import { create } from 'zustand'
import { Theme, Language, ChatState, defaultServices } from '@/types/settings'
import type { ChatMessage } from '@/types'

const useSettingsStore = create<ChatState>((set) => {
  // 初始化：从已启用的服务收集模型
  const initialModels: string[] = []
  
  defaultServices.forEach(service => {
    if (service.enabled) {
      initialModels.push(...service.models)
    }
  })

  return {
    theme: Theme.Light,
    language: Language.Zh,
    selectedModel:  '',
    apiKey: '',
    models: initialModels,
    services: defaultServices,
    chats: [],
    currentChatId: null,
    setTheme: (theme) => set({ theme }),
    setLanguage: (language) => set({ language }),
    addChat: (title) => set((state) => {
      const newChatId = Date.now().toString()
      return {
        chats: [
          { id: newChatId, title, time: '', preview: '', messages: [] },
          ...state.chats,
        ],
        currentChatId: newChatId,
      }
    }),
    setCurrentChat: (id) => set({ currentChatId: id }),
    setSelectedModel: (selectedModel) => set({ selectedModel }),
    setApiKey: (apiKey) => set({ apiKey }),
    setModels: (models) => set({ models }),
    setServices: (services) => set({ services }),
    addMessage: (chatId: string, message: ChatMessage) => set((state) => ({
      chats: state.chats.map(chat =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, message] }
          : chat
      ),
    })),
    updateMessage: (chatId: string, messageId: string, content: string) => set((state) => ({
      chats: state.chats.map(chat =>
        chat.id === chatId
          ? {
              ...chat,
              messages: chat.messages.map(msg =>
                msg.id === messageId ? { ...msg, content } : msg
              ),
            }
          : chat
      ),
    })),
    toggleService: (serviceId: string) => set((state) => {
      const service = state.services.find((s) => s.id === serviceId)
      if (!service) return state

      const newEnabled = !service.enabled
      let newModels = state.models

      // 简化逻辑：只要服务启用就添加模型
      if (newEnabled) {
        newModels = [...new Set([...state.models, ...service.models])]
      } else {
        newModels = state.models.filter((m) => !service.models.includes(m))
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
  }
})

export default useSettingsStore
