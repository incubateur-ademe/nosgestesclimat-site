import { useMemo } from 'react'
import { io } from 'socket.io-client'

const secure = process.env.NODE_ENV === 'development' ? '' : 's'
const protocol = `http${secure}://`
export const serverURL = protocol + process.env.SERVER_URL

export const answersURL = serverURL + '/answers/'

export const surveysURL = serverURL + '/surveys/'

export const simulationURL = serverURL + '/simulation/'

export const emailSimulationURL = serverURL + '/email-simulation/'

export const contextURL = serverURL

export default () => {
	const database = useMemo(
		() =>
			io(`ws${secure}://` + process.env.SERVER_URL).on('error', (err) =>
				console.log('ERROR', err)
			),
		[]
	)

	return database
}
