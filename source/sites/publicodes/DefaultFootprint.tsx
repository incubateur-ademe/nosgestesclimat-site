import Engine from 'publicodes'
import { WithEngine } from '../../RulesProvider'
import { useSelector } from 'react-redux'
import { humanWeight } from './HumanWeight'

export const meanFormatter = (value) => humanWeight(value, false).join(' ')

const DefaultFootprint = ({}) => {
	const rules = useSelector((state) => state.rules)
	const engine = new Engine(rules)

	return <span>{meanFormatter(engine.evaluate('bilan').nodeValue)}</span>
}

export default () => (
	<WithEngine>
		<DefaultFootprint />
	</WithEngine>
)
