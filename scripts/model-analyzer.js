const yargs = require('yargs')
const glob = require('glob')
const path = require('path')
const fs = require('fs')
const yaml = require('yaml')
const dGraph = require('dependency-graph')
const Engine = require('publicodes').default

const line = () => console.log('---------------------------------------')

const args = yargs
	.usage('CLI tool to analyse Publicodes models.\n\nUsage: node $0 [options]')
	.option('model', {
		alias: 'm',
		type: 'string',
		default: 'nosgestesclimat/data/**/*.yaml',
		description: `Regexp matching the Publicodes model's files`,
	})
	.option('ignore', {
		type: 'string',
		alias: 'i',
		array: true,
		default: [
			'nosgestesclimat/data/translated-*.yaml',
			'nosgestesclimat/data/actions.yaml',
			'**/actions/*.yaml',
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

console.log('args.model:', args.model)

// Remove references to:
// - $SITUATION rules
// - parent namespaces
const removeParentReferences = (dottedName, set) => {
	const splittedDottedName = dottedName.split(' . ')

	splittedDottedName
		.slice(1, splittedDottedName.length)
		.reduce((accName, name) => {
			const newAccName = accName + ' . ' + name
			set.delete(accName)
			return newAccName
		}, splittedDottedName[0])

	set.delete(dottedName + ' . $SITUATION')

	return set
}

const getDependencyGraph = (model, dependencyMap) => {
	let deps = Object.fromEntries(dependencyMap)
	const graph = new dGraph.DepGraph()

	Object.entries(model)
		.filter(([name, _]) => !name.endsWith('$SITUATION'))
		.forEach(([name, value]) => {
			graph.addNode(name, value)
		})

	deps = Object.entries(deps)
		.filter(([name, _]) => {
			return !name.endsWith('$SITUATION')
		})
		.forEach(([name, set]) => {
			removeParentReferences(name, set).forEach((to) =>
				graph.addDependency(name, to)
			)
		})

	return graph
}

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

	// line()
	// console.log('Analyzed files:', files)
	//
	// line()
	// const ruleNames = Object.keys(model)
	// console.log('Number of rules:', ruleNames.length)
	//
	// line()
	const engine = new Engine(model)
	// console.log(
	// 	'engine:',
	// 	engine.baseContext.referencesMaps.referencesIn.get('intensité électricité')
	// )
	// const parsedRules = engine.getParsedRules()
	// const parsedRuleNames = Object.keys(parsedRules)
	// getStatsOnNodesDegree(engine.baseContext.referencesMaps.referencesIn)
	// console.log("Number of parsed rule's names:", parsedRuleNames.length)
	// console.log(
	// 	parsedRules['alimentation . boisson'].explanation.valeur.sourceMap.args
	// 		.valeur
	// )

	line()
	const graph = getDependencyGraph(
		model,
		engine.baseContext.referencesMaps.referencesIn
	)
	console.log('Number of nodes:', graph.size())
	console.log('Entry nodes:', graph.entryNodes())
	//
	// line()
})
