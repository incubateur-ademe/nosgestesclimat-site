import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { i18nextPlugin, showTranslations } from 'translation-check'
import unitsTranslations from './units.yaml'

export type AvailableLangs = 'fr' | 'en'

// i18next.use(i18nextPlugin).init({
// 	// translationStats: {
// 	// 	// optional options, if not provided it will guess based on your i18next config
// 	// 	queryStringParam: 'showtranslations',
// 	// 	sourceLng: 'en',
// 	// 	targetLngs: ['de', 'it'],
// 	// 	preserveEmptyStrings: false,
// 	// },
// })

i18next
	.use(initReactI18next)
	.init({
		resources: {
			fr: { units: unitsTranslations.fr },
			en: { units: unitsTranslations.en },
		},
		react: {
			useSuspense: false,
		},
	})
	.catch((err) => console?.error('Error from i18n load', err))

export default i18next
