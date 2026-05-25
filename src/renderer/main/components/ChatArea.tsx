import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Send } from 'lucide-react'
import { useSettingsStore } from '@/store'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

function ChatArea() {
  const { t } = useTranslation()
  const { currentChatId, chats, selectedModel , setSelectedModel, models } = useSettingsStore()  
  const [inputValue, setInputValue] = useState('')

  const currentChat = chats.find((chat) => chat.id === currentChatId)

  const handleSend = () => {
    if (!inputValue.trim()) return
    setInputValue('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!currentChat) {
    return (
      <div className="flex-1 flex flex-col" style={{ backgroundColor: 'var(--color-chat-area)' }}>
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                  <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" opacity="0.5" />
                </svg>
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-2 border-purple-500 flex items-center justify-center" style={{ backgroundColor: 'var(--color-card)' }}>
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 text-purple-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-2" style={{ color: 'var(--color-foreground)' }}>
            {t('chat.welcome')}
          </h1>
          <p className="text-center" style={{ color: 'var(--color-muted-foreground)' }}>{t('chat.welcomeSubtitle')}</p>

          <div className="absolute bottom-32 left-1/2 -translate-x-1/2 w-3/4 h-32 opacity-20">
            <div className="absolute bottom-0 left-1/4 w-1/2 h-full bg-purple-300 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/2 w-1/3 h-3/4 bg-purple-200 rounded-full blur-2xl" />
          </div>
        </div>

        <div className="p-6">
          <div className="rounded-xl shadow-lg p-4" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('chat.inputPlaceholder')}
                className="flex-1 px-4 py-3 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-purple-200"
                style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-foreground)' }}
              />
              <Select 
                value={selectedModel} 
                onValueChange={(value) => {
                  if (value === 'add-model') {
                    window.electronAPI?.openSettingsWindow?.()
                  } else {
                    setSelectedModel(value)
                  }
                }}
              >
                <SelectTrigger className="w-[140px] h-11" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-foreground)' }}>
                  <SelectValue placeholder={t('chat.selectModel')} />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
                  {models.length === 0 ? (
                    <SelectItem 
                      key="add-model" 
                      value="add-model" 
                      style={{ color: 'var(--color-foreground)' }}
                    >
                      {t('chat.noModels')}
                    </SelectItem>
                  ) : (
                    models.map((model) => (
                      <SelectItem key={model} value={model} style={{ color: 'var(--color-foreground)' }}>
                        {model}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className={`p-3 rounded-lg transition-all ${
                  inputValue.trim()
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col" style={{ backgroundColor: 'var(--color-chat-area)' }}>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-card)' }}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-semibold">{t('chat.aiName')[0]}</span>
            </div>
            <div>
              <p className="font-medium" style={{ color: 'var(--color-foreground)' }}>{t('chat.aiName')}</p>
              <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>{t('chat.aiTitle')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6" style={{ borderTopColor: 'var(--color-border)' }}>
        <div className="rounded-xl shadow-lg border p-4 max-w-3xl mx-auto" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t('chat.inputPlaceholder')}
              className="flex-1 px-4 py-3 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-purple-200"
              style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-foreground)' }}
            />
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-[140px] h-11" style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-foreground)' }}>
                <SelectValue placeholder={t('chat.selectModel')} />
              </SelectTrigger>
              <SelectContent style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
                {models.map((model) => (
                  <SelectItem key={model} value={model} style={{ color: 'var(--color-foreground)' }}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className={`p-3 rounded-lg transition-all ${
                inputValue.trim()
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatArea
