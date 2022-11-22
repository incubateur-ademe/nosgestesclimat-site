const yargs = require('yargs')
const glob = require('glob')
const path = require('path')
const fs = require('fs')
const yaml = require('yaml')
const Engine = require('publicodes').default
const {
	dGraphToJSON,
	getCompressibleNodes,
	getDependencyGraphStats,
	getDependencyGraph,
} = require('./rulesCompression')

const line = () => console.log('---------------------------------------')

const args = yargs
	.usage('CLI tool to analyse Publicodes models.\n\nUsage: node $0 [options]')
	.option('model', {
		alias: 'm',
		type: 'string',
		default: 'nosgestesclimat/data/**/*.yaml',
		description: `Regexp matching the Publicodes model's files`,
	})
	.option('save', {
		type: 'string',
		alias: 's',
		description: 'Path to save the dependency graph in a JSON format',
	})
	.option('ignore', {
		type: 'string',
		alias: 'i',
		array: true,
		default: [
			'nosgestesclimat/data/translated-*.yaml',
			'nosgestesclimat/data/actions.yaml',
			// '**/actions/*.yaml',
		],
		description: 'Regexps matching the path to ignore',
	})
	.option('nb-rules', {
		alias: 'r',
		type: 'boolean',
		description: 'Print the number of rules',
	})
	.help()
	.alias('help', 'h').argv

glob(args.model, { ignore: args.ignore }, (err, files) => {
	if (err) {
		console.error(err)
		process.exit(-1)
	}

	const model = files.reduce((acc, filename) => {
		try {
			const rules = yaml.parse(fs.readFileSync(path.resolve(filename), 'utf-8'))
			return { ...acc, ...rules }
		} catch (err) {
			console.error(err)
			process.exit(-1)
		}
	}, {})

	const ruleNames = Object.keys(model)
	const engine = new Engine(model)
	const parsedRules = engine.getParsedRules()
	const graph = getDependencyGraph(
		model,
		engine.baseContext.referencesMaps.referencesIn
	)
	const beforeStats = getDependencyGraphStats(graph)
	const { compressedGraph } = getCompressibleNodes(graph, parsedRules)
	const afterStats = getDependencyGraphStats(compressedGraph)

	line()
	console.log('Before compression:', beforeStats)
	console.log('After compression:', afterStats)

	if (args.save) {
		const graphJSON = dGraphToJSON(graph, ruleNames, parsedRules)
		console.log(graphJSON)
		JSON.stringify(graphJSON)
		fs.writeFileSync(
			path.resolve(args.save),
			JSON.stringify(graphJSON, { sortMapEntries: true })
		)
	}

	line()
})
