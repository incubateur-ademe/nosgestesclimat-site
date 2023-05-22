import {
	setTrackingVariable,
	skipTutorial,
	updateSituation,
	validateWithDefaultValue,
} from '@/actions/actions'
import {
	getMatomoEventClickDontKnow,
	getMatomoEventClickNextQuestion,
	getMatomoEventParcoursTestOver,
	matomoEvent50PercentProgress,
	matomoEvent90PercentProgress,
	matomoEventFirstAnswer,
} from '@/analytics/matomo-events'
import RuleInput, {
	getRelatedMosaicInfosIfExists,
	RuleInputProps,
} from '@/components/conversation/RuleInput'
import Notifications, {
	getCurrentNotification,
} from '@/components/Notifications'
import {
	Category,
	DottedName,
	isRootRule,
	MODEL_ROOT_RULE_NAME,
	questionCategoryName,
	splitName,
} from '@/components/publicodesUtils'
import SafeCategoryImage from '@/components/SafeCategoryImage'
import { EngineContext } from '@/components/utils/EngineContext'
import Meta from '@/components/utils/Meta'
import { MatomoContext } from '@/contexts/MatomoContext'
import useKeypress from '@/hooks/useKeyPress'
import {
	useNextQuestions,
	useSimulationProgress,
} from '@/hooks/useNextQuestion'
import { AppState } from '@/reducers/rootReducer'
import {
	answeredQuestionsSelector,
	isPersonaSelector,
	objectifsSelector,
	situationSelector,
} from '@/selectors/simulationSelectors'
import { useQuery } from '@/utils'
import { enquêteSelector } from 'Enquête/enquêteSelector'
import { motion } from 'framer-motion'
import { utils } from 'publicodes'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Aide from './Aide'
import CategoryRespiration from './CategoryRespiration'
import './conversation.css'
import {
	focusByCategory,
	getPreviousQuestion,
	goToQuestionOrNavigate,
	sortQuestionsByCategory,
} from './conversationUtils'
import { ExplicableRule } from './Explicable'
import QuestionFinderWrapper from './QuestionFinderWrapper'
import SimulationEnding from './SimulationEnding'

export type ConversationProps = {
	customEndMessages?: React.ReactNode
	customEnd?: React.ReactNode
	orderByCategories?: Category[]
	questionHeadingLevel?: number
	isFromActionCard?: boolean
}

