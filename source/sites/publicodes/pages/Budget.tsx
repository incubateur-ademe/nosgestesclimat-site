import { Markdown } from '@/components/utils/markdown'
import Meta from '@/components/utils/Meta'
import contentFrBottom from '@/locales/pages/fr/budgetBottom.md'
import contentFrTop from '@/locales/pages/fr/budgetTop.md'
import { useTranslation } from 'react-i18next'
import SelectYear from './budget/SelectYear'

export default () => {
	const { t } = useTranslation()
	return (
		<div className="ui__ container">
			<Meta
				title={t('meta.publicodes.Budget.title')}
				description={t('meta.publicodes.Budget.description')}
			/>
			<Markdown children={contentFrTop} />
			<SelectYear />
			<Markdown children={contentFrBottom} />
		</div>
	)
}
