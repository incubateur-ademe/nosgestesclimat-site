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
import React, { useContext, useEffect, useState } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import {
	answeredQuestionsSelector,
	situationSelector,
} from 'Selectors/simulationSelectors'
import {
	setTrackingVariable,
	skipTutorial,
	validateWithDefaultValue,
} from '../../actions/actions'
import Meta from '../../components/utils/Meta'
import { objectifsSelector } from '../../selectors/simulationSelectors'
import { sortBy, useQuery } from '../../utils'
import { questionCategoryName, splitName, title } from '../publicodesUtils'
import useKeypress from '../utils/useKeyPress'
import { useSimulationProgress } from '../utils/useNextQuestion'
import Aide from './Aide'
import CategoryRespiration from './CategoryRespiration'
import './conversation.css'
import { ExplicableRule } from './Explicable'
import QuestionFinder from './QuestionFinder'
import SimulationEnding from './SimulationEnding'

export type ConversationProps = {
	customEndMessages?: React.ReactNode
	customEnd?: React.ReactNode
}

export default function Conversation({
	customEndMessages,
	customEnd,
	orderByCategories,
	questionHeadingLevel,
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
		? sortBy((question) => {
				const category = orderByCategories.find(
					(c) => question.indexOf(c.dottedName) === 0
				)
				if (!category) return -1000000
				// We artificially put this category (since it has no actionable question) at the end
				if (category.name === 'services publics') return 1000000
				const value = -category?.nodeValue
				return value
		  })(nextQuestions)
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
		currentQuestion = !isMainSimulation
			? nextQuestions[0]
			: focusedCategory
			? sortedQuestions[0]
			: unfoldedStep || sortedQuestions[0]

	const currentQuestionIsAnswered =
		currentQuestion && isMosaic(currentQuestion)
			? true
			: situation[currentQuestion] != null

	const [finder, setFinder] = useState(false)
	const tutorials = useSelector((state) => state.tutorials)

	const tracking = useSelector((state) => state.tracking)

	useEffect(() => {
		if (!tracking.firstQuestionEventFired && previousAnswers.length === 1) {
			tracker.push(['trackEvent', 'NGC', '1ère réponse au bilan'])
			dispatch(setTrackingVariable('firstQuestionEventFired', true))
		}
	}, [tracker, previousAnswers])

	const progress = useSimulationProgress()

	useEffect(() => {
		// This will help you judge if the "A terminé la simulation" event has good numbers
		if (!tracking.progress90EventFired && progress > 0.9) {
			tracker.push(['trackEvent', 'NGC', 'Progress > 90%'])
			dispatch(setTrackingVariable('progress90EventFired', true))
		}

		if (!tracking.progress50EventFired && progress > 0.5) {
			tracker.push(['trackEvent', 'NGC', 'Progress > 50%'])
			dispatch(setTrackingVariable('progress50EventFired', true))
		}
	}, [tracker, progress])

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

	useEffect(() => {
		// This hook enables top set the focus on the question span and not on the "Suivant" button when going to next question
		const questionElement =
			rules[currentQuestion] &&
			document.getElementById('id-question-' + title(rules[currentQuestion]))
		questionElement?.focus()
	}, [currentQuestion])

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
			dispatch(validateWithDefaultValue(question))
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
	const endEventFired = tracking.endEventFired
	const noQuestionsLeft = !nextQuestions.length

	const bilan = Math.round(engine.evaluate('bilan').nodeValue)

	useEffect(() => {
		if (!endEventFired && noQuestionsLeft) {
			tracker.push([
				'trackEvent',
				'NGC',
				'A terminé la simulation',
				'bilan',
				bilan,
			])
			dispatch(setTrackingVariable('endEventFired', true))
		}
	}, [endEventFired, noQuestionsLeft])

	if (noQuestionsLeft) {
		return <SimulationEnding {...{ customEnd, customEndMessages }} />
	}

	const questionCategory =
		orderByCategories &&
		orderByCategories.find(
			({ dottedName }) => dottedName === questionCategoryName(currentQuestion)
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
		!tutorials[questionCategory.dottedName] ? (
		<CategoryRespiration
			questionCategory={questionCategory}
			dismiss={() => dispatch(skipTutorial(questionCategory.dottedName))}
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

			// This is a design idea, not really useful now
			//border-bottom: 0.6rem solid ${questionCategory.color || 'transparent'};
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
					title={rules[objectifs[0]].title + ' - ' + questionCategory?.title}
				/>
			)}
			<form
				id="step"
				style={{ outline: 'none' }}
				onSubmit={(e) => {
					e.preventDefault()
				}}
			>
				<div className="step">
					<h2
						role="heading"
						aria-level={questionHeadingLevel ?? 2}
						css={`
							margin: 0.4rem 0;
							font-size: 120%;
						`}
					>
						<span
							tabindex="0"
							id={'id-question-' + title(rules[currentQuestion])}
						>
							{questionText}{' '}
						</span>
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