export default function Conversation({
	customEndMessages,
	customEnd,
	orderByCategories,
	questionHeadingLevel,
	isFromActionCard,
}: ConversationProps) {
	const dispatch = useDispatch()
	const engine = useContext(EngineContext),
		rules = engine.getParsedRules()
	const nextQuestions = useNextQuestions()
	const situation = useSelector(situationSelector)
	const previousAnswers = useSelector(answeredQuestionsSelector)
	const { trackEvent } = useContext(MatomoContext)
	const objectifs = useSelector(objectifsSelector)

	// We want to get the initial order category to avoid reordering the questions
	const initialOrderByCategories = useRef(orderByCategories).current
	const previousSimulation = useSelector(
		(state: AppState) => state.previousSimulation
	)

	// [initialOrderByCategories] is the list of categories, ordered by decreasing nodeValue
	const questionsSortedByCategory = initialOrderByCategories
		? sortQuestionsByCategory(nextQuestions, initialOrderByCategories)
		: nextQuestions

	const focusedCategory = useQuery().get('catégorie')
	const pathname = useLocation().pathname

	const focusedCategoryTitle =
		focusedCategory !== null
			? rules[focusedCategory]?.title ?? focusedCategory
			: null

	const sortedQuestions = focusByCategory(
		questionsSortedByCategory,
		focusedCategory
	)

	const unfoldedStep = useSelector(
		(state: AppState) => state.simulation?.unfoldedStep
	)
	const isMainSimulation = objectifs.length === 1 && isRootRule(objectifs[0])
	const currentQuestion: DottedName = !isMainSimulation
		? nextQuestions[0]
		: focusedCategory
		? sortedQuestions[0]
		: unfoldedStep || sortedQuestions[0]

	debugger

	const [finder, setFinder] = useState(false)
	const tutorials = useSelector((state: AppState) => state.tutorials)

	const tracking = useSelector((state: AppState) => state.tracking)
	const progress = useSimulationProgress()
	const isPersona = useSelector(isPersonaSelector)

	const enquête = useSelector(enquêteSelector)
	const navigate = useNavigate()

	useEffect(() => {
		// This hook lets the user click on the "next" button. Without it, the conversation
		// switches to the next question as soon as an answer is provided.
		// It introduces a state
		// It is important to test for "previousSimulation" : if it exists, it's not loaded yet.
		// Then currentQuestion could be the wrong one, already answered,
		// don't put it as the unfoldedStep
		if (
			currentQuestion &&
			!previousSimulation &&
			currentQuestion !== unfoldedStep
		) {
			// TODO: should be aware of the simulator used
			goToQuestionOrNavigate(
				currentQuestion,
				focusedCategory,
				// NOTE(@EmileRolley): Action card remaining questions are displayed inline, therefore,  we don't want
				// to trigger the [navigate] (or we must add url for action questions
				// which add not needed complexity for now).
				isFromActionCard ? { dispatch } : { navigate }
			)
		}
	}, [dispatch, currentQuestion, previousAnswers, unfoldedStep, objectifs])

	const currentQuestionId = utils.encodeRuleName(currentQuestion)

	useEffect(() => {
		// This hook enables to set the focus on the question span and not on the "Suivant" button when going to next question
		const questionElement =
			rules[currentQuestion] &&
			document.getElementById('id-question-' + currentQuestionId)
		questionElement?.focus()
	}, [currentQuestion])

	const goToPrevious = () => {
		goToQuestionOrNavigate(
			// NOTE(@EmileRolley): the fact that [prefiousQuestion] is not nullable
			// could be a reason of the 'previous button bug'?
			previousQuestion,
			focusedCategory,
			// NOTE(@EmileRolley): Action card remaining questions are displayed inline, therefore,  we don't want
			// to trigger the [navigate] (or we must add url for action questions
			// which add not needed complexity for now).
			isFromActionCard ? { dispatch } : { navigate }
		)
	}

	// Some questions are grouped in an artifical questions, called mosaic questions,
	// not present in publicodes.
	// Here we need to submit all of them when the one that triggered the UI
	// (we don't care which) is submitted, in order to see them in the response
	// list and to avoid repeating the same n times
	const ruleMosaicInfos = getRelatedMosaicInfosIfExists(rules, currentQuestion)
	const { mosaicRule, mosaicParams, mosaicDottedNames } =
		(currentQuestion && ruleMosaicInfos) || {}

	const isMosaic = mosaicRule && mosaicParams && mosaicDottedNames

	const questionText = isMosaic
		? mosaicRule.rawNode?.question
		: rules[currentQuestion]?.rawNode?.question

	const questionsToSubmit = isMosaic
		? mosaicDottedNames?.map(([dottedName]) => dottedName)
		: [currentQuestion]

	const isAnsweredMosaic =
		isMosaic &&
		currentQuestion &&
		questionsToSubmit
			?.map((question) => situation[question] != null)
			.some((bool) => bool === true)

	const currentQuestionIsAnswered = isAnsweredMosaic
		? true
		: situation[currentQuestion] != null

	const isMosaicSelection =
		isAnsweredMosaic && mosaicParams['type'] === 'selection'

	useEffect(() => {
		// This hook enables to set all the checkbox of a mosaic to false once one is checked
		if (isMosaicSelection) {
			questionsToSubmit?.map((question) =>
				dispatch(updateSituation(question, situation[question] || 'non'))
			)
		}
	}, [isAnsweredMosaic])

	useEffect(() => {
		// Pb: for selection mosaics, if the user select a card, the 'je ne sais pas' button disappear. However, if the user deselect the button, without this hook,
		// the default value is set back to the question value,
		// but the user doesn't know as there is no "je ne sais pas" button anymore and nothing
		// is selected
		// This hook enables to set 0 to mosaic question if the mosaic has been answered and
		// nothing is checked.
		const oneIsChecked = questionsToSubmit
			?.map((question) => situation[question] === 'oui')
			.some((bool) => bool === true)

		if (
			isMosaicSelection &&
			!oneIsChecked &&
			situation[mosaicRule.dottedName] !== 0
		) {
			dispatch(updateSituation(mosaicRule.dottedName, 0))
		}
		if (
			isMosaicSelection &&
			oneIsChecked &&
			situation[mosaicRule.dottedName] === 0
		) {
			dispatch(updateSituation(mosaicRule.dottedName, undefined))
		}
	}, [isAnsweredMosaic, questionsToSubmit, situation])

	console.log('unfoldedStep:', unfoldedStep)

	const currentQuestionIndex = previousAnswers.findIndex(
		(a) => a === unfoldedStep
	)
	const previousQuestion = getPreviousQuestion(
		currentQuestionIndex,
		previousAnswers,
		mosaicRule != undefined,
		questionsToSubmit
	)

	const isValidInput = (questionsToSubmit) => {
		// we want this validation function to work for mosaic questions
		// (we check that all the questions anwsers of a mosaic are valid)
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
		// This piece of code enables to set all the checkbox of a mosaic to
		// false when "Next" button is pressed (chen the question is submitted)
		// It's important in case of someone arrives at the mosaic question,
		// does not select anything and wants to submit "nothing".
		// we don't check question validation status in the same map
		// as the dispatch because we want all answers in mosaic question
		// to be valid before any dispatch
		if (isValidInput(questionsToSubmit)) {
			questionsToSubmit?.map((question) => {
				dispatch({
					type: 'STEP_ACTION',
					name: 'fold',
					step: question,
					source,
				})
			})
		}
	}
	const setDefault = () =>
		// TODO: Skiping a question shouldn't be equivalent to answering the
		// default value (for instance the question shouldn't appear in the
		// answered questions).
		//
		questionsToSubmit?.map((question) =>
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

	const noQuestionsLeft = !nextQuestions.length

	const endEventFired = tracking.endEventFired

	const questionCategory =
		orderByCategories &&
		orderByCategories.find(
			({ dottedName }) => dottedName === questionCategoryName(currentQuestion)
		)

	useEffect(() => {
		if (
			!tracking.firstQuestionEventFired &&
			previousAnswers.length >= 1 &&
			!isPersona
		) {
			trackEvent(matomoEventFirstAnswer)
			dispatch(setTrackingVariable('firstQuestionEventFired', true))
		}
	}, [
		dispatch,
		previousAnswers,
		trackEvent,
		tracking.firstQuestionEventFired,
		isPersona,
	])

	useEffect(() => {
		// This will help you judge if the "A terminé la simulation" event has good numbers
		if (!tracking.progress90EventFired && progress > 0.9 && !isPersona) {
			trackEvent(matomoEvent90PercentProgress)
			dispatch(setTrackingVariable('progress90EventFired', true))
		}

		if (!tracking.progress50EventFired && progress > 0.5 && !isPersona) {
			trackEvent(matomoEvent50PercentProgress)
			dispatch(setTrackingVariable('progress50EventFired', true))
		}
	}, [
		dispatch,
		progress,
		trackEvent,
		tracking.progress50EventFired,
		tracking.progress90EventFired,
		isPersona,
	])

	const bilan = engine
		? Math.round(
				parseFloat(
					(engine?.evaluate(MODEL_ROOT_RULE_NAME)?.nodeValue as string) || ''
				)
		  )
		: undefined

	useEffect(() => {
		if (!endEventFired && noQuestionsLeft && !isPersona) {
			// Cannot be sent several times, trackEvent filters duplicates
			trackEvent(getMatomoEventParcoursTestOver(bilan))
		}
	}, [noQuestionsLeft, bilan, trackEvent, endEventFired, isPersona])

	if (noQuestionsLeft) {
		return <SimulationEnding {...{ customEnd, customEndMessages }} />
	}

	if (noQuestionsLeft) {
		return <SimulationEnding {...{ customEnd, customEndMessages }} />
	}

	const isCategoryFirstQuestion =
		questionCategory &&
		previousAnswers.find(
			(a) => splitName(a)[0] === questionCategory.dottedName
		) === undefined

	const hasDescription =
		((mosaicRule &&
			(mosaicRule.description ||
				rules[mosaicRule.dottedName].rawNode.description)) ||
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
			{!enquête && (
				<Link to="/profil">
					<Trans>Modifier mes réponses</Trans>
				</Link>
			)}
			<div css="margin-top: 1rem">
				<Link to={pathname}>
					<button className="ui__ button plain small">Continuer le test</button>
				</Link>
			</div>
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
			<QuestionFinderWrapper {...{ finder, setFinder }} />
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
							id={'id-question-' + currentQuestionId}
							data-cypress-id={
								mosaicRule ? 'mosaic-question' : 'simple-question'
							}
						>
							{questionText}{' '}
						</span>
						{hasDescription && (
							<ExplicableRule
								dottedName={
									(mosaicRule && mosaicRule.dottedName) || currentQuestion
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
					{!enquête &&
						previousAnswers.length > 0 &&
						// We check that the question is not the first question
						currentQuestionIndex !== 0 &&
						// We check that previousQuestion found is in the rules (as the model evolves, the question found can be out of the new rules)
						rules[previousQuestion] && (
							<>
								<button
									onClick={goToPrevious}
									type="button"
									className="ui__ simple small push-left button"
									data-cypress-id="previous-question-button"
								>
									← <Trans>Précédent</Trans>
								</button>
							</>
						)}
					{currentQuestionIsAnswered ? (
						<button
							className="ui__ plain small button"
							data-cypress-id="next-question-button"
							onClick={() => {
								trackEvent(getMatomoEventClickNextQuestion(currentQuestion))
								submit('accept')
							}}
						>
							<span className="text">
								<Trans>Suivant</Trans> →
							</span>
						</button>
					) : (
						<button
							onClick={() => {
								trackEvent(getMatomoEventClickDontKnow(currentQuestion))
								setDefault()
							}}
							type="button"
							className="ui__ simple small push-right button"
							data-cypress-id="dont-know-button"
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
