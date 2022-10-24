const yaml = require('yaml')

module.exports = function (content) {
	const jsObject = yaml.parse(content)

	//Remove keys that make the bundle heavier but are only useful for translation purposes, not in the UI
	const newObject = {
		entries: Object.fromEntries(
			Object.entries(jsObject.entries).filter(
				([key, value]) => !key.endsWith('.lock')
			)
		),
	}

	return 'module.exports = ' + JSON.stringify(newObject)
}
