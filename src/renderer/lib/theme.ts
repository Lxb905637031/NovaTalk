import { Theme } from '@/types/settings'

export function toggleTheme(theme: Theme) {
  const rootElement = document.documentElement
  if (theme === Theme.Dark) {
    rootElement.classList.add('dark')
  } else {
    rootElement.classList.remove('dark')
  }
}