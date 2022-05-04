import {
	goToQuestion,
	updateSituation,
	validateStepWithValue,
} from 'Actions/actions'
import RuleInput, {
	isMosaic,
	RuleInputProps,
} from 'Components/conversation/RuleInput'
import Notifications from 'Components/Notifications'
import { EngineContext } from 'Components/utils/EngineContext'
import { useNextQuestions } from 'Components/utils/useNextQuestion'
import { TrackerContext } from 'Components/utils/withTracker'
import { sortBy } from 'ramda'
import React, { useContext, useEffect, useState } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
	answeredQuestionsSelector,
	situationSelector,
} from 'Selectors/simulationSelectors'
import { objectifsSelector } from '../../selectors/simulationSelectors'
import CategoryVisualisation from '../../sites/publicodes/CategoryVisualisation'
import { splitName } from '../publicodesUtils'
import useKeypress from '../utils/useKeyPress'
import Aide from './Aide'
import CategoryRespiration from './CategoryRespiration'
import './conversation.css'
import { ExplicableRule } from './Explicable'
import SimulationEnding from './SimulationEnding'
import QuestionFinder from './QuestionFinder'
import emoji from '../emoji'
import { useQuery } from '../../utils'

import Meta from '../../components/utils/Meta'

export type ConversationProps = {
	customEndMessages?: React.ReactNode
	customEnd?: React.ReactNode
}

