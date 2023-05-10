import { utils as coreUtils } from 'publicodes'
import { capitalise0, sortBy } from '../utils'

export const MODEL_ROOT_RULE_NAME = 'bilan'

export const parentName = (
	dottedName,
	outputSeparator = ' . ',
	shift = 0,
	degree = 1
) => splitName(dottedName).slice(shift, -degree).join(outputSeparator)

export const splitName = (dottedName) => dottedName?.split(' . ')

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

export const title = (rule) =>
	rule.titre ||
	capitalise0(splitName(rule.dottedName)[splitName(rule.dottedName).length - 1])
// Publicodes's % unit is strangely handlded
// the nodeValue is * 100 to account for the unit
// hence we divide it by 100 and drop the unit
export const correctValue = (evaluated) => {
	const { nodeValue, unit } = evaluated

	const result = unit?.numerators.includes('%') ? nodeValue / 100 : nodeValue
	return result
}

const ruleSumNode = (rules, rule) => {
	const formula = rule.rawNode.formule

	return formula.somme?.map((name) =>
		coreUtils.disambiguateReference(rules, rule.dottedName, name)
	)
}

export const extractCategoriesNamespaces = (
	rules,
	engine,
	parentRule = MODEL_ROOT_RULE_NAME
) => {
	const rule = engine.getRule(parentRule),
		sumNodes = ruleSumNode(engine.getParsedRules(), rule)

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

export const minimalCategoryData = (categories) =>
	Object.fromEntries(
		categories.map(({ dottedName, nodeValue }) => [
			dottedName,
			Math.round(nodeValue),
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

export const extractCategories = (
	rules,
	engine,
	valuesFromURL,
	parentRule = MODEL_ROOT_RULE_NAME,
	sort = true
) => {
	const rule = engine.getRule(parentRule),
		sumNodes = ruleSumNode(engine.getParsedRules(), rule)

	if (sumNodes === undefined) {
		return []
	}

	const categories = sumNodes.map((dottedName) => {
		const node = engine.evaluate(dottedName)
		const { icônes, couleur, abréviation } = rules[dottedName]
		const split = splitName(dottedName),
			parent = split.length > 1 && split[0]
		return {
			...node,
			icons: icônes || rules[parent].icônes,
			color:
				categoryColorOverride[dottedName] ||
				categoryColorOverride[parent] ||
				couleur ||
				rules[parent].couleur,
			nodeValue: valuesFromURL ? valuesFromURL[dottedName[0]] : node.nodeValue,
			dottedName:
				(parentRule === MODEL_ROOT_RULE_NAME && parent) || node.dottedName,
			documentationDottedName: node.dottedName,
			title:
				parentRule === MODEL_ROOT_RULE_NAME && parent
					? rules[parent].titre
					: node.title,
			abbreviation: abréviation,
		}
	})

	return sort ? sortCategories(categories) : categories
}

export const getSubcategories = (rules, category, engine, sort) => {
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
						el.nodeValue / engine.evaluate('logement . habitants').nodeValue,
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
