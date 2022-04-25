import { CategoryLabel } from 'Components/conversation/UI'
import { extractCategories } from 'Components/publicodesUtils'
import React from 'react'
import emoji from 'react-easy-emoji'
import { useSelector } from 'react-redux'
import {
	objectifsSelector,
	situationSelector,
} from 'Selectors/simulationSelectors'
import { questionCategoryName } from 'Components/publicodesUtils'
import { useNextQuestions } from 'Components/utils/useNextQuestion'
import { currentQuestionSelector } from 'Selectors/simulationSelectors'
import { useEngine } from 'Components/utils/EngineContext'
import SubCategoriesChart, { InlineBarChart } from './SubCategoriesChart'
import { AnimatePresence } from 'framer-motion'
import SubCategoryBar from './SubCategoryBar'

export default ({}) => {
	// needed for this component to refresh on situation change :
	const situation = useSelector(situationSelector)
	const objectifs = useSelector(objectifsSelector)
	const rules = useSelector((state) => state.rules)
	const engine = useEngine(objectifs)
	const categories = extractCategories(rules, engine).map((category) => ({
		...category,
		abbreviation: rules[category.dottedName].abbréviation,
	}))
	const currentQuestion = useSelector(currentQuestionSelector),
		questionCategory =
			currentQuestion &&
			categories.find(
				({ dottedName }) => dottedName === questionCategoryName(currentQuestion)
			)

	const nextQuestions = useNextQuestions()
	const completedCategories = categories
		.filter(
			({ dottedName }) =>
				!nextQuestions.find((question) => question.includes(dottedName))
		)
		.map(({ dottedName }) => dottedName)

	if (!categories) return null

	const empreinteMaximum = categories.reduce(
		(memo, next) => (memo.nodeValue > next.nodeValue ? memo : next),
		-1
	).nodeValue

	return (
		<div
			css={`
				margin: 1rem 0;
			`}
		>
			<SubCategoriesChart
				{...{
					rules,
					engine,

					categories: categories,
				}}
			/>
		</div>
	)
}
