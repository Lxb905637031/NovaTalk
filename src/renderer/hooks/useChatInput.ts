import { useState, useEffect, useRef } from 'react'
import { useSettingsStore } from '@/store'
import { chatCompletion } from '@/api/openai'
import { AIService } from '@/types'
import { useTranslation } from 'react-i18next'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export interface UseChatInputOptions {
  currentChatId: string | null
}

// Get store state type directly from store
type StoreState = ReturnType<typeof useSettingsStore.getState>

export function useChatInput({ currentChatId }: UseChatInputOptions) {
  const { t } = useTranslation()
  const store = useSettingsStore()

  const {
    chats,
    selectedModel,
    services,
    addChat,
    addMessage,
    updateMessage,
  } = store as StoreState & {
    addMessage: (chatId: string, message: Message) => void
    updateMessage: (chatId: string, messageId: string, content: string) => void
  }

  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasReceivedFirstChunk, setHasReceivedFirstChunk] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const currentChat = chats.find((chat) => chat.id === currentChatId)

  // Sync messages with store when currentChat changes
  useEffect(() => {
    if (currentChat && currentChat.messages) {
      setMessages(currentChat.messages as Message[])
    } else {
      setMessages([])
    }
  }, [currentChatId, currentChat])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getServiceForModel = (model: string) => {
    return services.find((s: AIService) => s.enabled && s.models.includes(model))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = async () => {
    if (!inputValue.trim() || !selectedModel || isLoading) return

    let chatId = currentChatId

    if (!currentChat) {
      addChat(inputValue.trim().substring(0, 30))
      const newChats = useSettingsStore.getState().chats
      chatId = newChats[0].id
    }

    // Ensure chatId is valid before proceeding
    if (!chatId) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
    }

    addMessage(chatId, userMessage)

    const service = getServiceForModel(selectedModel)
    if (!service) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: t('chat.noService'),
      }
      addMessage(chatId, errorMessage)
      setInputValue('')
      return
    }

    const chatMessages = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }))
    chatMessages.push({ role: 'user', content: userMessage.content })

    const assistantMessageId = `${Date.now()}-assistant`
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
    }
    addMessage(chatId, assistantMessage)

    setInputValue('')
    setIsLoading(true)
    setHasReceivedFirstChunk(false)

    try {
      await chatCompletion(
        service,
        selectedModel,
        chatMessages,
        (content: string) => {
          setHasReceivedFirstChunk(true)
          updateMessage(chatId, assistantMessageId, content)
        }
      )
    } catch (error) {
      updateMessage(chatId, assistantMessageId, t('chat.error') + ': ' + (error as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    inputValue,
    setInputValue,
    messages,
    setMessages,
    isLoading,
    setIsLoading,
    hasReceivedFirstChunk,
    setHasReceivedFirstChunk,
    messagesEndRef,
    handleSend,
    handleKeyPress,
    currentChat,
  }
}
