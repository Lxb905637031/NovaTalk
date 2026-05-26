import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Sidebar from './components/Sidebar'
import ChatArea from './components/ChatArea'
import { useSettingsStore } from '@/store'
import { Theme } from '@/types/settings'
import { toggleTheme } from '@/lib/theme'

function App() {
  const { i18n } = useTranslation()
  const { setTheme, setModels, setSelectedModel, setServices } = useSettingsStore()

  useEffect(() => {
    const currentTheme = window.electronAPI?.getTheme?.()
    if (currentTheme) {
      setTheme(currentTheme as Theme)
      toggleTheme(currentTheme as Theme)
    }

    const currentLang = window.electronAPI?.getLanguage?.()
    if (currentLang) {
      i18n.changeLanguage(currentLang)
    }

    const currentModels = window.electronAPI?.getModels?.()
    if (currentModels) {
      setModels(currentModels)
    }

    const currentSelectedModel = window.electronAPI?.getSelectedModel?.()
    if (currentSelectedModel) {
      setSelectedModel(currentSelectedModel)
    }

    const currentServices = window.electronAPI?.getServices?.()
    if (currentServices) {
      setServices(currentServices)
    }

    window.electronAPI?.onThemeChange?.((newTheme: string) => {
      setTheme(newTheme as Theme)
      toggleTheme(newTheme as Theme)
    })

    window.electronAPI?.onLanguageChange?.((lang: string) => {
      i18n.changeLanguage(lang)
    })

    window.electronAPI?.onModelsChange?.((newModels: string[]) => {
      setModels(newModels)
    })

    window.electronAPI?.onSelectedModelChange?.((model: string) => {
      setSelectedModel(model)
    })

    window.electronAPI?.onServicesChange?.((services: any[]) => {
      setServices(services)
    })
  }, [setTheme, i18n, setModels, setSelectedModel, setServices])

  const handleSettingsClick = () => {
    window.electronAPI?.openSettingsWindow?.()
  }

  return (
    <div className="h-screen flex">
      <Sidebar onSettingsClick={handleSettingsClick} />
      <ChatArea />
    </div>
  )
}

export default App
