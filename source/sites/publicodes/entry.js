import 'core-js/stable'
import { createRoot } from 'react-dom/client'
import App from './App'
import i18next from '../../locales/i18n'
import translations from '../../locales/ui-en.yaml'

i18next.addResourceBundle('en', 'translation', translations)

// i18next.changeLanguage('en')

let anchor = document.querySelector('#js')

const root = createRoot(anchor) // createRoot(container!) if you use TypeScript
root.render(<App />)
