enum Theme {
  Light = 'light',
  Dark = 'dark',
}

enum Language {
  Zh = 'zh-CN',
  En = 'en-US',
}

interface ChatItem {
  id: string
  title: string
  time: string
  preview: string
}

interface ChatState {
  theme: Theme
  language: Language
  selectedModel: string
  apiKey: string
  models: string[]
  chats: ChatItem[]
  currentChatId: string | null
  setTheme: (theme: Theme) => void
  setLanguage: (language: Language) => void
  addChat: (title: string) => void
  setCurrentChat: (id: string | null) => void
  setSelectedModel: (selectedModel: string) => void
  setApiKey: (apiKey: string) => void
  setModels: (models: string[]) => void
}

export {
  Theme,
  Language
}

export type {
  ChatState,
  ChatItem
}