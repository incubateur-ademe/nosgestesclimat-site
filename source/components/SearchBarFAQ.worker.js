import Fuse from 'fuse.js'

let searchWeights = [
	{
		name: 'question',
		weight: 0.6,
	},
	{
		name: 'réponse',
		weight: 0.4,
	},
]

let fuse = null
onmessage = function (event) {
	if (event.data.questions)
		fuse = new Fuse(event.data.questions, {
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
