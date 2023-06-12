import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getLangInfos, Lang } from './translation'
import unitsTranslations from './units.yaml'

i18next
	.use(initReactI18next)
	.init({
		fallbackLng: getLangInfos(Lang.Default).abrv,
		resources: Object.fromEntries(
			Object.keys(Lang)
				.filter((key) => key !== 'Default')
				.flatMap((key) => {
					const lng = key.toLowerCase()
					return [
						[lng, { units: unitsTranslations[lng] }],
						// [lng, { categories: categoriesTranslations[lng] }],
					]
				})
		),
		react: {
			useSuspense: false,
		},
	})
	.catch((err) => console?.error('Error from i18n load', err))

export default i18next
