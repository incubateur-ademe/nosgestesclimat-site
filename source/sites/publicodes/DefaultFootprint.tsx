import Engine from 'publicodes'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { getCurrentLangInfos } from '../../locales/translation'
import { WithEngine } from '../../RulesProvider'
import { humanWeight } from './HumanWeight'

export const meanFormatter = ({ t, i18n }, value) =>
	humanWeight({ t, i18n }, value, false).join(' ')

const DefaultFootprint = ({}) => {
	const rules = useSelector((state) => state.rules)
	const engine = new Engine(rules)
	const { t, i18n } = useTranslation()
	const currentLangInfos = getCurrentLangInfos(i18n)

	return (
		<span>
			{meanFormatter({ t, i18n }, engine.evaluate('bilan').nodeValue)}
		</span>
	)
}

export default () => (
	<WithEngine>
		<DefaultFootprint />
	</WithEngine>
)
