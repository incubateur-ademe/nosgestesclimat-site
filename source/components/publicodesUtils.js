import { sortBy } from 'ramda'
import { capitalise0 } from '../utils'

export const parentName = (dottedName, outputSeparator = ' . ', shift = 0) =>
	splitName(dottedName).slice(shift, -1).join(outputSeparator)

export const splitName = (dottedName) => dottedName.split(' . ')

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

export const ruleFormula = (rule) =>
	rule?.explanation?.valeur?.explanation?.valeur

export const ruleSumNode = (rule) => {
	const formula = ruleFormula(rule)

	if (formula.nodeKind !== 'somme') return null
	return formula.explanation.map((node) => node.dottedName)
}

export const extractCategoriesNamespaces = (
	rules,
	engine,
	parentRule = 'bilan'
) => {
	const rule = engine.getRule(parentRule),
		sumNodes = ruleSumNode(rule)

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
	parentRule = 'bilan',
	sort = true
) => {
	const rule = engine.getRule(parentRule),
		sumNodes = ruleSumNode(rule)

	const categories = sumNodes.map((dottedName) => {
		const node = engine.evaluate(dottedName)
		const { icônes, couleur } = rules[dottedName]
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
			dottedName: (parentRule === 'bilan' && parent) || node.dottedName,
			documentationDottedName: node.dottedName,
			title:
				parentRule === 'bilan' && parent ? rules[parent].titre : node.title,
		}
	})

	return sort ? sortCategories(categories) : categories
}

export const getSubcategories = (rules, category, engine) => {
	const rule = engine.getRule(category.name),
		formula = ruleFormula(rule)

	if (!formula) return [category]

	const sumToDisplay =
		formula.nodeKind === 'somme'
			? category.name
			: formula.operationKind === '/'
			? formula.explanation[0].dottedName
			: null

	console.log('sum', sumToDisplay)
	if (!sumToDisplay) return [category]

	const subCategories = extractCategories(
		rules,
		engine,
		null,
		sumToDisplay,
		false
	)
	category.name.includes('logement') &&
		console.log('LOG', subCategories, formula.explanation[1])

	return formula.operationKind === '/'
		? subCategories.map((el) => ({
				...el,
				nodeValue:
					el.nodeValue /
					engine.evaluate(formula.explanation[1].dottedName).nodeValue,
		  }))
		: subCategories
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

export const questionCategoryName = (dottedName) => splitName(dottedName)[0]
