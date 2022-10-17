const paths = require('./paths')
const utils = require('./../../nosgestesclimat/scripts/i18n/utils')
const cli = require('./../../nosgestesclimat/scripts/i18n/cli')

const { destLangs } = cli.getArgs(
	`Optimizes FAQ files by removing .lock contents`,
	{ target: 'all', targetDefault: utils.availableLanguages }
)

destLangs.forEach((destLang) => {
	const destPaths = paths.FAQ[destLang]

	const withLock = utils.readYAML(destPaths.withLock)
	const withoutLock = withLock.map((q) => ({
		catégorie: q.catégorie,
		id: q.id,
		réponse: q.réponse,
		question: q.question,
	}))

	utils.writeYAML(destPaths.withoutLock, withoutLock, 'literal')
	console.log(`Written in ${cli.yellow(destPaths.withoutLock)}`)
})
