import { currentSimulationSelector } from 'Selectors/storageSelectors'
import { pipe } from '../utils'

export const serialize = pipe(currentSimulationSelector, JSON.stringify)

export const deserialize = JSON.parse
