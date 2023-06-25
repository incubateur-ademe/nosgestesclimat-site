import { goToQuestion, setSimulationConfig } from '@/actions/actions'
import { getMosaicParentRuleName } from '@/components/conversation/conversationUtils'
import {
	Category,
	decodeRuleNameFromSearchParam,
	DottedName,
	encodeRuleNameToSearchParam,
	extractCategories,
	FullName,
	getRelatedMosaicInfosIfExists,
	isRootRule,
	isValidQuestion,
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
import { SavedSimulation } from '@/selectors/storageSelectors'
import BandeauContribuer from '@/sites/publicodes/BandeauContribuer'
import InlineCategoryChart from '@/sites/publicodes/chart/InlineCategoryChart'
import { enquêteSelector } from '@/sites/publicodes/enquête/enquêteSelector'
import { questionConfig } from '@/sites/publicodes/questionConfig'
import ScoreBar from '@/sites/publicodes/ScoreBar'
import { getQuestionURLSearchParams } from '@/sites/publicodes/utils'
import { Group, ResultsObject } from '@/types/groups'
import { fetchUpdateGroupMember } from '@/utils/fetchUpdateGroupMember'
import { getSimulationResults } from '@/utils/getSimulationResults'
import { motion } from 'framer-motion'
import { utils } from 'publicodes'
import { useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { NavigateFunction, useNavigate } from 'react-router'
import { Link, Navigate, useParams } from 'react-router-dom'

export const respirationParamName = 'thématique'

function isEquivalentTargetArrays<T>(array1: T[], array2: T[]): boolean {
	return (
		array1.length === array2.length &&
		array1.every((value, index) => value === array2[index])
	)
}

const Simulateur = () => {
	const urlParams = useParams()
	const simulatorRootNameURL = urlParams['*']
	const rules = useSelector((state: AppState) => state.rules)
	const ruleNames: DottedName[] = Object.keys(rules)

	if (simulatorRootNameURL === undefined) {
		return (
			<Navigate to={`/simulateur/${MODEL_ROOT_RULE_NAME}`} replace={true} />
		)
	}

	const simulatorRootRuleName = utils.decodeRuleName(simulatorRootNameURL)

	if (!ruleNames.includes(simulatorRootRuleName)) {
		console.log(
			`Unknown rule ${simulatorRootRuleName}, redirecting to /simulateur/${MODEL_ROOT_RULE_NAME}...`
		)
		return (
			<Navigate to={`/simulateur/${MODEL_ROOT_RULE_NAME}`} replace={true} />
		)
	}

	return (
		<SimulateurCore
			simulatorRootNameURL={simulatorRootNameURL}
			simulatorRootRuleName={simulatorRootRuleName}
		/>
	)
}

const SimulateurCore = ({ simulatorRootNameURL, simulatorRootRuleName }) => {
	const navigate = useNavigate()
	const dispatch = useDispatch()

	// Sets the user id in the store if not already set
	useSetUserId()

	const { t } = useTranslation()
	const searchParams = new URLSearchParams(window.location.search)

	const rules = useSelector((state: AppState) => state.rules)
	const engine = useEngine()

	// The main simulation corresponds to the whole test, i.e selected rule is the
	// model root rule.
	const isMainSimulation = isRootRule(simulatorRootNameURL)
	const selectedRuleNameURLPath = searchParams.get('question') ?? ''

	const parsedRules = engine.getParsedRules() as NGCRulesNodes

	const noCongratsURL = searchParams.get(respirationParamName) !== 'congrats'

	const { selectedRuleDottedName, selectedRuleURL } =
		// FIXME(@EmileRolley): we need to differenciate the question search params
		// set in Conversation when the last question is answered from the one
		// specified by the user in the URL to redirect only if the test is
		// completed. For now, the redirection is deactivated.
		/* isTestCompleted && noCongratsURL */
		false
			? getValidSelectedRuleInfos(
					decodeRuleNameFromSearchParam(selectedRuleNameURLPath),
					simulatorRootNameURL,
					parsedRules,
					navigate
			  )
			: { selectedRuleDottedName: undefined, selectedRuleURL: undefined }

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

	const displayTutorial = isMainSimulation && !tutorials.testIntro

	if (displayTutorial) {
		navigate(`/tutoriel`, { replace: true })
		return null
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
							<Markdown noRouter={false}>{simulatorRule.description}</Markdown>
						) : (
							<EndingCongratulations />
						),
					}}
					explanations={<InlineCategoryChart />}
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
 * NOTE(@EmileRolley): this function is unsused for now, but could be used if we
 * decide to redirect to specific question when the test is completed according
 * to the 'question' search param. If not, we could remove it.
 *
 * A rule is valid if it exists, is a question and is not a mosaic child.
 *
 * However, if the rule is a mosaic question the returned [selectedRuleDottedName] will
 * be its first mosaic child rule while the [selectedRuleURL] will be the one
 * corresponding to the mosaic question rule.
 */
function getValidSelectedRuleInfos(
	selectedRuleName: DottedName,
	simulatorRootRuleNameURL: string,
	rules: NGCRulesNodes,
	navigate: NavigateFunction
): SelectedRuleInfos {
	const searchParams = new URLSearchParams(window.location.search)

	if (selectedRuleName != '' && !isValidQuestion(selectedRuleName, rules)) {
		selectedRuleName = getMosaicParentRuleName(rules, selectedRuleName)

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

	const groupToRedirectTo: Group = useSelector(
		(state: RootState) => state.groupToRedirectTo
	)

	const simulationList = useSelector((state: AppState) => state.simulations)

	const currentSimulationId = useSelector(
		(state: AppState) => state.currentSimulationId
	)

	const currentSimulation = simulationList.find(
		(simulation) => simulation.id === currentSimulationId
	)

	const userId = useSelector((state: AppState) => state.userId)

	const handleUpdateGroup = async () => {
		const results: ResultsObject = getSimulationResults({
			simulation: currentSimulation,
			engine,
		})

		try {
			await fetchUpdateGroupMember({
				group: groupToRedirectTo,
				userId: userId ?? '',
				simulation: currentSimulation as SavedSimulation,
				results,
			})
		} catch (e) {
			console.log(e)
		}
	}

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
			<img src="/images/glowing-ngc-star.svg" width="100" height="100" alt="" />
			<p>
				<Trans>Vous avez terminé le test 👏</Trans>
			</p>
			<Link
				to={
					groupToRedirectTo
						? `/groupe/${groupToRedirectTo._id}`
						: buildEndURL(rules, engine) ?? ''
				}
				className="ui__ button cta plain"
				data-cypress-id="see-results-link"
				onClick={groupToRedirectTo ? handleUpdateGroup : undefined}
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
