const paths = require('./paths')
const utils = require('./../../nosgestesclimat/scripts/i18n/utils')
const cli = require('./../../nosgestesclimat/scripts/i18n/cli')

const { destLangs } = cli.getArgs(
	`Optimizes UI translation files by removing .lock contents`,
	{ target: 'all', targetDefault: utils.availableLanguages }
)

destLangs.forEach((destLang) => {
	const destPaths = paths.UI[destLang]

	const withLock = utils.readYAML(destPaths.withLock).entries
	const withoutLock = Object.entries(withLock).filter(
		([key, _]) => !key.includes(utils.LOCK_KEY_EXT)
	)
	utils.writeYAML(
		destPaths.withoutLock,
		{ entries: Object.fromEntries(withoutLock) },
		'literal'
	)
	console.log(`Written in ${cli.yellow(destPaths.withoutLock)}`)
})
