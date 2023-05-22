import { goToQuestion, setSimulationConfig } from '@/actions/actions'
import { getRelatedMosaicInfosIfExists } from '@/components/conversation/RuleInput'
import {
	Category,
	DottedName,
	extractCategories,
	FullName,
	isMosaicChild,
	isRootRule,
	MODEL_ROOT_RULE_NAME,
	RulesNodes,
} from '@/components/publicodesUtils'
import { buildEndURL } from '@/components/SessionBar'
import Simulation from '@/components/Simulation'
import Title from '@/components/Title'
import { useEngine } from '@/components/utils/EngineContext'
import { Markdown } from '@/components/utils/markdown'
import Meta from '@/components/utils/Meta'
import { AppState } from '@/reducers/rootReducer'
import { motion } from 'framer-motion'
import { utils } from 'publicodes'
import { useEffect } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useNavigate } from 'react-router'
import { Link, useParams } from 'react-router-dom'
import BandeauContribuer from './BandeauContribuer'
import InlineCategoryChart from './chart/InlineCategoryChart'
import { enquêteSelector } from './enquête/enquêteSelector'
import { questionConfig } from './questionConfig'
import ScoreBar from './ScoreBar'

const equivalentTargetArrays = (array1, array2) =>
	array1.length === array2.length &&
	array1.every((value, index) => value === array2[index])

/*
 * Here the URL specs:

```
URL := /simulateur/<category>/<dotted-name>

<category> := 'bilan' // main simulator
            | 'transport'
            | 'alimentation'
            | 'logement'
            | 'service-sociétaux'
            | 'divers'

<dotted-name> := // dotted-name with ' . ' replaced by '/' and whitespaces by '-'
```

Examples:

* The URL corresponding to the question `logement . saisie habitants`
	of the main simulator is `/simulateur/bilan/logement/saisie-habitants`
* The URL corresponding to the question  `logement . électricité . consommation`
  of the sub-simulator `logement` is `/simulateur/logement/électricité/consommation`. Indeed, we only want to access to the sub rules corresponding to the category of the sub-simulator.
*/
const availableCategories = [
	'bilan',
	'transport',
	'alimentation',
	'logement',
	'services-sociétaux',
	'divers',
]

const Simulateur = () => {
	const dispatch = useDispatch()
	const urlParams = useParams()
	const path = urlParams['*']?.split('/')
	if (!path) {
		return <Navigate to={`/simulateur/${MODEL_ROOT_RULE_NAME}`} replace />
	}

	const category = path[0]
	const isMainSimulation = isRootRule(category)
	const selectedRuleNameURLPath = path.slice(1)

	if (!availableCategories.includes(category)) {
		console.log(
			`Unknown category ${category}, redirecting to /simulateur/bilan...`
		)
		return <Navigate to={`/simulateur/${MODEL_ROOT_RULE_NAME}`} replace />
	}

	const currentSimulation = useSelector((state: AppState) => state.simulation)
	const rules = useSelector((state: AppState) => state.rules)
	const engine = useEngine()
	const parsedRules = engine.getParsedRules()

	const { selectedRuleDottedName, selectedRuleURL } = getValidSelectedRuleInfos(
		utils.decodeRuleName(selectedRuleNameURLPath.join('/')),
		category,
		parsedRules
	)

	const categoryRule = rules[category]
	const evaluation = engine.evaluate(category)
	const config = {
		objectifs: [category],
		questions: questionConfig,
	}
	const configSet = currentSimulation?.config

	const categories: Category[] = isMainSimulation
		? extractCategories(rules, engine)
		: []

	useEffect(() => {
		if (!equivalentTargetArrays(config.objectifs, configSet?.objectifs ?? [])) {
			dispatch(setSimulationConfig(config, selectedRuleURL))
		}
	}, [config, selectedRuleURL, configSet])

	useEffect(() => {
		if (selectedRuleDottedName != undefined) {
			dispatch(goToQuestion(selectedRuleDottedName))
		}
	}, [selectedRuleDottedName])

	const tutorials = useSelector((state: AppState) => state.tutorials)

	const displayScoreExplanation =
		isMainSimulation && !tutorials.scoreExplanation

	const displayTutorial =
		isMainSimulation &&
		(!tutorials.testIntro ||
			// Case where we previously visited a specific rule URL and we come back
			// (the tutorial was skipped) to the simulator root URL,
			// we want to display the tutorial
			(!isSpecificRule(selectedRuleDottedName) && tutorials.fromRule == 'skip'))

	return (
		<div>
			<Meta
				title={evaluation.rawNode?.title}
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
						{evaluation.rawNode.title || (
							<FullName dottedName={evaluation.rawNode.dottedName} />
						)}
					</h1>
				)}
				{!displayTutorial ? (
					!displayScoreExplanation && (
						<Simulation
							conversationProps={{
								orderByCategories: categories,
								customEnd: isMainSimulation ? (
									<MainSimulationEnding {...{ rules, engine }} />
								) : categoryRule.description ? (
									<Markdown
										children={categoryRule.description}
										noRouter={false}
									/>
								) : (
									<EndingCongratulations />
								),
							}}
							explanations={<InlineCategoryChart givenEngine={undefined} />}
						/>
					)
				) : (
					<TutorialRedirection
						selectedRuleDottedName={selectedRuleDottedName}
						selectedRuleURL={selectedRuleURL}
					/>
				)}
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
	categoryName: string,
	rules: RulesNodes
): SelectedRuleInfos {
	const navigate = useNavigate()
	const isValidRule = (ruleName: DottedName) => {
		if (rules == undefined) {
			return false
		}
		const rule = rules[ruleName]
		const isAQuestion =
			rule != undefined && 'rawNode' in rule && 'question' in rule.rawNode
		const isAMosaicChild = rule != undefined && isMosaicChild(rules, ruleName)

		return isAQuestion && !isAMosaicChild
	}

	if (selectedRuleName != '' && !isValidRule(selectedRuleName)) {
		while (selectedRuleName != '' && !isValidRule(selectedRuleName)) {
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
			const encodedParentRuleName = utils.encodeRuleName(selectedRuleName)
			console.log(
				`Found parent rule for ${selectedRuleName}, redirecting to /simulateur/${categoryName}/${encodedParentRuleName}...`
			)
			navigate(`/simulateur/${categoryName}/${encodedParentRuleName}`, {
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
		selectedRuleURL: `/simulateur/${categoryName}/${utils.encodeRuleName(
			selectedRuleName
		)}`,
	}
}

function isSpecificRule(selectedRuleName: DottedName) {
	return selectedRuleName != ''
}

const TutorialRedirection = ({ selectedRuleDottedName, selectedRuleURL }) => {
	const searchParams = new URLSearchParams({
		fromRuleURL: selectedRuleURL,
	})
	return (
		<Navigate
			to={`/tutoriel${
				isSpecificRule(selectedRuleDottedName) ? `?${searchParams}` : ''
			}`}
			replace
		/>
	)
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
