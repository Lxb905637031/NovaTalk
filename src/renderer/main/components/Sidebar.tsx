import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Plus, Sun, Moon, Settings, MessageSquare } from 'lucide-react'
import { useSettingsStore } from '@/store'
import { Theme } from '@/types/settings'
import { toggleTheme } from '@/lib/theme'

interface SidebarProps {
  onSettingsClick: () => void
}

function Sidebar({ onSettingsClick }: SidebarProps) {
  const { t } = useTranslation()
  const { chats, currentChatId, setCurrentChat, addChat, theme, setTheme } = useSettingsStore()
  const [searchQuery, setSearchQuery] = useState('')

  const todayChats = chats.filter((_, index) => index === 0)
  const earlierChats = chats.filter((_, index) => index > 0)

  const handleNewChat = () => {
    addChat(t('sidebar.newChat'))
  }

  const filteredChats = chats.filter(
    (chat) =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.preview.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-72 h-full flex flex-col" style={{ backgroundColor: 'var(--color-sidebar)', borderRightColor: 'var(--color-sidebar-border)' }}>
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-muted-foreground)' }} />
          <input
            type="text"
            placeholder={t('sidebar.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-12 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300"
            style={{ backgroundColor: 'var(--color-secondary)', borderColor: 'var(--color-border)', color: 'var(--color-foreground)' }}
          />
        </div>
      </div>

      <div className="px-4 pb-4">
        <button
          onClick={handleNewChat}
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          {t('sidebar.newChat')}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {searchQuery ? (
          <div className="space-y-1">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setCurrentChat(chat.id)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  currentChatId === chat.id
                    ? 'bg-purple-50 border border-purple-200'
                    : 'border border-transparent'
                }`}
                style={{
                  backgroundColor: currentChatId === chat.id ? 'rgba(168, 85, 247, 0.1)' : 'transparent',
                  borderColor: currentChatId === chat.id ? 'rgba(168, 85, 247, 0.2)' : 'transparent'
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                  if (currentChatId !== chat.id) {
                    e.currentTarget.style.backgroundColor = 'var(--color-sidebar-hover)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentChatId !== chat.id) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }
                }}
              >
                <p className="text-sm font-medium truncate" style={{ color: 'var(--color-foreground)' }}>
                  {chat.title}
                </p>
                <p className="text-xs truncate mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>
                  {chat.preview || chat.title}
                </p>
                <span className="text-xs float-right" style={{ color: 'var(--color-muted-foreground)' }}>
                  {chat.time}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <>
            {todayChats.length > 0 && (
              <>
                <p className="px-2 py-2 text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--color-muted-foreground)' }}>
                  {t('sidebar.today')}
                </p>
                <div className="space-y-1">
                  {todayChats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => setCurrentChat(chat.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        currentChatId === chat.id
                          ? 'bg-purple-50 border border-purple-200'
                          : 'border border-transparent'
                      }`}
                      style={{
                        backgroundColor: currentChatId === chat.id ? 'rgba(168, 85, 247, 0.1)' : 'transparent',
                        borderColor: currentChatId === chat.id ? 'rgba(168, 85, 247, 0.2)' : 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        if (currentChatId !== chat.id) {
                          e.currentTarget.style.backgroundColor = 'var(--color-sidebar-hover)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentChatId !== chat.id) {
                          e.currentTarget.style.backgroundColor = 'transparent'
                        }
                      }}
                    >
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--color-foreground)' }}>
                        {chat.title}
                      </p>
                      <p className="text-xs truncate mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>
                        {chat.preview || chat.title}
                      </p>
                      <span className="text-xs float-right" style={{ color: 'var(--color-muted-foreground)' }}>
                        {chat.time}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {earlierChats.length > 0 && (
              <>
                <p className="px-2 py-2 text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--color-muted-foreground)' }}>
                  {t('sidebar.earlier')}
                </p>
                <div className="space-y-1">
                  {earlierChats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => setCurrentChat(chat.id)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        currentChatId === chat.id
                          ? 'bg-purple-50 border border-purple-200'
                          : 'border border-transparent'
                      }`}
                      style={{
                        backgroundColor: currentChatId === chat.id ? 'rgba(168, 85, 247, 0.1)' : 'transparent',
                        borderColor: currentChatId === chat.id ? 'rgba(168, 85, 247, 0.2)' : 'transparent'
                      }}
                      onMouseEnter={(e) => {
                        if (currentChatId !== chat.id) {
                          e.currentTarget.style.backgroundColor = 'var(--color-sidebar-hover)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentChatId !== chat.id) {
                          e.currentTarget.style.backgroundColor = 'transparent'
                        }
                      }}
                    >
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--color-foreground)' }}>
                        {chat.title}
                      </p>
                      <p className="text-xs truncate mt-0.5" style={{ color: 'var(--color-muted-foreground)' }}>
                        {chat.preview || chat.title}
                      </p>
                      <span className="text-xs float-right" style={{ color: 'var(--color-muted-foreground)' }}>
                        {chat.time}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      <div className="p-3 space-y-1" style={{ borderTopColor: 'var(--color-sidebar-border)' }}>
        <button
          onClick={() => {
            const newTheme = theme === Theme.Light ? Theme.Dark : Theme.Light
            setTheme(newTheme)
            window.electronAPI?.setTheme?.(newTheme)
            toggleTheme(newTheme)
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
          style={{ color: 'var(--color-foreground)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-sidebar-hover)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          {theme === Theme.Light ? (
            <Moon className="w-4 h-4" style={{ color: 'var(--color-muted-foreground)' }} />
          ) : (
            <Sun className="w-4 h-4 text-yellow-500" />
          )}
          <span className="text-sm">{theme === Theme.Light ? t('sidebar.themes') : t('sidebar.themes')}</span>
        </button>
        <button
          onClick={onSettingsClick}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
          style={{ color: 'var(--color-foreground)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-sidebar-hover)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <Settings className="w-4 h-4" style={{ color: 'var(--color-muted-foreground)' }} />
          <span className="text-sm">{t('sidebar.settings')}</span>
        </button>
      </div>

      <div className="p-3" style={{ borderTopColor: 'var(--color-sidebar-border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--color-foreground)' }}>{t('sidebar.chat')}</p>
            <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>{t('app.name')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
