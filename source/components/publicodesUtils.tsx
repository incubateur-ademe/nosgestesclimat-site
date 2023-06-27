import Engine, {
	ASTNode,
	EvaluatedNode,
	RuleNode,
	utils as coreUtils,
} from 'publicodes'
import { capitalise0, sortBy } from '../utils'

export type DottedName = string

export type Category = EvaluatedNode & {
	dottedName: DottedName
	title: string
	name: string
	rawNode: RuleNode
	documentationDottedName: DottedName
	icons?: string[]
	color?: string
	abbreviation: string
}

export type SuggestionsNode = Record<string, ASTNode>

export type MosaiqueNode = {
	type: string
	clé: string
	total?: number
	suggestions?: SuggestionsNode
}

export type MosaicInfos = {
	mosaicRule: RuleNode
	mosaicParams: MosaiqueNode
	mosaicDottedNames: [string, NGCRuleNode][]
}

/**
 * NOTE(@EmileRolley): prefixing with NGC to avoid conflicts with publicodes,
 * and to make it clear that this is a specific type for the NGC model.
 */
export type NGCRuleNode = RuleNode & {
	dottedName: DottedName
	mosaique?: MosaiqueNode
}

export type NGCRulesNodes = Record<string, NGCRuleNode>

/** It's the name of the node at the root of the model. */
export const MODEL_ROOT_RULE_NAME = 'bilan'

export function isRootRule(dottedName: DottedName): boolean {
	return dottedName === MODEL_ROOT_RULE_NAME
}

/**
 * Function to detect if the question evaluated should be displayed as a child of a mosaic.
 *
 * We only test parent of degree 2 and not all the parents of each rules:
 * this requires to be careful on model side.
 * If parent of degree 2 doesn't contain mosaic, returns empty array.
 * If parent of degree 2 contains mosaic but rule is a child not included in the mosaic,
 * returns undefined.
 *
 * We take into account if the evaluated rule is already a mosaic.
 */
export function getRelatedMosaicInfosIfExists(
	rules: NGCRulesNodes,
	dottedName: DottedName | null
): MosaicInfos | undefined {
	if (!dottedName) {
		return undefined
	}

	const potentialMosaicRule = rules[dottedName].rawNode['mosaique']
		? dottedName
		: parentName(dottedName, ' . ', 0, 2)

	const mosaicParams =
		potentialMosaicRule && rules[potentialMosaicRule].rawNode['mosaique']

	if (
		!mosaicParams ||
		(dottedName !== potentialMosaicRule &&
			!dottedName.includes(` . ${mosaicParams['clé']}`))
	) {
		return undefined
	}

	const mosaicDottedNames = Object.entries(rules).filter(([rule]) => {
		return (
			rule.includes(potentialMosaicRule) &&
			rule.includes(` . ${mosaicParams['clé']}`)
		)
	})

	return {
		mosaicRule: rules[potentialMosaicRule],
		mosaicParams,
		mosaicDottedNames,
	}
}

export function isMosaicChild(
	rules: NGCRulesNodes,
	dottedName: DottedName
): boolean {
	const { mosaicRule, mosaicDottedNames } =
		getRelatedMosaicInfosIfExists(rules, dottedName) ?? {}

	if (!mosaicRule || !mosaicDottedNames) {
		return false
	}

	return (
		mosaicRule.dottedName !== dottedName &&
		mosaicDottedNames.some(
			([mosaicChildName]) => dottedName === mosaicChildName
		)
	)
}

export const parentName = (
	dottedName: DottedName,
	outputSeparator = ' . ',
	shift = 0,
	degree = 1
) => splitName(dottedName).slice(shift, -degree).join(outputSeparator)

export const splitName = (dottedName: DottedName) => dottedName?.split(' . ')

export const FullName = ({ dottedName }) => (
	<span>
		{splitName(dottedName).map((fragment, index) => (
			<span>
				{index > 0 && ' · '}
				{capitalise0(fragment)}
			</span>
		))}
	</span>
)

export const getTitle = (rule) =>
	rule.title ||
	capitalise0(splitName(rule.dottedName)[splitName(rule.dottedName).length - 1])

// Publicodes's % unit is strangely handlded
// the nodeValue is * 100 to account for the unit
// hence we divide it by 100 and drop the unit
export function correctValue(evaluated: EvaluatedNode): number | undefined {
	const { nodeValue, unit } = evaluated

	if (nodeValue == undefined || typeof nodeValue !== 'number') {
		return undefined
	}

	const result = unit?.numerators.includes('%') ? nodeValue / 100 : nodeValue
	return result
}

function ruleSumNode(
	rules: NGCRulesNodes,
	rule: NGCRuleNode
): string[] | undefined {
	const formula = rule.rawNode.formule

	if (!formula || !formula['somme']) {
		return undefined
	}

	return formula['somme'].map((name: string) =>
		coreUtils.disambiguateReference(rules, rule.dottedName, name)
	)
}

