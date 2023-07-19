import { Situation } from '@/types/simulation'

export type Persona = {
	nom: string
	icônes: string
	situation: Situation
	description?: string
	résumé: string
}

export function parsePersonasFromJSON(json: object): Persona[] {
	const personas: Persona[] = []

	Object.values(json).forEach((persona) => {
		if (
			'nom' in persona &&
			'icônes' in persona &&
			'data' in persona &&
			('description' in persona || 'résumé' in persona)
		) {
			personas.push({ ...persona, situation: persona.data })
		} else {
			console.warn('Persona invalide :', persona)
		}
	})

	return personas
}
