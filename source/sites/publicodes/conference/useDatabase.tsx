import { useMemo } from 'react'
import { initializeParse } from '@parse/react'
import Parse from 'parse'
import { io } from 'socket.io-client'

export default () => {
	const database = useMemo(() => io('ws://' + SERVER_URL), [])

	return database
}
