import { goToQuestion, setSimulationConfig } from '@/actions/actions'
import {
	Category,
	decodeRuleNameFromSearchParam,
	DottedName,
	encodeRuleNameToSearchParam,
	extractCategories,
	FullName,
	getRelatedMosaicInfosIfExists,
	isRootRule,
	isValidRule,
	MODEL_ROOT_RULE_NAME,
	NGCRulesNodes,
} from '@/components/publicodesUtils'
import { buildEndURL } from '@/components/SessionBar'
import Simulation from '@/components/Simulation'
import Title from '@/components/Title'
import { useEngine } from '@/components/utils/EngineContext'
import { Markdown } from '@/components/utils/markdown'
import Meta from '@/components/utils/Meta'
import { useSetUserId } from '@/hooks/useSetUserId'
import {
	AppState,
	objectifsConfigToDottedNameArray,
} from '@/reducers/rootReducer'
import { motion } from 'framer-motion'
import { utils } from 'publicodes'
import { useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router'
import { Link, useParams } from 'react-router-dom'
import BandeauContribuer from './BandeauContribuer'
import InlineCategoryChart from './chart/InlineCategoryChart'
import { enquêteSelector } from './enquête/enquêteSelector'
import { questionConfig } from './questionConfig'
import ScoreBar from './ScoreBar'
import { getQuestionURLSearchParams } from './utils'

function isEquivalentTargetArrays<T>(array1: T[], array2: T[]): boolean {
	return (
		array1.length === array2.length &&
		array1.every((value, index) => value === array2[index])
	)
}

/*
 * Here the URL specs:
 * TODO: document this
 */

const Simulateur = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const urlParams = useParams()
	const searchParams = new URLSearchParams(window.location.search)

	// Sets the user id in the store if not already set
	useSetUserId()

	const simulatorRootNameURL = urlParams['*']
	const { t } = useTranslation()

	if (!simulatorRootNameURL) {
		return <Navigate to={`/simulateur/${MODEL_ROOT_RULE_NAME}`} replace />
	}

	// The main simulation corresponds to the whole test, i.e selected rule is the
	// model root rule.
	const isMainSimulation = isRootRule(simulatorRootNameURL)
	const selectedRuleNameURLPath = searchParams.get('question') ?? ''
	const rules = useSelector((state: AppState) => state.rules)
	const ruleNames: DottedName[] = Object.keys(rules)
	const simulatorRootRuleName = utils.decodeRuleName(simulatorRootNameURL)

	if (!ruleNames.includes(simulatorRootRuleName)) {
		console.log(
			`Unknown rule ${simulatorRootNameURL}, redirecting to /simulateur/${MODEL_ROOT_RULE_NAME}...`
		)
		return <Navigate to={`/simulateur/${MODEL_ROOT_RULE_NAME}`} replace />
	}

	const engine = useEngine()
	const parsedRules = engine.getParsedRules() as NGCRulesNodes
	console.log('parsedRules', parsedRules)
	const { selectedRuleDottedName, selectedRuleURL } = getValidSelectedRuleInfos(
		decodeRuleNameFromSearchParam(selectedRuleNameURLPath),
		simulatorRootNameURL,
		parsedRules
	)

	const simulatorRule = rules[simulatorRootRuleName]
	const evaluation = engine.evaluate(simulatorRootRuleName)
	const config = {
		objectifs: [simulatorRootRuleName],
		questions: questionConfig,
	}
	const configSet = useSelector((state: AppState) => state.simulation?.config)

	const categories: Category[] = isMainSimulation
		? extractCategories(rules, engine)
		: []

	useEffect(() => {
		if (
			!isEquivalentTargetArrays(
				config.objectifs,
				objectifsConfigToDottedNameArray(configSet?.objectifs ?? [])
			)
		) {
			dispatch(setSimulationConfig(config, selectedRuleURL))
		}
	}, [dispatch, config, selectedRuleURL, configSet])

	useEffect(() => {
		if (selectedRuleDottedName != undefined) {
			dispatch(goToQuestion(selectedRuleDottedName))
		}
	}, [dispatch, selectedRuleDottedName])

	const tutorials = useSelector((state: AppState) => state.tutorials)

	if (!configSet) {
		return null
	}

	const displayScoreExplanation =
		isMainSimulation && !tutorials.scoreExplanation

	const displayTutorial =
		isMainSimulation &&
		(!tutorials.testIntro ||
			// Case where we previously visited a specific rule URL and we come back
			// (the tutorial was skipped) to the simulator root URL,
			// we want to display the tutorial
			(!isSpecificRule(selectedRuleDottedName) && tutorials.fromRule == 'skip'))

	if (displayTutorial) {
		if (
			selectedRuleURL != undefined &&
			selectedRuleDottedName != undefined &&
			isSpecificRule(selectedRuleDottedName)
		) {
			const searchParams = new URLSearchParams({
				fromRuleURL: selectedRuleURL,
			})
			return navigate(`/tutoriel?${searchParams}`, { replace: true })
		}
		return navigate(`/tutoriel`, { replace: true })
	}

	return (
		<div>
			<Meta
				title={
					evaluation.rawNode?.title ||
					t('Votre bilan climat personnel - Résultats')
				}
				description={evaluation.rawNode?.description}
			/>
			<Title>
				<Trans>Le test</Trans>
			</Title>
			<div>
				{!displayTutorial && (
					<motion.div
						initial={
							!displayScoreExplanation ? false : { opacity: 0, scale: 0.8 }
						}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5 }}
					>
						<ScoreBar />
					</motion.div>
				)}
				{!isMainSimulation && (
					<h1>
						{
							// FIXME(@EmileRolley): expected to be rawNode.title, why?
							evaluation.title ?? (
								<FullName dottedName={evaluation.rawNode.dottedName} />
							)
						}
					</h1>
				)}
				<Simulation
					conversationProps={{
						orderByCategories: categories,
						customEnd: isMainSimulation ? (
							<MainSimulationEnding {...{ rules, engine }} />
						) : simulatorRule.description ? (
							<Markdown children={simulatorRule.description} noRouter={false} />
						) : (
							<EndingCongratulations />
						),
					}}
					explanations={<InlineCategoryChart givenEngine={undefined} />}
				/>
			</div>
			<BandeauContribuer />
		</div>
	)
}

