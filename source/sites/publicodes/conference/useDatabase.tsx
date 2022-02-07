import { useMemo } from 'react'
import { initializeParse } from '@parse/react'
import Parse from 'parse'
import { io } from 'socket.io-client'

const protocol = `http${NODE_ENV === 'development' ? '' : 's'}://`

export const answersURL = protocol + SERVER_URL + '/answers/'

export const surveysURL = protocol + SERVER_URL + '/surveys/'

export default () => {
	const database = useMemo(() => io('ws://' + SERVER_URL), [])

	return database
}
