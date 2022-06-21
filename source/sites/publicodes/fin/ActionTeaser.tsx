import { correctValue, splitName } from 'Components/publicodesUtils'
import { EngineContext } from 'Components/utils/EngineContext'
import { utils } from 'publicodes'
import { partition } from 'ramda'
import React, { useContext } from 'react'
import { useSelector } from 'react-redux'
import {
	answeredQuestionsSelector,
	situationSelector,
} from 'Selectors/simulationSelectors'
import { extractCategoriesNamespaces } from '../../../components/publicodesUtils'
import { sortBy } from '../../../utils'
import { ActionValue, disabledAction } from '../ActionVignette'
import emoji from 'react-easy-emoji'
import CircledEmojis from '../../../components/CircledEmojis'

const { encodeRuleName, decodeRuleName } = utils

export default ({}) => {
	const rules = useSelector((state) => state.rules)
	const situation = useSelector(situationSelector),
		answeredQuestions = useSelector(answeredQuestionsSelector)

	const flatActions = rules['actions']

	const simulation = useSelector((state) => state.simulation)

	const objectifs = ['bilan', ...flatActions.formule.somme]

	const engine = useContext(EngineContext)

	const targets = objectifs.map((o) => engine.evaluate(o))

	const categories = extractCategoriesNamespaces(rules, engine)

	const [bilans, actions] = partition((t) => t.dottedName === 'bilan', targets)

	const sortedActionsByImpact = sortBy((a) => -correctValue(a))(actions),
		interestingActions = sortedActionsByImpact.filter((action) => {
			const flatRule = rules[action.dottedName]
			const disabled = disabledAction(flatRule, action.nodeValue)
			return !disabled
		}),
		topActions = interestingActions.reduce((memo, next) => {
			const category = splitName(next.dottedName)[0]

			if (memo.length === 3) return memo
			if (memo.find(([foundCategory, action]) => category === foundCategory))
				return memo
			return [...memo, [category, next]]
		}, [])

	console.log(topActions)

	return (
		<ul
			css={`
				list-style-type: none;
				padding-left: 0;
				width: 90%;
				margin: 0 auto;
			`}
		>
			{topActions.map(([category, action]) => (
				<li
					css={`
						padding: 0.4rem 1rem;
						background: ${categories.find((cat) => cat.dottedName === category)
							.color};
						color: white;
						h2 {
							color: inherit;
							font-size: 120%;
							text-align: left;
						}
						margin: 0.6rem;
						border-radius: 0.4rem;
						display: flex;
						flex-direction: column;
					`}
				>
					<div
						css={`
							display: flex;
							align-items: center;
							justify-content: start;
							border-bottom: 1px solid #ffffff40;
						`}
					>
						<div
							css={`
								margin-right: 2rem;
								transform: scale(2);
								width: 4rem;
							`}
						>
							<CircledEmojis emojis={rules[action.dottedName].icônes} />
						</div>
						<h2>{action.title}</h2>
					</div>
					<div css="margin: .6rem">
						<ActionValue
							{...{ dottedName: action.dottedName, total: 20000, engine }}
						/>
					</div>
				</li>
			))}
		</ul>
	)
}
