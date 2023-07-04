import { explainVariable } from '@/actions/actions'
import animate from '@/components/ui/animate'
import { Markdown } from '@/components/utils/markdown'
import { AppState } from '@/reducers/rootReducer'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import './Aide.css'

export default function Aide() {
	const explained = useSelector((state: AppState) => state.explainedVariable)
	const rules = useSelector((state: AppState) => state.rules)

	const dispatch = useDispatch()

	const stopExplaining = () => dispatch(explainVariable())

	if (!explained) {
		return null
	}

	const rule = rules[explained]
	const text = rule.description

	if (text === undefined) {
		return null
	}

	return (
		<animate.fromTop>
			<div
				css={`
					padding: 0.6rem;
					position: relative;
					> button {
						text-align: right;
					}
				`}
			>
				<Markdown>{text}</Markdown>
				<button onClick={stopExplaining} className="ui__ button simple">
					<Trans>Refermer</Trans>
				</button>
			</div>
		</animate.fromTop>
	)
}
