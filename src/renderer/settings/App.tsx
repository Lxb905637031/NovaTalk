import { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSettingsStore } from '@/store'

import { Theme, Language } from '@/types/settings'
import { toggleTheme } from '@/lib/theme'
import { Moon, Sun } from 'lucide-react'

function Settings() {
  const { t, i18n } = useTranslation()
  const { theme, setTheme, setLanguage } = useSettingsStore()

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

    window.electronAPI?.onThemeChange?.((newTheme: string) => {
      setTheme(newTheme as Theme)
      toggleTheme(newTheme as Theme)
    })

    window.electronAPI?.onLanguageChange?.((lang: string) => {
      i18n.changeLanguage(lang)
    })
  }, [setTheme, i18n])

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

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1
            className="text-2xl font-bold"
            style={{ color: 'var(--color-foreground)' }}
          >
            ⚙️ {t('settings.title')}
          </h1>
        </div>

          <div
            className="rounded-xl p-4 mb-4"
            style={{
              backgroundColor: 'var(--color-card)',
              borderColor: 'var(--color-border)',
            }}
          >
            <h3
              className="text-sm font-medium mb-4 flex items-center gap-2"
              style={{ color: 'var(--color-foreground)' }}
            >
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
                    backgroundColor:
                      theme === value
                        ? 'rgba(168, 85, 247, 0.1)'
                        : 'var(--color-secondary)',
                    borderColor:
                      theme === value
                        ? 'rgba(168, 85, 247, 0.5)'
                        : 'transparent',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    color:
                      theme === value
                        ? 'rgb(168, 85, 247)'
                        : 'var(--color-foreground)',
                  }}
                  onMouseEnter={(e) => {
                    if (theme !== value) {
                      e.currentTarget.style.backgroundColor =
                        'var(--color-muted)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (theme !== value) {
                      e.currentTarget.style.backgroundColor =
                        'var(--color-secondary)'
                    }
                  }}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div
            className="rounded-xl p-4 mb-4"
            style={{
              backgroundColor: 'var(--color-card)',
              borderColor: 'var(--color-border)',
            }}
          >
            <h3
              className="text-sm font-medium mb-4 flex items-center gap-2"
              style={{ color: 'var(--color-foreground)' }}
            >
              <span>🌐</span>
              {t('settings.language')}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {languages.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => handleLanguageChange(value)}
                  className="p-4 rounded-lg transition-all text-left"
                  style={{
                    backgroundColor:
                      i18n.language === value
                        ? 'rgba(168, 85, 247, 0.1)'
                        : 'var(--color-secondary)',
                    borderColor:
                      i18n.language === value
                        ? 'rgba(168, 85, 247, 0.5)'
                        : 'transparent',
                    borderWidth: '2px',
                    borderStyle: 'solid',
                    color:
                      i18n.language === value
                        ? 'rgb(168, 85, 247)'
                        : 'var(--color-foreground)',
                  }}
                  onMouseEnter={(e) => {
                    if (i18n.language !== value) {
                      e.currentTarget.style.backgroundColor =
                        'var(--color-muted)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (i18n.language !== value) {
                      e.currentTarget.style.backgroundColor =
                        'var(--color-secondary)'
                    }
                  }}
                >
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
        <button
          onClick={() => window.close()}
          className="w-full mt-6 py-2.5 rounded-lg font-medium transition-colors"
          style={{
            backgroundColor: 'var(--color-secondary)',
            color: 'var(--color-foreground)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-muted)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-secondary)'
          }}
        >
          {t('settings.close')}
        </button>
      </div>
    </div>
  )
}

export default Settings
