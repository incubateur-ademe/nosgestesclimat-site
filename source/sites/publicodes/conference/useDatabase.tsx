import { useMemo } from 'react'
import { initializeParse } from '@parse/react'
import Parse from 'parse'

export default () => {
	const database = useMemo(() => {
		Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY) //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
		Parse.serverURL = 'https://' + PARSE_SERVER_URL + '/'
	}, [])

	return database
}