type SelectedRuleInfos = {
	selectedRuleDottedName?: DottedName
	selectedRuleURL?: string
}

/**
 * A rule is valid if it exists, is a question and is not a mosaic child.
 *
 * However, if the rule is a mosaic question the returned [selectedRuleDottedName] will
 * be its first mosaic child rule while the [selectedRuleURL] will be the one
 * corresponding to the mosaic question rule.
 */
function getValidSelectedRuleInfos(
	selectedRuleName: DottedName,
	simulatorRootRuleNameURL: string,
	rules: NGCRulesNodes
): SelectedRuleInfos {
	const navigate = useNavigate()
	const searchParams = new URLSearchParams(window.location.search)

	if (selectedRuleName != '' && !isValidRule(selectedRuleName, rules)) {
		while (selectedRuleName != '' && !isValidRule(selectedRuleName, rules)) {
			const parentRuleName = utils.ruleParent(selectedRuleName)
			console.log(
				`Unknown question ${selectedRuleName}, trying ${parentRuleName}...`
			)
			selectedRuleName = parentRuleName
		}

		if (selectedRuleName == '') {
			console.log(
				`Cannot find parent rule for ${selectedRuleName}, redirecting to /simulateur/${MODEL_ROOT_RULE_NAME}...`
			)
			selectedRuleName = MODEL_ROOT_RULE_NAME
			navigate(`/simulateur/${MODEL_ROOT_RULE_NAME}`, {
				replace: true,
			})
		} else {
			const encodedParentRuleName =
				encodeRuleNameToSearchParam(selectedRuleName)
			console.log(
				`Found parent rule for ${selectedRuleName}, redirecting to /simulateur/${simulatorRootRuleNameURL}/${encodedParentRuleName}...`
			)
			searchParams.set('question', encodedParentRuleName ?? '')
			navigate(`/simulateur/${simulatorRootRuleNameURL}?${searchParams}`, {
				replace: true,
			})
		}
	}

	const { mosaicRule, mosaicDottedNames } =
		getRelatedMosaicInfosIfExists(rules, selectedRuleName) ?? {}

	const isMosaic =
		mosaicRule && mosaicDottedNames && mosaicRule.dottedName == selectedRuleName

	return {
		selectedRuleDottedName: isMosaic
			? mosaicDottedNames[0][1].dottedName
			: selectedRuleName,
		selectedRuleURL: `/simulateur/${simulatorRootRuleNameURL}?${getQuestionURLSearchParams(
			selectedRuleName
		)}`,
	}
}

function isSpecificRule(selectedRuleName: DottedName | undefined) {
	return selectedRuleName !== undefined && selectedRuleName !== ''
}

const MainSimulationEnding = ({ rules, engine }) => {
	const enquête = useSelector(enquêteSelector)
	// Necessary to call 'buildEndURL' with the latest situation

	return (
		<div
			css={`
				img {
					width: 8rem;
					height: auto;
				}
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				padding: 1rem;
			`}
		>
			<img
				src="/images/glowing-ngc-star.svg"
				width="100"
				height="100"
				aria-hidden="true"
			/>
			<p>
				<Trans>Vous avez terminé le test 👏</Trans>
			</p>
			<Link
				to={buildEndURL(rules, engine) ?? ''}
				className="ui__ button cta plain"
				data-cypress-id="see-results-link"
			>
				<Trans>Voir mon résultat</Trans>
			</Link>
			{!enquête && (
				<>
					<Trans>ou</Trans>
					<Link to="/profil" css="">
						<Trans>Modifier mes réponses</Trans>
					</Link>
				</>
			)}
		</div>
	)
}

export default Simulateur

const EndingCongratulations = () => (
	<h3>
		<Trans>🌟 Vous avez complété cette simulation</Trans>
	</h3>
)
