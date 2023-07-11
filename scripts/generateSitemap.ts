import * as fs from 'fs'
import * as path from 'path'
import Engine, { utils } from 'publicodes'
import {
	DottedName,
	encodeRuleNameToSearchParam,
	isValidRule,
	NGCRulesNodes,
} from '../source/components/publicodesUtils'

const destinationURL = path.resolve(
	__dirname,
	'../source/sites/publicodes/sitemap.txt'
)

const baseURLs = `https://nosgestesclimat.fr/simulateur/bilan
https://nosgestesclimat.fr/vie-privée
https://nosgestesclimat.fr/documentation
https://nosgestesclimat.fr/modèle
https://nosgestesclimat.fr/à-propos
https://nosgestesclimat.fr/pétrole-et-gaz
https://nosgestesclimat.fr/nouveautés
https://nosgestesclimat.fr/groupe
https://nosgestesclimat.fr/profil
https://nosgestesclimat.fr/partenaires
https://nosgestesclimat.fr/questions-frequentes
https://nosgestesclimat.fr/contact
https://nosgestesclimat.fr/personas
https://nosgestesclimat.fr/stats
https://nosgestesclimat.fr/actions
https://nosgestesclimat.fr/actions/plus
`

fs.writeFileSync(destinationURL, baseURLs, 'utf8')

const releasePath = path.resolve(
	__dirname,
	'../source/locales/releases/releases-fr.json'
)
const rawdata = fs.readFileSync(releasePath)
const data = JSON.parse(rawdata.toString())
const newsURL = Object.values(data)
	.map(
		(version: any) =>
			`https://nosgestesclimat.fr/nouveautés/${utils.encodeRuleName(
				version.name
			)}`
	)
	.join('\n')
fs.appendFileSync(destinationURL, newsURL + '\n', 'utf8')

console.log('Sitemap mis à jour avec les dernières nouveautés :)')

fetch('https://data.nosgestesclimat.fr/co2-model.FR-lang.fr.json')
	.then((res) => res.json())
	.then((json) => {
		const actionLines = json.actions.formule.somme.map(
			(dottedName: DottedName) =>
				`https://nosgestesclimat.fr/actions/${utils.encodeRuleName(dottedName)}`
		)
		const textAction = actionLines.join('\n')
		fs.appendFileSync(destinationURL, textAction + '\n', 'utf8')

		const ruleNames = Object.keys(json)
		const documentationURLs = ruleNames
			.map(
				(dottedName) =>
					`https://nosgestesclimat.fr/documentation/${utils.encodeRuleName(
						dottedName
					)}`
			)
			.join('\n')

		const parsedRules = new Engine(json).getParsedRules() as NGCRulesNodes
		const questionURLs = ruleNames
			.filter((dottedName) => isValidRule(dottedName, parsedRules))
			.map(
				(dottedName) =>
					`https://nosgestesclimat.fr/simulateur/bilan?question=${encodeRuleNameToSearchParam(
						dottedName
					)}`
			)
			.join('\n')

		fs.appendFileSync(
			destinationURL,
			documentationURLs + '\n' + questionURLs,
			'utf8'
		)
		console.log('Sitemap mis à jour avec les dernières règles publicodes :)')
	})
