import NumberedMosaic from './select/NumberedMosaic'
import SelectDevices from './select/SelectDevices'
import { DottedName } from 'Rules'
import { useEngine } from '../utils/EngineContext'

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
		dottedName: 'logement . chauffage',
		options: { defaultsToFalse: true },
		question: 'Comment est chauffé ton logement ?',
		description: `
A compléter
			`,
		isApplicable: (dottedName: DottedName) =>
			dottedName.includes('logement . chauffage') &&
			dottedName.includes(' . présent'),
		component: SelectDevices,
	},
	{
		dottedName: 'transport . autres déplacements',
		options: { defaultsToFalse: true },
		question: 'perso ?',
		description: `
A compléter
			`,
		isApplicable: (dottedName: DottedName) =>
			dottedName.includes('transport . autres déplacements') &&
			dottedName.includes(' . présent'),
		component: SelectDevices,
	},
	{
		dottedName: 'divers . associatif',
		question: 'A quelle(s) association(s) adhéres-tu ?',
		description: `

A compléter 

> A compléter

		`,
		isApplicable: (dottedName: DottedName) =>
			dottedName.includes('divers . associatif . asso') &&
			dottedName.includes(' . adhésion'),
		component: SelectDevices,
	},
	{
		dottedName: 'alimentation . régime',
		question:
			'🎓 Choisis les 5 déjeuners qui représentent ta semaine-type sur le campus (self, RU...)',
		description: `

Choisis les 5 déjeuners qui représentent tes habitudes alimentaires lorsque tu es en cours.

> A compléter
			`,
		isApplicable: (dottedName: DottedName) =>
			dottedName.includes('alimentation . plats campus') &&
			dottedName.includes(' . nombre'),
		component: NumberedMosaic,
		options: { chipsTotal: 5, chipStep: 1 },
	},
	{
		dottedName: 'alimentation . régime',
		question:
			"Quels sont les repas qui complètent ta semaine (soir, week-end...) ? Et on n'oublie pas le kebab de fin de soirée !",
		description: `

Choisis les 9 repas qui complètent une semaine-type.

> A compléter
			`,
		isApplicable: (dottedName: DottedName) =>
			dottedName.includes('alimentation . plats perso') &&
			dottedName.includes(' . nombre'),
		component: NumberedMosaic,
		options: {
			chipsTotalRule: 'alimentation . plats perso . chipstotal',
			chipStep: 1,
		},
	},
	{
		dottedName: 'transport . domicile-campus',
		question:
			'🎓 Quelle à la répartition d’usage des différents modes de transports que vous utilisez pour vos trajets domicile-campus ? ',
		description: `
Indiquez, ici, la répartition de vos moyens de transport pour vous rendre sur votre campus (si vous vivez sur la campus, indiquez que vous marchez à 100%). 
Par exemple, si vous utilisez différents moyens de transport sur un même trajet (voiture plus tramway par exemple) ou encore si vous utilisez différents moyens de transport selon les jours ou les saisons, etc. (vélo en été, voiture en hiver par exemple).
		`,
		isApplicable: (dottedName: DottedName) =>
			dottedName.includes(
				'transport . domicile-campus . moyens de transport'
			) && dottedName.includes(' . pourcent'),
		component: NumberedMosaic,
		options: { chipsTotal: 100, chipStep: 5 },
	},
	{
		dottedName: 'divers . textile',
		question: 'Quels vêtements achetez-vous en général dans une année ?',
		isApplicable: (dottedName: DottedName) =>
			dottedName.includes('divers . textile') &&
			dottedName.includes(' . nombre'),
		component: NumberedMosaic,
	},
]

export default mosaicQuestions
