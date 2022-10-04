import { useQuery } from 'react-query'
import axios from 'axios'

const idSite = 153

export const useChart = ({ chartPeriod, chartDate }) =>
	useQuery(
		['chart', chartPeriod, chartDate],
		() =>
			axios
				.get(
					`https://stats.data.gouv.fr/?module=API&date=last${chartDate}&period=${chartPeriod}&format=json&idSite=${idSite}&method=VisitsSummary.getVisits`
				)
				.then((res) => res.data)
				.then((data) => {
					let total = {}
					for (let key in data) {
						for (let date in data[key]) {
							if (!total[date]) {
								total[date] = data[key][date]
							} else {
								total[date] += data[key][date]
							}
						}
					}
					return { ...data, total }
				}),
		{
			keepPreviousData: true,
		}
	)

export const useSimulationsTerminees = () =>
	useQuery(
		['SimulationsTerminees'],
		() =>
			axios
				.get(
					`https://stats.data.gouv.fr/?module=API&method=Events.getAction&idSite=${idSite}&period=range&date=last6000&format=JSON`
				)
				.then((res) =>
					res.data.find((action) => action.label === 'A terminé la simulation')
				),
		{
			keepPreviousData: true,
		}
	)

export const useX = (queryName, urlQuery, transformResult) =>
	useQuery(queryName, () =>
		axios
			.get('https://stats.data.gouv.fr/?' + urlQuery)
			.then((res) => transformResult(res))
	)

export const useVisitsDuration = () =>
	useX(
		'VisitsDuration',
		`module=API&idSite=${idSite}&method=VisitorInterest.getNumberOfVisitsPerVisitDuration&segment=eventAction%3D%3DClic%252520CTA%252520accueil&period=range&date=last60&format=JSON`,
		(res) => res.data
	)

export const useVisitsAvgDuration = () =>
	useX(
		'VisitsAvgDuration',
		`module=API&idSite=${idSite}&method=VisitFrequency.get&period=range&date=last60&format=JSON&segment=eventAction%3D%3DClic%252520CTA%252520accueil;visitDuration>=60`,
		(res) => res.data.avg_time_on_site_new / 60
	)

export const useSimulationAvgDuration = () =>
	useX(
		'SimulationAvgDuration',
		`module=API&idSite=${idSite}&method=Actions.getPageUrl&pageUrl=simulateur/bilan&period=range&date=last60&format=JSON&segment=eventAction%3D%3DA%252520termin%2525C3%2525A9%252520la%252520simulation;visitDuration>=60`,
		(res) => res.data[0].sum_time_spent / res.data[0].nb_visits / 60
	)

export const useTotal = () =>
	useX(
		'total',
		`module=API&date=last30&period=range&format=json&idSite=${idSite}&method=VisitsSummary.getVisits`,
		(res) => res.data
	)

export const useWebsites = () =>
	useX(
		'websites',
		`module=API&date=last30&period=range&format=json&idSite=${idSite}&method=Referrers.getWebsites&filter_limit=1000`,
		(res) => res.data
	)

export const useOldWebsites = () =>
	useX(
		'oldwebsites',
		`module=API&date=lastYear,lastMonth&period=range&format=json&idSite=${idSite}&method=Referrers.getWebsites&filter_limit=1000`,
		(res) => res.data
	)

export const useSocials = () =>
	useX(
		'socials',
		`module=API&date=last30&period=range&format=json&idSite=${idSite}&method=Referrers.getSocials`,

		(res) => res.data
	)

export const useKeywords = () =>
	useX(
		'keywords',
		`module=API&date=last30&period=range&format=json&idSite=${idSite}&method=Referrers.getKeywords`,
		(res) => res.data
	)

export const usePeriod = () =>
	useX(
		'period',
		`module=API&date=last30&period=range&format=json&idSite=${idSite}&method=VisitsSummary.getVisits`,
		(res) => res.data
	)

export const useReference = () =>
	useX(
		'reference',
		`module=API&date=last60&period=range&format=json&idSite=${idSite}&method=VisitsSummary.getVisits`,
		(res) => res.data
	)

export const useEntryPages = () =>
	useX(
		'entryPages',
		`module=API&date=last30&period=range&format=json&idSite=${idSite}&method=Actions.getEntryPageUrls&expanded=1&filter_limit=1000`,
		(res) => res.data
	)

export const useActiveEntryPages = () =>
	useX(
		'activeEntryPages',
		`module=API&date=last30&period=range&format=json&idSite=${idSite}&method=Actions.getEntryPageUrls&filter_limit=1000&segment=eventAction%3D%3DClic%252520CTA%252520accueil`,
		(res) => res.data
	)

export const usePages = () =>
	useX(
		'pages',
		`module=API&date=last30&period=range&format=json&idSite=${idSite}&method=Actions.getPageUrls&filter_limit=-1`,
		(res) => res.data
	)

export const useAllTime = () =>
	useX(
		'allTime',
		`module=API&date=last6000&period=range&format=json&idSite=${idSite}&method=VisitsSummary.getVisits`,
		(res) => {
			const base = 109689 //base NGC
			res.data.value += base
			return res.data
		}
	)

const kmDate = '2022-02-24,today'

export const useKmHelp = () =>
	useX(
		'KmHelp',
		`module=API&method=Events.getAction&idSite=${idSite}&period=range&date=${kmDate}&format=JSON`,
		(res) => {
			const open = res.data.find(
				(action) => action.label === 'Ouvre aide à la saisie km voiture'
			).nb_visits
			const close = res.data.find(
				(action) => action.label === 'Ferme aide à la saisie km voiture'
			).nb_visits
			const realUse = open - close
			return realUse
		}
	)

export const useSimulationsfromKmHelp = () =>
	useX(
		'SimulationsTermineesfromKmHelp',
		`module=API&method=Events.getAction&idSite=${idSite}&period=range&date=${kmDate}&format=JSON`,
		(res) =>
			res.data.find((action) => action.label === 'A terminé la simulation')
	)

export const useRidesNumber = () =>
	useX(
		'ridesNumber',
		`module=API&method=Events.getAction&idSite=${idSite}&period=range&date=${kmDate}&format=JSON`,
		(res) =>
			res.data.find((action) => action.label === 'Ajout trajet km voiture')
	)
