import { DottedName } from 'modele-social'
import Engine from 'publicodes'
import React, { createContext, useContext } from 'react'
import { intersect, pick } from '../../utils'

export const EngineContext = createContext<Engine>(new Engine({}))
export const EngineProvider = EngineContext.Provider

export const engineOptions = {
	// getUnitKey(unit: string): string {
	// 	const key = unitsTranslation
	// 		.find(([, trans]) => trans === unit)?.[0]
	// 		.replace(/_plural$/, '')
	// 	return key || unit
	// },
	// formatUnit(unit: string, count: number): string {
	// 	return i18n?.t(`units:${unit}`, { count })
	// },
}

export function useEngine(): Engine<DottedName> {
	return useContext(EngineContext) as Engine<DottedName>
}

type SituationProviderProps = {
	children: React.ReactNode
	situation: Partial<
		Record<DottedName, string | number | Record<string, unknown>>
	>
}
export function SituationProvider({
	children,
	situation,
}: SituationProviderProps) {
	const engine = useContext(EngineContext)

	//TODO
	// Before setting the situation, the existence of the situation's rules must be checked, since publicodes breaks on unexisting <keygen/>
	// This implementation is highly inefficient, since it could be done once when deserialising the stored user situation,
	// (don't forget personas)
	// But I'm waiting for an answer since the publicodes implementation should I believe be less strict
	// https://github.com/betagouv/publicodes/issues/257

	try {
		if (engine) {
			const rules = engine.getParsedRules()
			const validKeys = intersect(Object.keys(rules), Object.keys(situation)),
				validSituation = pick(situation, validKeys)
			engine.setSituation(validSituation)
		}
	} catch (e) {
		console.log(
			`Il est probable qu'une règle obsolète (renommée, refactorée ou supprimée) se trouvait dans la situation de l'utilisateur ou du persona chargé ↙️`
		)
		console.log(e)
	}
	return (
		<EngineContext.Provider value={engine}>{children}</EngineContext.Provider>
	)
}
