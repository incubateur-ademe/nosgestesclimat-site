import Fuse from 'fuse.js'

let searchWeights = [
	{
		name: 'espace',
		weight: 0.2,
	},
	{
		name: 'title',
		weight: 0.2,
	},
	{
		name: 'question',
		weight: 0.4,
	},
	{
		name: 'question',
		weight: 0.2,
	},
]

let fuse = null
onmessage = function (event) {
	if (event.data.rules)
		fuse = new Fuse(event.data.rules, {
			keys: searchWeights,
			includeMatches: true,
			minMatchCharLength: 2,
			useExtendedSearch: true,
			distance: 50,
			threshold: 0.3,
		})

	if (event.data.input) {
		let results = [
			...fuse.search(
				event.data.input + '|' + event.data.input.replace(/ /g, '|')
			),
		]
		postMessage(results)
	}
}
