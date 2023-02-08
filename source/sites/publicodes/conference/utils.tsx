import adjectifs from './adjectifs.json'
import geologicalPeriods from './périodesGéologiques.json'
// Merci https://github.com/akaAgar/vocabulaire-francais
import fruits from './fruits.json'
import verbs from './participePassés.json'
const periodsCount = geologicalPeriods.length
const adjectifsCount = adjectifs.length
const verbsCount = verbs.length

export const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max))

export const stringToColour = function (str) {
	var hash = 0
	for (var i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash)
	}
	var colour = '#'
	for (var i = 0; i < 3; i++) {
		var value = (hash >> (i * 8)) & 0xff
		colour += ('00' + value.toString(16)).substr(-2)
	}
	return colour
}

export const generateFruitName = () => {
	const fruit = fruits[getRandomInt(fruits.length)]
	const isFeminine = fruit.endsWith('e') // sommaire, mais ça fonctionne plutôt bien vu notre gamme de fruits
	return (
		fruit +
		' ' +
		adjectifs[getRandomInt(adjectifsCount)].toLowerCase() +
		(isFeminine ? 'e' : '')
	)
}

export const generateRoomName = () => {
	console.log(
		'Suggestion de nom de conférence unique à 1/' +
			periodsCount * adjectifsCount * verbsCount
	)

	return [
		geologicalPeriods[getRandomInt(periodsCount)],
		adjectifs[getRandomInt(adjectifsCount)],
		verbs[getRandomInt(verbsCount)],
	]
		.join('-')
		.toLowerCase()
}

export const defaultThreshold = 100 * 1000

export const filterExtremes = (elements, threshold) =>
	Object.fromEntries(
		Object.entries(elements).filter(([_, { total }]) => total < threshold)
	)

export const getExtremes = (elements, threshold) =>
	Object.entries(elements).filter(([_, { total }]) => total >= threshold)

// Simulations with less than a given progress are excluded, in order to avoid a perturbation of the mean group value by people
// that did connect to the conference, but did not seriously start the test, hence resulting in multiple default value simulations.
// In case of survey with context, we only display result with context filled in.

export const defaultProgressMin = 0.9
// Why 90% ? Because then the test is quite representative with very few default values,
// and by setting 100% we risk missing some people that unfolded their last question and didn't fold them again

export const getElements = (
	rawElements,
	threshold,
	existContext,
	progressMin
) => {
	const elementsWithinThreshold = rawElements.filter(
		(el) => el.total > 0 && el.total < threshold && el.progress >= progressMin
	)
	const elements = existContext
		? elementsWithinThreshold.filter(
				(el) => Object.keys(el.context).length !== 0
		  )
		: elementsWithinThreshold

	return elements
}
