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

interface AIService {
  id: string
  name: string
  enabled: boolean
  apiKey: string
  apiBaseUrl: string
  models: string[]
}

export const defaultServices: AIService[] = [
  {
    id: 'zhipu',
    name: '智谱AI',
    enabled: false,
    apiKey: '',
    apiBaseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    models: ['glm-4-5-flash'],
  },
  {
    id: 'deepseek',
    name: '深度求索 (DeepSeek)',
    enabled: false,
    apiKey: '',
    apiBaseUrl: 'https://api.deepseek.com/v1',
    models: ['deepseek-chat'],
  },
  {
    id: 'siliconflow',
    name: '硅基流动',
    enabled: false,
    apiKey: '',
    apiBaseUrl: 'https://api.siliconflow.cn/v1',
    models: ['Qwen/Qwen3-8B', 'deepseek-ai/DeepSeek-R1-0528-Qwen-8B'],
  },
  {
    id: 'baidu',
    name: '百度千帆',
    enabled: false,
    apiKey: '',
    apiBaseUrl: 'https://qianfan.baidu.com/v2',
    models: ['ernie-speed-128k', 'ernie-4.0-8k', 'ernie-3.5-8k'],
  },
]

interface ChatState {
  theme: Theme
  language: Language
  selectedModel: string
  apiKey: string
  models: string[]
  services: AIService[]
  chats: ChatItem[]
  currentChatId: string | null
  setTheme: (theme: Theme) => void
  setLanguage: (language: Language) => void
  addChat: (title: string) => void
  setCurrentChat: (id: string | null) => void
  setSelectedModel: (selectedModel: string) => void
  setApiKey: (apiKey: string) => void
  setModels: (models: string[]) => void
  setServices: (services: AIService[]) => void
  toggleService: (serviceId: string) => void
  updateServiceApiKey: (serviceId: string, apiKey: string) => void
  updateServiceApiBaseUrl: (serviceId: string, apiBaseUrl: string) => void
}

export {
  Theme,
  Language
}

export type {
  ChatState,
  ChatItem,
  AIService
}