import { useParseQuery } from '@parse/react'
import Parse from 'parse'

export default () => {
	const parseQuery = new Parse.Query('Survey')

	const { isLive, isLoading, isSyncing, results, count, error, reload } =
		useParseQuery(parseQuery, {
			enableLocalDatastore: true, // Enables cache in local datastore (default: true)
			enableLiveQuery: true, // Enables live query for real-time update (default: true)
		})

	return results ? (
		results.map((result, index) => (
			<div key={index}>
				<span>{result.get('name')}</span>
				<p>{result.get('answers')}</p>
			</div>
		))
	) : (
		<div>Pas de résultats</div>
	)
}
