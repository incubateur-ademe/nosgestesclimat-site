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

const getDependencyGraphStats = (graph) => {
	const graphEntries = Object.entries(graph.nodes)

	const stats = graphEntries.reduce(
		(stats, [name, _]) => {
			const degIn = graph.directDependantsOf(name).length
			const degOut = graph.directDependenciesOf(name).length
			return {
				...stats,
				totalDeg: stats.totalDeg + degOut,
				maxDegOut: degOut > stats.maxDegOut ? degOut : stats.maxDegOut,
				maxDegIn: degIn > stats.maxDegIn ? degIn : stats.maxDegIn,
			}
		},
		{
			nbNodes: graph.size(),
			totalDeg: 0,
			averageDeg: 0,
			maxDegOut: 0,
			maxDegIn: 0,
		}
	)

	return { ...stats, averageDeg: stats.totalDeg / stats.nbNodes }
}

const getDependencyGraph = (model, dependencyMap) => {
	const graph = new dGraph.DepGraph()
	var deps = Object.fromEntries(dependencyMap)
	const modelWithoutSituations = Object.entries(model).filter(
		([name, _]) => !name.endsWith('$SITUATION')
	)

	modelWithoutSituations.forEach(([name, value]) => {
		graph.addNode(name, value)
	})

	Object.entries(deps)
		.filter(([name, _]) => {
			return !name.endsWith('$SITUATION')
		})
		.forEach(([name, set]) => {
			const realDeps = removeParentReferences(name, set)
			realDeps.forEach((to) => graph.addDependency(name, to))
		})

	return graph
}

const dGraphToJSON = (graph, ruleNames, parsedRules) => {
	return ruleNames.reduce((acc, name) => {
		const deps = graph.directDependantsOf(name)
		const title = parsedRules[name]?.title ?? name

		acc.push({ _name: name, _deps: deps, Title: title })
		return acc
	}, [])
}

// To be compressible, a node (rule) needs to be a constant:
// - no question
// - no dependency
const isCompressible = (name, graph, parsedRules) => {
	return (
		!parsedRules[name].rawNode.question &&
		graph.dependenciesOf(name).length === 0
	)
}

const getCompressibleNodes = (graph, parsedRules) => {
	var compressibleNodes = []
	let compressibleLeafs = []

	do {
		compressibleLeafs = graph
			.overallOrder(true)
			.filter((leaf) => isCompressible(leaf, graph, parsedRules))
		compressibleLeafs.forEach((leaf) => {
			graph.removeNode(leaf)
		})
		compressibleNodes = compressibleNodes.concat(compressibleLeafs)
	} while (compressibleLeafs.length > 0)

	return { compressedGraph: graph, compressibleNodes }
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

	line()
	// console.log('Analyzed files:', files)
	//
	// line()
	const ruleNames = Object.keys(model)
	const engine = new Engine(model)
	const parsedRules = engine.getParsedRules()
	const graph = getDependencyGraph(
		model,
		engine.baseContext.referencesMaps.referencesIn
	)
	const beforeStats = getDependencyGraphStats(graph)
	const { compressedGraph, compressibleNodes } = getCompressibleNodes(
		graph,
		parsedRules
	)
	const afterStats = getDependencyGraphStats(compressedGraph)

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
