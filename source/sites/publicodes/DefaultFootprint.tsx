import { useEngine } from '../../components/utils/EngineContext'
import { WithEngine } from '../../RulesProvider'

export const meanFormatter = (value) => Math.round(value / 100) / 10 + ' tonnes'

const DefaultFootprint = ({}) => {
	const engine = useEngine()

	return <span>meanFormatter(engine.evaluate('bilan').nodeValue)</span>
}

export default () => (
	<WithEngine>
		<DefaultFootprint />
	</WithEngine>
)
