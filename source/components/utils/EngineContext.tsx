import Engine from 'publicodes'
import React, { createContext, useContext } from 'react'
import { DottedName } from 'modele-social'
import i18n from '../../locales/i18n'

export const EngineContext = createContext<Engine>(new Engine({}))
export const EngineProvider = EngineContext.Provider

const unitsTranslations = Object.entries(i18n.getResourceBundle('fr', 'units'))

export const engineOptions = {
	getUnitKey(unit: string): string {
		const key = unitsTranslations
			.find(([, trans]) => trans === unit)?.[0]
			.replace(/_plural$/, '')
		return key || unit
	},
	formatUnit(unit: string, count: number): string {
		return i18n?.t(`units:${unit}`, { count })
	},
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
	try {
		engine.setSituation(situation)
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
export function useInversionFail() {
	return useContext(EngineContext).inversionFail()
}
