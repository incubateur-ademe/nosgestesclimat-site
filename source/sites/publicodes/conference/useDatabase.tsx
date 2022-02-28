import { useMemo } from 'react'
import { io } from 'socket.io-client'

const secure = NODE_ENV === 'development' ? '' : 's'
const protocol = `http${secure}://`

export const answersURL = protocol + SERVER_URL + '/answers/'

export const surveysURL = protocol + SERVER_URL + '/surveys/'

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
