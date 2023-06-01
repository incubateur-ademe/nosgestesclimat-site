import budgetFR from '../../../locales/blog/fr/budget.md'
import campusFr from '../../../locales/blog/fr/campus.md'
import historyFr from '../../../locales/blog/fr/historique.md'
import dayFr from '../../../locales/blog/fr/mondialEnvironnement.md'

type BlogPost = {
	id: number
	title: string
	slug: string
	description: string
	content: string
}

export const blogData: BlogPost[] = [
	{
		id: 4,
		title:
			'Journée mondiale de l’environnement : s’engager pour le climat, ça commence par calculer son empreinte !',
		slug: 'journée-mondial-environnement',
		description:
			'Entre les actuelles 9 tonnes de l’empreinte moyenne d’un citoyen français, et l’objectif affiché de 2 tonnes , il y a beaucoup de pas à faire ! ',
		content: dayFr,
	},
	{
		id: 3,
		title: 'Nos Gestes Climat adapté pour un campus',
		slug: 'campus',
		description:
			'Dans le cadre de leur option-projet, les étudiants de Centrale Nantes se sont attelés à cette tâche et ont repris le simulateur pour en faire une version adaptée à leur campus et ainsi dresser le bilan carbone de l’établissement et des occupants.',
		content: campusFr,
	},
	{
		id: 2,
		title: 'Envie de perdre quelques tonnes ?',
		slug: 'historique',
		description:
			'Cette invitation à perdre quelques tonnes, un brin provoquante, ne date pas d’hier : c’était déjà celle du Coach Carbone lancé en 2010 par l’ADEME et la FNH (Fondation pour la Nature et l’Homme) créée par Nicolas Hulot. ',
		content: historyFr,
	},
	{
		id: 1,
		title: "Le budget et l'empreinte carbone, c'est quoi ?",
		slug: 'budget',
		description:
			"Une explication pas à pas des objectifs climat, de l'échelle de la Terre à celle de l'individu.",
		content: budgetFR,
	},
]
