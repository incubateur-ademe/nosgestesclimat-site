const dGraph = require('dependency-graph')
const Engine = require('publicodes').default

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
			return !(name.endsWith('$SITUATION') || name.endsWith('$EVALUATION'))
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
		!(
			parsedRules[name].rawNode.question ||
			parsedRules[name].rawNode['par défaut']
		) && graph.dependenciesOf(name).length === 0
	)
}

const getCompressibleNodes = (graph, parsedRules) => {
	let compressibleNodes = []
	let compressibleLeafs = []
	let compressedGraph = graph.clone()

	// do {
	compressibleLeafs = compressedGraph
		.overallOrder(true)
		.filter((leaf) => isCompressible(leaf, compressedGraph, parsedRules))
	compressibleLeafs.forEach((leaf) => {
		compressedGraph.removeNode(leaf)
	})
	compressibleNodes = compressibleNodes.concat(compressibleLeafs)
	// } while (compressibleLeafs.length > 0)

	return { compressedGraph, compressibleNodes }
}

module.exports = {
	dGraphToJSON,
	getCompressibleNodes,
	getDependencyGraphStats,
	getDependencyGraph,
}
