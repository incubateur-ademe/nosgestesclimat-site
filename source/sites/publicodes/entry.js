import 'core-js/stable'
import { createRoot } from 'react-dom/client'
import App from './App'
import i18n from '../../locales/i18n'

i18n.changeLanguage('fr')

let anchor = document.querySelector('#js')

const root = createRoot(anchor) // createRoot(container!) if you use TypeScript
root.render(<App />)
