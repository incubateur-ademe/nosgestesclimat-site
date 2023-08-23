import { useTranslation } from 'react-i18next'

import { Lang } from '../../../locales/translation'
import MarkdownXPage from './MarkdownXPage'

import contentEn from '../../../locales/pages/en-us/about.mdx'

import contentFr from '../../../locales/pages/fr/about.mdx'

export default () => {
	const { t } = useTranslation()
	return (
		<MarkdownXPage
			markdownFiles={[
				[Lang.Fr, contentFr],
				[Lang.En, contentEn],
				// [Lang.Es, contentEs],
				// [Lang.It, contentIt],
			]}
			title={t('meta.publicodes.About.title')}
			description={t('meta.publicodes.About.description')}
		/>
	)
}
