/*
	Calls the DeepL API to translate the Markdown files.

	NOTE: In order to avoid to translate internal links, we use pandoc to
	convert the Markdown to HTML and then back to Markdown.

	Command: yarn translate:md [options]
*/

const fs = require('fs')
const glob = require('glob')

const utils = require('../../nosgestesclimat/scripts/i18n/utils')
const deepl = require('../../nosgestesclimat/scripts/i18n/deepl')
const cli = require('../../nosgestesclimat/scripts/i18n/cli')

const { srcLang, destLangs, srcFile, force } = cli.getArgs(
	`Calls the DeepL API to translate the Markdown files.

	Important: this script requires the 'pandoc' executable to be installed.`,
	{
		file: true,
		source: true,
		force: true,
		target: true,
		defaultSrcFiles: '*.md',
	}
)

const translateTo = async (src, destPath, destLang) => {
	console.log(`Translating to ${cli.yellow(destPath)}...`)
	const translation = await deepl.fetchTranslationMarkdown(
		src,
		srcLang.toUpperCase(),
		destLang.toUpperCase()
	)
	fs.writeFileSync(destPath, translation, 'utf8', { flag: 'w' })
}

console.log(
	`Translating Markdown files from ${cli.yellow(
		`source/locales/pages/${srcLang}/${srcFile}`
	)}...`
)
glob(`source/locales/pages/${srcLang}/${srcFile}`, (err, files) => {
	cli.exitIfError(err, `ERROR: an error occured while fetching the files:`)
	console.log(
		`Found ${cli.withStyle(
			cli.colors.fgGreen,
			files.length
		)} files to translate.`
	)

	files.forEach((file) => {
		const src = fs.readFileSync(file, 'utf8')
		destLangs.forEach((destLang) => {
			const destPath = file.replace(srcLang, destLang)
			if (!fs.existsSync(destPath) || force) {
				translateTo(src, destPath, destLang)
			} else {
				console.log(
					`The file ${cli.yellow(destPath)} already exists, ${cli.yellow(
						'skipping'
					)}... (use the -f to force the translation)`
				)
			}
		})
	})
})
