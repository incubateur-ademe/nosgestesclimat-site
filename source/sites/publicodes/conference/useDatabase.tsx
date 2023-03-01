import { useMemo } from 'react'
import { io } from 'socket.io-client'

const secure = NODE_ENV === 'development' ? '' : 's'
const protocol = `http${secure}://`
export const serverURL = protocol + SERVER_URL

export const answersURL = serverURL + '/answers/'

export const surveysURL = serverURL + '/surveys/'

export const contextURL = serverURL

export default () => {
	const database = useMemo(
		() =>
			io(`ws${secure}://` + SERVER_URL).on('error', (err) =>
				console.log('ERROR', err)
			),
		[]
	)

	return database
}
