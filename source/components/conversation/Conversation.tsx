import { goToQuestion, updateSituation } from 'Actions/actions'
import RuleInput, {
	getRelatedMosaicInfosIfExists,
	RuleInputProps,
} from 'Components/conversation/RuleInput'
import Notifications, { getCurrentNotification } from 'Components/Notifications'
import { EngineContext } from 'Components/utils/EngineContext'
import { useNextQuestions } from 'Components/utils/useNextQuestion'
import { TrackerContext } from 'Components/utils/withTracker'
import { motion } from 'framer-motion'
import React, { Suspense, useContext, useEffect, useState } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
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
import SafeCategoryImage from '../SafeCategoryImage'
import useKeypress from '../utils/useKeyPress'
import { useSimulationProgress } from '../utils/useNextQuestion'
import Aide from './Aide'
import CategoryRespiration from './CategoryRespiration'
import './conversation.css'
import { ExplicableRule } from './Explicable'
import SimulationEnding from './SimulationEnding'
const QuestionFinder = React.lazy(() => import('./QuestionFinder'))

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
	const focusedCategoryTitle = rules[focusedCategory]?.title ?? focusedCategory

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
		// This hook enables to set the focus on the question span and not on the "Suivant" button when going to next question
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
	const ruleMosaicInfos = getRelatedMosaicInfosIfExists(
		engine,
		rules,
		currentQuestion
	)
	const [mosaicQuestion, mosaicParams, mosaicDottedNames] =
		(currentQuestion && ruleMosaicInfos) || []

	const questionText = mosaicQuestion
		? mosaicQuestion.rawNode?.question
		: rules[currentQuestion]?.rawNode?.question

	const questionsToSubmit = mosaicQuestion
		? mosaicDottedNames.map(([dottedName]) => dottedName)
		: [currentQuestion]

	const isAnsweredMosaic =
		currentQuestion &&
		mosaicQuestion &&
		questionsToSubmit
			.map((question) => situation[question] != null)
			.some((bool) => bool === true)

	const currentQuestionIsAnswered = isAnsweredMosaic
		? true
		: situation[currentQuestion] != null

	useEffect(() => {
		// This hook enables to set all the checkbox of a mosaic to false once one is checked
		if (isAnsweredMosaic && mosaicParams['type'] === 'selection') {
			questionsToSubmit.map((question) =>
				dispatch(updateSituation(question, situation[question] || 'non'))
			)
		}
	}, [isAnsweredMosaic])

	useEffect(() => {
		// Pb: for selection mosaics, if the user select a card, the 'je ne sais pas' button disappear. However, if the user deselect the button, without this hook,
		// the default value is set back to the question value, but the user doesn't know as there is no "je ne sais pas" button anymore and nothing is selected
		// This hook enables to set 0 to mosaic question if the mosaic has been answered and nothing is checked.
		const oneIsChecked = questionsToSubmit
			.map((question) => situation[question] === 'oui')
			.some((bool) => bool === true)

		if (
			isAnsweredMosaic &&
			mosaicParams['type'] === 'selection' &&
			!oneIsChecked &&
			situation[mosaicQuestion.dottedName] !== 0
		) {
			dispatch(updateSituation(mosaicQuestion.dottedName, 0))
		}
		if (
			isAnsweredMosaic &&
			mosaicParams['type'] === 'selection' &&
			oneIsChecked &&
			situation[mosaicQuestion.dottedName] === 0
		) {
			dispatch(updateSituation(mosaicQuestion.dottedName, undefined))
		}
	}, [isAnsweredMosaic, questionsToSubmit, situation])

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

	const isValidInput = (questionsToSubmit) => {
		// we want this validation function to work for mosaic questions (we check that all the questions anwsers of a mosaic are valid)
		// we also want it work for questions with multiple notifications
		const questionMatches = questionsToSubmit.map((question) => {
			const notifications = getCurrentNotification(engine, question)
			return notifications
				? !notifications.some(({ sévérité }) => sévérité === 'invalide')
				: true
		})
		return questionMatches.every(Boolean)
	}

	const submit = (source: string) => {
		// This piece of code enables to set all the checkbox of a mosaic to false when "Next" button is pressed (chen the question is submitted)
		// It's important in case of someone arrives at the mosaic question, does not select anything and wants to submit "nothing".

		// we don't check question validation status in the same map as the dispatch because we want all answers in mosaic question
		// to be valid before any dispatch
		if (!isValidInput(questionsToSubmit)) return null

		questionsToSubmit.map((question) => {
			dispatch({
				type: 'STEP_ACTION',
				name: 'fold',
				step: question,
				source,
			})
		})
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

	const displayRespiration =
		orderByCategories &&
		isCategoryFirstQuestion &&
		!tutorials['testCategory-' + questionCategory.dottedName]

	const displayCompletedCategory =
		focusedCategory && !nextQuestions.find((q) => q.includes(focusedCategory))

	return displayCompletedCategory ? (
		<div css="text-align: center; padding: 1rem">
			<motion.div
				initial={{ opacity: 0.1, borderWidth: '0' }}
				animate={{ opacity: 1, scale: 1, borderWidth: '.8rem' }}
				transition={{ duration: 0.6 }}
				css={`
					border: 0.8rem solid #159f85;
					img {
						width: 6rem;
						animate: 1s linear;
					}
					margin: 0 auto 1rem;
					width: 6rem;
					border-radius: 6rem;
					padding: 0.6rem;
				`}
			>
				<SafeCategoryImage
					element={{ dottedName: focusedCategory }}
					whiteBackground="false"
				/>
			</motion.div>
			<p>
				<Trans>Vous avez complété la catégorie</Trans>{' '}
				<i>{focusedCategoryTitle}</i>
			</p>
			<Link to="/profil">
				<Trans>Modifier mes réponses</Trans>
			</Link>
		</div>
	) : displayRespiration ? (
		<CategoryRespiration
			questionCategory={questionCategory}
			dismiss={() =>
				dispatch(skipTutorial('testCategory-' + questionCategory.dottedName))
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

			// This is a design idea, not really useful now
			//border-bottom: 0.6rem solid ${questionCategory.color || 'transparent'};
		>
			{finder ? (
				<Suspense fallback={<div>Chargement</div>}>
					<QuestionFinder close={() => setFinder(false)} />
				</Suspense>
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
							tabIndex="0"
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
							onClick={() => {
								tracker.push(['trackEvent', 'je ne sais pas', currentQuestion])
								setDefault()
							}}
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
