import { useParseQuery } from '@parse/react'
import Parse from 'parse'
import { useEffect } from 'react'
import useDatabase from './useDatabase'

Parse.initialize(PARSE_APPLICATION_ID, PARSE_JAVASCRIPT_KEY) //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
Parse.serverURL = 'https://parseapi.back4app.com/'

export default () => {
	const parseQuery = new Parse.Query('Survey')

	const database = useDatabase()

	/*
	const queryResult = useParseQuery(parseQuery, {
			enableLocalDatastore: true, // Enables cache in local datastore (default: true)
			enableLiveQuery: true, // Enables live query for real-time update (default: true)
		}),
		{ isLive, isLoading, isSyncing, results, count, error, reload } =
			queryResult

	console.log(queryResult)
	*/

	const results = []

	useEffect(() => {
		const Survey = Parse.Object.extend('Survey')
		const newPost = new Survey()
		newPost.save({
			name: 'monsondage' + Math.round(Math.random() * 10),
			answers: ['a', 'b'],
		})
	}, [])

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
