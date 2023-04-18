import { useTranslation } from 'react-i18next'
import { Lang } from '../../../locales/translation'
import MarkdownPage from './MarkdownPage'

import contentEn from '../../../locales/pages/en-us/accessibility.md'
// import contentEs from '../../../locales/pages/es/accessibility.md'
import contentFr from '../../../locales/pages/fr/accessibility.md'
// import contentIt from '../../../locales/pages/it/accessibility.md'

export default () => {
	const { t } = useTranslation()
	return (
		<MarkdownPage
			markdownFiles={[
				[Lang.Fr, contentFr],
				[Lang.En, contentEn],
				// [Lang.Es, contentEs],
				// [Lang.It, contentIt],
			]}
			title={t('meta.publicodes.Accessibility.title')}
			description={t('meta.publicodes.Accessibility.description')}
		/>
	)
}
