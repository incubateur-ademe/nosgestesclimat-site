import { Markdown } from '@/components/utils/markdown'
import contentFrBottom from '@/locales/pages/fr/budgetBottom.md'
import contentFrTop from '@/locales/pages/fr/budgetTop.md'
import { useTranslation } from 'react-i18next'
import SelectYear from './budget/SelectYear'

export default () => {
	const { t } = useTranslation()
	return (
		<div className="ui__ container">
			{/* <Meta title={title} description={description} image={image} /> */}
			<Markdown children={contentFrTop} />
			<SelectYear />
			<Markdown children={contentFrBottom} />
		</div>
	)
}
