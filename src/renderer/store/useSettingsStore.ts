import { create } from 'zustand'
import { Theme, Language, ChatState } from '@/types/settings'

const useSettingsStore = create<ChatState>((set) => ({
  theme: Theme.Light,
  language: Language.Zh,
  selectedModel: '',
  apiKey: '',
  models: [],
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
}))

export default useSettingsStore