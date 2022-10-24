const yaml = require('yaml')

module.exports = function (content) {
	const jsContent = yaml.parse(content)

	//Remove keys that make the bundle heavier but are only useful for translation purposes, not in the UI
	const newObject = Array.isArray(jsContent)
		? jsContent.map((entry) =>
				Object.fromEntries(
					Object.entries(entry).filter(([key, value]) => !key.endsWith('.lock'))
				)
		  )
		: {
				entries: Object.fromEntries(
					Object.entries(jsContent.entries).filter(
						([key, value]) => !key.endsWith('.lock')
					)
				),
		  }

	return 'module.exports = ' + JSON.stringify(newObject)
}
