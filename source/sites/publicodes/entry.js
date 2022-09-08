import 'core-js/stable'
import { createRoot } from 'react-dom/client'
import App from './App'
import i18next from '../../locales/i18n'
import { getLangInfos, Lang } from '../../locales/translation'
import translationsEn from '../../locales/ui-en.yaml'
import translationsFr from '../../locales/ui-fr.json'

i18next.addResourceBundle('fr', 'translation', translationsFr)
i18next.addResourceBundle('en', 'translation', translationsEn)
i18next.changeLanguage(getLangInfos(Lang.Default).abrv)

let anchor = document.querySelector('#js')

const root = createRoot(anchor) // createRoot(container!) if you use TypeScript
root.render(<App />)
