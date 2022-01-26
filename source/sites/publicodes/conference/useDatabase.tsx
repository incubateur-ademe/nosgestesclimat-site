import { useMemo } from 'react'
import { initializeParse } from '@parse/react'

export default () => {
	const database = useMemo(
		() =>
			initializeParse(
				'PARSE_SERVER_URL',
				'PARSE_APPLICATION_ID',
				'PARSE_JAVASCRIPT_KEY'
			),
		[]
	)

	return database
}
