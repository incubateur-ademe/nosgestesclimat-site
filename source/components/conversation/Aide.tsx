import { explainVariable } from 'Actions/actions'
import animate from 'Components/ui/animate'
import { Markdown } from 'Components/utils/markdown'
import React, { Suspense } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'Reducers/rootReducer'
import AnimatedLoader from '../../AnimatedLoader'
import './Aide.css'

const ReferencesLazy = React.lazy(
	() => import('../../sites/publicodes/DocumentationReferences')
)

export default function Aide() {
	const explained = useSelector((state: RootState) => state.explainedVariable)
	const rules = useSelector((state) => state.rules)

	const dispatch = useDispatch()

	const stopExplaining = () => dispatch(explainVariable())

	if (!explained) return null

	const rule = rules[explained],
		text = rule.description,
		refs = rule.références

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