export default function Conversation({
	customEndMessages,
	customEnd,
	orderByCategories,
}: ConversationProps) {
	const dispatch = useDispatch()
	const engine = useContext(EngineContext),
		rules = engine.getParsedRules()
	const nextQuestions = useNextQuestions()
	const situation = useSelector(situationSelector)
	const previousAnswers = useSelector(answeredQuestionsSelector)
	const tracker = useContext(TrackerContext)
	const objectifs = useSelector(objectifsSelector)
	const rawRules = useSelector((state) => state.rules)
	const previousSimulation = useSelector((state) => state.previousSimulation)

	// orderByCategories is the list of categories, ordered by decreasing nodeValue
	const questionsSortedByCategory = orderByCategories
		? sortBy(
				(question) =>
					-orderByCategories.find((c) => question.indexOf(c.dottedName) === 0)
						?.nodeValue,
				nextQuestions
		  )
		: nextQuestions

	const focusedCategory = useQuery().get('catégorie')
	const focusByCategory = (questions) => {
		if (!focusedCategory) return questions
		const filtered = questionsSortedByCategory.filter(
			(q) => q.indexOf(focusedCategory) === 0
		)
		//this is important : if all questions of a focus have been answered
		// then don't triggered the end screen, just ask the other questions
		// as if no focus
		if (!filtered.length) return questions
		return filtered
	}

	const sortedQuestions = focusByCategory(questionsSortedByCategory)

	const unfoldedStep = useSelector((state) => state.simulation.unfoldedStep)
	const isMainSimulation = objectifs.length === 1 && objectifs[0] === 'bilan',
		currentQuestion = !isMainSimulation ? nextQuestions[0] : sortedQuestions[0]

	const currentQuestionIsAnswered =
		currentQuestion && isMosaic(currentQuestion)
			? true
			: situation[currentQuestion] != null

	const [dismissedRespirations, dismissRespiration] = useState([])
	const [finder, setFinder] = useState(false)

	useEffect(() => {
		if (previousAnswers.length === 1) {
			tracker.push(['trackEvent', 'NGC', '1ère réponse au bilan'])
		}
	}, [previousAnswers, tracker])

	useEffect(() => {
		// This hook lets the user click on the "next" button. Without it, the conversation switches to the next question as soon as an answer is provided.
		// It introduces a state
		// It is important to test for "previousSimulation" : if it exists, it's not loaded yet. Then currentQuestion could be the wrong one, already answered, don't put it as the unfoldedStep
		if (
			currentQuestion &&
			!previousSimulation &&
			currentQuestion !== unfoldedStep
		) {
			dispatch(goToQuestion(currentQuestion))
		}
	}, [dispatch, currentQuestion, previousAnswers, unfoldedStep, objectifs])

	const goToPrevious = () => {
		return dispatch(goToQuestion(previousQuestion))
	}

	// Some questions are grouped in an artifical questions, called mosaic questions,  not present in publicodes
	// here we need to submit all of them when the one that triggered the UI (we don't care which) is submitted, in order to see them in the response list and to avoid repeating the same n times

	const mosaicQuestion = currentQuestion && isMosaic(currentQuestion)
	const questionText = mosaicQuestion
		? mosaicQuestion.question
		: rules[currentQuestion]?.rawNode?.question
	const questionsToSubmit = mosaicQuestion
		? Object.entries(rules)
				.filter(([dottedName, value]) =>
					mosaicQuestion.isApplicable(dottedName)
				)
				.map(([dottedName]) => dottedName)
		: [currentQuestion]

	const currentQuestionIndex = previousAnswers.findIndex(
			(a) => a === unfoldedStep
		),
		previousQuestion =
			currentQuestionIndex < 0 && previousAnswers.length > 0
				? previousAnswers[previousAnswers.length - 1]
				: mosaicQuestion
				? [...previousAnswers]
						.reverse()
						.find(
							(el, index) =>
								index < currentQuestionIndex && !questionsToSubmit.includes(el)
						)
				: previousAnswers[currentQuestionIndex - 1]

	const submit = (source: string) => {
		if (mosaicQuestion?.options?.defaultsToFalse) {
			questionsToSubmit.map((question) =>
				dispatch(updateSituation(question, situation[question] || 'non'))
			)
		}

		questionsToSubmit.map((question) =>
			dispatch({
				type: 'STEP_ACTION',
				name: 'fold',
				step: question,
				source,
			})
		)
	}
	const setDefault = () =>
		// TODO: Skiping a question shouldn't be equivalent to answering the
		// default value (for instance the question shouldn't appear in the
		// answered questions).
		questionsToSubmit.map((question) =>
			dispatch(validateStepWithValue(question, undefined))
		)

	const onChange: RuleInputProps['onChange'] = (value) => {
		dispatch(updateSituation(currentQuestion, value))
	}

	useKeypress('Escape', false, setDefault, 'keyup', [currentQuestion])
	useKeypress(
		'k',
		true,
		(e) => {
			e.preventDefault()
			setFinder((finder) => !finder)
		},
		'keydown',
		[]
	)

	if (!nextQuestions.length)
		return <SimulationEnding {...{ customEnd, customEndMessages }} />

	const questionCategoryName = splitName(currentQuestion)[0],
		questionCategory =
			orderByCategories &&
			orderByCategories.find(
				({ dottedName }) => dottedName === questionCategoryName
			)

	const isCategoryFirstQuestion =
		questionCategory &&
		previousAnswers.find(
			(a) => splitName(a)[0] === questionCategory.dottedName
		) === undefined

	const hasDescription =
		((mosaicQuestion &&
			(mosaicQuestion.description ||
				rules[mosaicQuestion.dottedName].rawNode.description)) ||
			rules[currentQuestion]?.rawNode.description) != null

	return orderByCategories &&
		isCategoryFirstQuestion &&
		!dismissedRespirations.includes(questionCategory.dottedName) ? (
		<CategoryRespiration
			questionCategory={questionCategory}
			dismiss={() =>
				dismissRespiration([
					...dismissedRespirations,
					questionCategory.dottedName,
				])
			}
		/>
	) : (
		<section
			className="ui__ container"
			css={`
				@media (max-width: 800px) {
					padding: 0.4rem 0 0.4rem;
				}
				position: relative;
				padding-top: 1.2rem;
			`}
		>
			{finder ? (
				<QuestionFinder close={() => setFinder(false)} />
			) : (
				<div
					css={`
						position: absolute;
						top: 0;
						right: 0;
						line-height: 1rem;
						button {
							padding: 0;
							display: flex;
							align-items: center;
							color: var(--color);
							opacity: 0.4;
						}
						img {
							width: 1.2rem;
							padding-top: 0.1rem;
						}
						span {
							display: none;
							font-weight: bold;
							font-size: 70%;
							margin-right: 0.3rem;
						}
						@media (min-width: 800px) {
							span {
								display: inline;
							}
						}
					`}
				>
					<button
						onClick={() => setFinder(!finder)}
						title="Recherche rapide de questions dans le formulaire"
					>
						<img src={`/images/1F50D.svg`} aria-hidden="true" />
						<span>Ctrl-K</span>
					</button>
				</div>
			)}
			{orderByCategories && (
				<Meta
					title={rules[objectifs[0]].title + ' - ' + questionCategory.title}
				/>
			)}
			<form
				id="step"
				style={{ outline: 'none' }}
				onSubmit={(e) => {
					e.preventDefault()
				}}
			>
				{orderByCategories && questionCategory && (
					<CategoryVisualisation questionCategory={questionCategory} />
				)}
				<div className="step">
					<h2
						css={`
							margin: 0.4rem 0;
							font-size: 120%;
						`}
					>
						{questionText}{' '}
						{hasDescription && (
							<ExplicableRule
								dottedName={
									(mosaicQuestion && mosaicQuestion.dottedName) ||
									currentQuestion
								}
							/>
						)}
					</h2>
					<Aide />
					<fieldset>
						<RuleInput
							dottedName={currentQuestion}
							onChange={onChange}
							onSubmit={submit}
						/>
					</fieldset>
				</div>
				<div className="ui__ answer-group">
					{previousAnswers.length > 0 && currentQuestionIndex !== 0 && (
						<>
							<button
								onClick={goToPrevious}
								type="button"
								className="ui__ simple small push-left button"
							>
								← <Trans>Précédent</Trans>
							</button>
						</>
					)}
					{currentQuestionIsAnswered ? (
						<button
							className="ui__ plain small button"
							onClick={() => submit('accept')}
						>
							<span className="text">
								<Trans>Suivant</Trans> →
							</span>
						</button>
					) : (
						<button
							onClick={setDefault}
							type="button"
							className="ui__ simple small push-right button"
						>
							<Trans>Je ne sais pas</Trans> →
						</button>
					)}
				</div>
				<Notifications currentQuestion={currentQuestion} />
			</form>
		</section>
	)
}
