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
import { motion } from 'framer-motion'

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

	const variants = {
		open: {
			transition: { staggerChildren: 0.4, delayChildren: 0.1 },
		},
	}

	const itemVariants = {
		open: {
			y: 0,
			opacity: 1,
			transition: {
				y: { stiffness: 1000, velocity: -100 },
			},
		},
		closed: {
			y: 50,
			opacity: 0,
			transition: {
				y: { stiffness: 1000 },
			},
		},
	}

	return (
		<motion.ul
			variants={variants}
			initial="closed"
			animate="open"
			css={`
				list-style-type: none;
				padding-left: 0;
				width: 100%;
				@media (min-width: 800px) {
					width: 90%;
				}

				margin: 0 auto;
			`}
		>
			{topActions.map(([category, action]) => (
				<motion.li
					variants={itemVariants}
					css={`
						padding: 0.4rem 1rem;
						background: ${categories.find((cat) => cat.dottedName === category)
							.color};
						color: white;
						h2 {
							color: inherit;
							font-size: 110%;
							text-align: left;
							margin: 0.8rem;
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
								margin-right: 2.5rem;
								transform: scale(1.5);
								@media (min-width: 800px) {
									transform: scale(2);
								}
								width: 4rem;
							`}
						>
							<CircledEmojis emojis={rules[action.dottedName].icônes} />
						</div>
						<h2>{action.title}</h2>
					</div>
					<div css="margin: .6rem ; text-align: right">
						<ActionValue
							{...{ dottedName: action.dottedName, total: 20000, engine }}
						/>
					</div>
				</motion.li>
			))}
		</motion.ul>
	)
}
