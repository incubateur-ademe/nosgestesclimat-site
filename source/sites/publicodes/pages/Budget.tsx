import { Markdown } from '@/components/utils/markdown'
import Meta from '@/components/utils/Meta'
import contentEnBottom from '@/locales/pages/en-us/budgetBottom.md'
import contentEnTop from '@/locales/pages/en-us/budgetTop.md'
import contentFrBottom from '@/locales/pages/fr/budgetBottom.md'
import contentFrTop from '@/locales/pages/fr/budgetTop.md'
import { getMarkdownInCurrentLang, Lang } from '@/locales/translation'
import { useTranslation } from 'react-i18next'
import SelectYear from './budget/SelectYear'

export default () => {
	const { t, i18n } = useTranslation()
	const lang: Lang = i18n.language as Lang

	const contentTop = getMarkdownInCurrentLang(
		[
			[Lang.Fr, contentFrTop],
			[Lang.En, contentEnTop],
		],
		lang
	)

	const contentBottom = getMarkdownInCurrentLang(
		[
			[Lang.Fr, contentFrBottom],
			[Lang.En, contentEnBottom],
		],
		lang
	)

	return (
		<div className="ui__ container">
			<Meta
				title={t('meta.publicodes.Budget.title')}
				description={t('meta.publicodes.Budget.description')}
			/>
			<Markdown children={contentTop} />
			<SelectYear />
			<Markdown children={contentBottom} />
		</div>
	)
}
