import { explainVariable } from '@/actions/actions'
import animate from '@/components/ui/animate'
import { Markdown } from '@/components/utils/markdown'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '@/reducers/rootReducer'
import './Aide.css'

export default function Aide() {
	const explained = useSelector((state: RootState) => state.explainedVariable)
	const rules = useSelector((state) => state.rules)

	const dispatch = useDispatch()

	const stopExplaining = () => dispatch(explainVariable())

	if (!explained) return null

	const rule = rules[explained]
	const text = rule.description

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
				{rule.title && <h2>{rule.title}</h2>}
				<Markdown>{text}</Markdown>
				<button onClick={stopExplaining} className="ui__ button simple">
					<Trans>Refermer</Trans>
				</button>
			</div>
		</animate.fromTop>
	)
}
