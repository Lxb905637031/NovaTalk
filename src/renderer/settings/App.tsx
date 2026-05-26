import { useState } from 'react'
import { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSettingsStore } from '@/store'

import { Theme, Language, AIService } from '@/types/settings'
import { toggleTheme } from '@/lib/theme'
import { Moon, Sun, ChevronDown, ChevronRight } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { showToast } from '@/components/ui/toast'

function Settings() {
  const { t, i18n } = useTranslation()
  const { theme, setTheme, setLanguage, services, toggleService, updateServiceApiKey, updateServiceApiBaseUrl, models, selectedModel, setSelectedModel, setServices, setModels } = useSettingsStore()

  const [expandedService, setExpandedService] = useState<string | null>(null)

  useLayoutEffect(() => {
    const currentTheme = window.electronAPI?.getTheme?.()
    if (currentTheme) {
      setTheme(currentTheme as Theme)
      toggleTheme(currentTheme as Theme)
    }

    const currentLang = window.electronAPI?.getLanguage?.()
    if (currentLang) {
      i18n.changeLanguage(currentLang)
    }

    const savedServices = window.electronAPI?.getServices?.()
    if (savedServices && savedServices.length > 0) {
      setServices(savedServices)
    }

    const savedModels = window.electronAPI?.getModels?.()
    if (savedModels) {
      setModels(savedModels)
    }

    const savedSelectedModel = window.electronAPI?.getSelectedModel?.()
    if (savedSelectedModel) {
      setSelectedModel(savedSelectedModel)
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
  }, [setTheme, i18n, setServices, setModels, setSelectedModel])

  const themes = [
    { value: Theme.Light, label: t('settings.themeLight'), icon: Sun },
    { value: Theme.Dark, label: t('settings.themeDark'), icon: Moon },
  ]

  const languages = [
    { value: Language.Zh, label: t('settings.languageZh') },
    { value: Language.En, label: t('settings.languageEn') },
  ]

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    toggleTheme(newTheme)
    window.electronAPI?.setTheme?.(newTheme)
  }

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
    i18n.changeLanguage(lang)
    window.electronAPI?.setLanguage?.(lang)
  }

  const handleServiceToggle = (serviceId: string) => {
    const service = services.find((s: AIService) => s.id === serviceId)
    if (!service) return

    if (!service.enabled) {
      if (!service.apiKey || !service.apiBaseUrl) {
        showToast(t('settings.pleaseFillApiInfo') || '请先填写API Key和API地址', 'warning')
        return
      }
    }
    toggleService(serviceId)
  }

  const handleApiKeyChange = (serviceId: string, apiKey: string) => {
    updateServiceApiKey(serviceId, apiKey)
  }

  const handleApiUrlChange = (serviceId: string, apiBaseUrl: string) => {
    updateServiceApiBaseUrl(serviceId, apiBaseUrl)
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-foreground)' }}>
            ⚙️ {t('settings.title')}
          </h1>
        </div>

        <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
          <h3 className="text-sm font-medium mb-4 flex items-center gap-2" style={{ color: 'var(--color-foreground)' }}>
            <span>🎨</span>
            {t('settings.theme')}
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {themes.map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => handleThemeChange(value)}
                className="flex flex-col items-center gap-2 p-4 rounded-lg transition-all"
                style={{
                  backgroundColor: theme === value ? 'rgba(168, 85, 247, 0.1)' : 'var(--color-secondary)',
                  borderColor: theme === value ? 'rgba(168, 85, 247, 0.5)' : 'transparent',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  color: theme === value ? 'rgb(168, 85, 247)' : 'var(--color-foreground)',
                }}
                onMouseEnter={(e) => {
                  if (theme !== value) e.currentTarget.style.backgroundColor = 'var(--color-muted)'
                }}
                onMouseLeave={(e) => {
                  if (theme !== value) e.currentTarget.style.backgroundColor = 'var(--color-secondary)'
                }}
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }}>
          <h3 className="text-sm font-medium mb-4 flex items-center gap-2" style={{ color: 'var(--color-foreground)' }}>
            {t('settings.language')}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {languages.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => handleLanguageChange(value)}
                className="p-4 rounded-lg transition-all text-left"
                style={{
                  backgroundColor: i18n.language === value ? 'rgba(168, 85, 247, 0.1)' : 'var(--color-secondary)',
                  borderColor: i18n.language === value ? 'rgba(168, 85, 247, 0.5)' : 'transparent',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  color: i18n.language === value ? 'rgb(168, 85, 247)' : 'var(--color-foreground)',
                }}
                onMouseEnter={(e) => {
                  if (i18n.language !== value) e.currentTarget.style.backgroundColor = 'var(--color-muted)'
                }}
                onMouseLeave={(e) => {
                  if (i18n.language !== value) e.currentTarget.style.backgroundColor = 'var(--color-secondary)'
                }}
              >
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderWidth: '1px', borderStyle: 'solid' }}>
          <h3 className="text-sm font-medium mb-4 flex items-center gap-2" style={{ color: 'var(--color-foreground)' }}>
            {t('settings.modelConfig')}
          </h3>

          <div className="mb-4 flex items-center gap-3">
            <label className="text-sm font-medium flex-shrink-0 h-10 flex items-center" style={{ color: 'var(--color-foreground)' }}>
              {t('settings.defaultModel')}:
            </label>
            <div className="flex-1">
              <Select value={selectedModel} onValueChange={(value) => {
                setSelectedModel(value)
                window.electronAPI?.updateSelectedModel?.(value)
                window.electronAPI?.updateModels?.(models)
              }}>
                <SelectTrigger className="w-full h-10 rounded-lg border border-input bg-background px-3 text-sm font-medium shadow-sm transition-all hover:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-secondary)', color: 'var(--color-foreground)' }}>
                  <SelectValue placeholder={t('settings.selectModel')} />
                </SelectTrigger>
                <SelectContent className="rounded-lg border border-border bg-popover text-popover-foreground shadow-lg" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card)', color: 'var(--color-foreground)' }}>
                  {models.length > 0 ? (
                    models.map((model: string) => (
                      <SelectItem key={model} value={model} className="px-3 py-2.5 text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" style={{ color: 'var(--color-foreground)' }}>
                        {model}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-models" disabled className="px-3 py-2.5 text-sm text-muted-foreground">
                      {t('settings.noEnabledModels')}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            {services.map((service: AIService) => (
              <div key={service.id} className="rounded-lg overflow-hidden" style={{ borderColor: 'var(--color-border)', borderWidth: '1px', borderStyle: 'solid' }}>
                <div
                  onClick={() => setExpandedService(expandedService === service.id ? null : service.id)}
                  className="w-full flex items-center justify-between p-3 transition-colors cursor-pointer"
                  style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-foreground)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-muted)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-secondary)' }}
                >
                  <div className="flex items-center gap-2">
                    {expandedService === service.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    <span className="text-sm font-medium">{service.name}</span>
                  </div>
                  <div className="cursor-pointer" onClick={(e) => e.stopPropagation()}>
                    <Switch checked={service.enabled} onCheckedChange={() => handleServiceToggle(service.id)} />
                  </div>
                </div>

                {expandedService === service.id && (
                  <div className="p-3 space-y-3" style={{ backgroundColor: 'var(--color-background)' }}>
                    <div className="flex items-center gap-3">
                      <label className="text-xs flex-shrink-0 h-9 flex items-center" style={{ color: 'var(--color-muted-foreground)' }}>
                        {t('settings.apiKey')}
                      </label>
                      <div className="flex-1">
                        <Input
                          type="password"
                          placeholder={t('settings.pleaseInput')}
                          value={service.apiKey}
                          onChange={(e) => handleApiKeyChange(service.id, e.target.value)}
                          className="text-sm"
                          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-secondary)', color: 'var(--color-foreground)' }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="text-xs flex-shrink-0 h-9 flex items-center" style={{ color: 'var(--color-muted-foreground)' }}>
                        {t('settings.apiUrl')}
                      </label>
                      <div className="flex-1">
                        <Input
                          value={service.apiBaseUrl}
                          onChange={(e) => handleApiUrlChange(service.id, e.target.value)}
                          className="text-sm"
                          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-secondary)', color: 'var(--color-foreground)' }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="text-xs flex-shrink-0 h-9 flex items-center" style={{ color: 'var(--color-muted-foreground)' }}>
                        {t('settings.models')}
                      </label>
                      <div className="flex-1 flex flex-wrap gap-2 items-center">
                        {service.models.map((model, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs rounded-full"
                            style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-foreground)' }}
                          >
                            {model}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => window.close()}
          className="w-full mt-6 py-2.5 rounded-lg font-medium transition-colors"
          style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-foreground)' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-muted)' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-secondary)' }}
        >
          {t('settings.close')}
        </button>
      </div>
    </div>
  )
}

export default Settings