import { createRoot } from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import './styles/index.css'
import i18n from '@/locales'
import App from './App'

const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  )
}
