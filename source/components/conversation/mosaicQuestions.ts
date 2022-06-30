import NumberedMosaic from './select/NumberedMosaic'
import SelectDevices from './select/SelectDevices'
import { DottedName } from 'Rules'

const mosaicQuestions: Array<{
	question: string
	description: string
	isApplicable: Function
	component: React.FunctionComponent
	dottedName: DottedName
}> = [
	{
		dottedName: "numérique . liste d'appareils",
		options: { defaultsToFalse: true },
		question: 'Quels appareils numériques de moins de 10 ans possédez-vous ?',
		description: `
L'essentiel de l'empreinte du numérique réside dans les appareils que nous achetons. Renseignez ici vos appareils.


> ✨️ Par simplicité, ne renseignez que les appareils récents : un smartphone âgé de 10 ans a déjà été bien amorti. 
> Si vous l'avez acheté d'occasion il y a 3 ans et qu'il avait déjà environ 2 ans, considérez qu'il a 5 ans ! 

> 📡 Nous ajouterons au fur et à mesure d'autres types d'appareils : box internet, box TV, 2ème TV, imprimante, etc..
			`,
		isApplicable: (dottedName: DottedName) =>
			dottedName.includes('numérique') && dottedName.includes(' . présent'),
		component: SelectDevices,
	},
	{
		dottedName: "divers . électroménager . liste d'appareils",
		options: { defaultsToFalse: true },
		question:
			'Quels appareils électroménagers de moins de 10 ans possédez-vous ?',
		description: `
L'essentiel de l'empreinte de l'électroménager réside dans les appareils que nous achetons.

> ✨️ Par simplicité, ne renseignez que les appareils récents : un réfrigérateur âgé de 10 ans a déjà été bien amorti.

Si tous vos appareils ne sont pas proposés dans cette liste, ce n'est pas grave, ce test ne se veut pas exhaustif.
			`,
		isApplicable: (dottedName: DottedName) =>
			dottedName.includes('divers . électroménager') &&
			dottedName.includes(' . présent'),
		component: SelectDevices,
	},
	{
		dottedName: 'logement . modes de chauffage',
		options: { defaultsToFalse: true },
		question: 'Comment est chauffé votre logement ?',
		description: `
Certains logements sont chauffés entièrement à l'électricité, d'autres sont entièrement chauffés av  ec du gaz, et plus rarement du bois ou du fioul.·
      
Dans d'autres situations encore, un logement peut être chauffé principalement à l'électricité, mais   avec un appoint bois, par exemple.

Cochez tous les modes que vous utilisez.

			`,
		isApplicable: (dottedName: DottedName) =>
			dottedName.includes('logement . chauffage') &&
			dottedName.includes(' . présent'),
		component: SelectDevices,
	},
	{
		dottedName: 'transport . vacances',
		options: { defaultsToFalse: true },
		question: 'Que possédez-vous pour vos week-ends, vos vacances ?',
		description: `
A compléter

			`,
		isApplicable: (dottedName: DottedName) =>
			dottedName.includes('transport . vacances') &&
			dottedName.includes(' . propriétaire'),
		component: SelectDevices,
	},
	{
		dottedName: 'alimentation . plats',
		question:
			'Choisissez les plats de vos midis et dîners pour une semaine type',
		description: `

Choisissez 14 plats qui représentent votre semaine type : 7 midi et 7 dîners. 

> Aujourd'hui nous travaillons pour que les menus associés à vos repas soient les plus représentatifs de vos habitudes, n'hésitez pas à aller plus loin en parcourant [la documentation](https://nosgestesclimat.fr/documentation/alimentation/plats).

			`,
		suggestions: {
			'je suis végétalien': {
				'végétalien . nombre': 14,
			},
			'je suis végétarien': {
				'végétalien . nombre': 3,
				'végétarien . nombre': 11,
			},
			'je mange peu de viande': {
				'végétalien . nombre': 1,
				'végétarien . nombre': 7,
				'viande 1 . nombre': 4,
				'poisson 1 . nombre': 1,
				'poisson 2 . nombre': 1,
			},
			'je mange de la viande régulièrement': {
				'végétarien . nombre': 4,
				'viande 1 . nombre': 6,
				'viande 2 . nombre': 2,
				'poisson 1 . nombre': 1,
				'poisson 2 . nombre': 1,
			},
			'je mange beaucoup de viande': {
				'viande 1 . nombre': 6,
				'viande 2 . nombre': 6,
				'poisson 1 . nombre': 1,
				'poisson 2 . nombre': 1,
			},
		},
		isApplicable: (dottedName: DottedName) =>
			dottedName.includes('alimentation . plats') &&
			dottedName.includes(' . nombre'),
		component: NumberedMosaic,
		options: { chipsTotal: 14 },
	},
	{
		dottedName: 'alimentation . boisson . chaude',
		question:
			'Quelle est votre consommation de boissons chaudes pour une semaine type (nombre de tasses par semaine)?',
		description: `

Vos consommations de boissons chaudes pour une semaine type. Un café par jour ? Un thé tous les soirs ? Un chocolat chaud au petit déjeuner ? 

> Les boissons chaudes que vous consommez au petit déjeuner sont à prendre en compte ici !
			`,
		suggestions: {
			'Pas de boisson chaude': {
				'café . nombre': 0,
				'thé . nombre': 0,
				'chocolat chaud . nombre': 0,
			},
			'un café par jour': {
				'café . nombre': 7,
			},
			'beaucoup de café': {
				'café . nombre': 28,
			},
			'un café et un thé par jour': {
				'café . nombre': 7,
				'thé . nombre': 7,
			},
			'un chocolat chaud le matin': {
				'chocolat chaud . nombre': 7,
			},
		},
		isApplicable: (dottedName: DottedName) =>
			dottedName.includes('alimentation . boisson . chaude') &&
			dottedName.includes(' . nombre'),
		component: NumberedMosaic,
	},
	{
		dottedName: 'divers . textile',
		question: 'Quels vêtements achetez-vous neufs en général dans une année ?',
		isApplicable: (dottedName: DottedName) =>
			dottedName.includes('divers . textile') &&
			dottedName.includes(' . nombre'),
		component: NumberedMosaic,
	},
]

export default mosaicQuestions