export const extractCategoriesNamespaces = (
	rules: { [key: string]: { icônes: any; couleur: any } },
	engine: Engine,
	parentRule = MODEL_ROOT_RULE_NAME
) => {
	const rule = engine.getRule(parentRule)
	const sumNodes = ruleSumNode(engine.getParsedRules(), rule)

	if (sumNodes == undefined) {
		// NOTE(@EmileRolley): needed to handle custom 'services sociétaux' rule that is not a sum
		// in international models.
		return []
	}

	const categories = sumNodes.map((dottedName) => {
		const categoryName = splitName(dottedName)[0]
		const node = engine.getRule(categoryName)

		const { icônes, couleur } = rules[categoryName]
		return {
			...node,
			icons: icônes,
			color: categoryColorOverride[dottedName] || couleur,
		}
	})

	return categories
}

export const minimalCategoryData = (categories: Category[]) =>
	Object.fromEntries(
		categories.map(({ dottedName, nodeValue }) => [
			dottedName,
			Math.round(nodeValue as number),
		])
	)

// This is for accessibility purposes : we need to try and test, easier to be done here than in the (necessary) colors in the data files
// this kind of tool can help https://accessiblepalette.com/?lightness=98.2,93.9,85,76.2,67.4,57.8,48,40.2,31.8,24.9&fe6f5c=0,0&f8d147=0,-10&56d25b=0,0&0088cb=0,0&B534AD=1,15&808080=0,0&69788f=0,0
const categoryColorOverride = {
	// alimentation: '#358138',
	// transport: '#BA5143',
	// logement: '#007DA3',
	// divers: '#1966F5',
	// 'services publics': '#424C5A',
	// numérique: '#B534AD',
}

export function extractCategories(
	rules: any,
	engine: Engine,
	valuesFromURL?: any,
	parentRule = MODEL_ROOT_RULE_NAME,
	sort = true
): Category[] {
	const rule = engine.getRule(parentRule),
		sumNodes = ruleSumNode(engine.getParsedRules(), rule)

	if (sumNodes === undefined) {
		return []
	}

	const categories = sumNodes.map((dottedName) => {
		const node = engine.evaluate(dottedName) as Category
		const { icônes, couleur, abréviation } = rules[dottedName]
		const split = splitName(dottedName),
			parent = split.length > 1 ? split[0] : ''
		return {
			...node,
			icons: icônes || rules[parent].icônes,
			color:
				categoryColorOverride[dottedName] ||
				categoryColorOverride[parent] ||
				couleur ||
				rules[parent].couleur,
			nodeValue: valuesFromURL ? valuesFromURL[dottedName[0]] : node.nodeValue,
			dottedName: (isRootRule(parentRule) && parent) || node.dottedName,
			documentationDottedName: node.dottedName,
			title:
				isRootRule(parentRule) && parent ? rules[parent].titre : node.title,
			abbreviation: abréviation,
		}
	})

	return sort ? sortCategories(categories) : categories
}

export function getSubcategories(
	rules: any,
	category: Category,
	engine: Engine,
	sort: boolean
): Category[] {
	const sumToDisplay =
		category.name === 'logement' ? 'logement . impact' : category.name

	if (!sumToDisplay) return [category]

	const subCategories = extractCategories(
		rules,
		engine,
		null,
		sumToDisplay,
		false
	)

	const items =
		category.name === 'logement'
			? subCategories.map((el) => ({
					...el,
					nodeValue:
						typeof el.nodeValue === 'number'
							? el.nodeValue /
							  (engine.evaluate('logement . habitants').nodeValue as number)
							: el.nodeValue,
			  }))
			: subCategories

	return sort ? sortCategories(items) : items
}

export const sortCategories = sortBy(({ nodeValue }) => -nodeValue)

export const safeGetRule = (engine, dottedName) => {
	try {
		const rule = engine.evaluate(engine.getRule(dottedName))
		return rule
	} catch (e) {
		console.log(e)
	}
}

export const questionCategoryName = (dottedName) => splitName(dottedName)?.[0]

export function relegate(keys, array) {
	const categories = keys.reduce((memo, key) => {
		const isKey = (a) => a.dottedName === key
		const arrayWithoutKey = memo.filter((a) => !isKey(a))
		if (arrayWithoutKey.length === array.length)
			throw Error('Make sure the key you want to relegate is in array')
		return [...arrayWithoutKey, memo.find(isKey)]
	}, array)
	return categories
}

export function relegateCommonCategories(array) {
	const keys = ['services sociétaux']
	return relegate(keys, array)
}

/** Like publicodes's encodeRuleName function but use '.' instead of '/' */
export function encodeRuleNameToSearchParam(
	dottedName: DottedName | null
): string | undefined {
	return dottedName != undefined
		? coreUtils.encodeRuleName(dottedName).replaceAll('/', '.')
		: undefined
}

export function decodeRuleNameFromSearchParam(encodedName: string): DottedName {
	return coreUtils.decodeRuleName(encodedName.replaceAll('.', '/'))
}

export function isValidRule(ruleName: DottedName, rules: NGCRulesNodes) {
	if (rules == undefined) {
		return false
	}
	const rule = rules[ruleName]
	const isQuestion =
		rule != undefined && 'rawNode' in rule && 'question' in rule.rawNode

	return isQuestion && !isMosaicChild(rules, ruleName)
}
