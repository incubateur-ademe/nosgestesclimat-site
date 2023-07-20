import { BranchData } from '@/components/useBranchData'
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
			'situation' in persona &&
			('description' in persona || 'résumé' in persona)
		) {
			personas.push({ ...persona })
		} else {
			console.warn('Persona invalide :', persona)
		}
	})

	return personas
}

export function fetchAndSetAvailablePersonas(
	fileName: string,
	branchData: BranchData,
	setAvailablePersonas: (personas: Persona[]) => void
) {
	if (process.env.NODE_ENV === 'development') {
		const json: object = require('../../../../nosgestesclimat/public' +
			fileName)
		const personas: Persona[] = parsePersonasFromJSON(json)
		setAvailablePersonas(personas)
	} else {
		fetch(branchData.deployURL + fileName, {
			mode: 'cors',
		})
			.then((response) => response.json())
			.then((json) => {
				const personas: Persona[] = parsePersonasFromJSON(json)
				setAvailablePersonas(personas)
			})
			.catch((err) => {
				console.log('url:', branchData.deployURL + fileName)
				console.log('err:', err)
			})
	}
}
