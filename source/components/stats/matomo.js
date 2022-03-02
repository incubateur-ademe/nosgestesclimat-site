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

export const useVisitsDuration = () =>
	useQuery(['VisitsDuration'], () =>
		axios
			.get(
				`https://stats.data.gouv.fr/?module=API&idSite=${idSite}&method=VisitorInterest.getNumberOfVisitsPerVisitDuration&segment=eventAction%3D%3DClic%252520CTA%252520accueil&period=range&date=last60&format=JSON`
			)
			.then((res) => res.data)
	)

export const useVisitsAvgDuration = () =>
	useQuery(['VisitsAvgDuration'], () =>
		axios
			.get(
				`https://stats.data.gouv.fr/?module=API&idSite=${idSite}&method=VisitFrequency.get&period=range&date=last60&format=JSON&segment=eventAction%3D%3DClic%252520CTA%252520accueil;visitDuration>=60`
			)
			.then((res) => res.data.avg_time_on_site_new / 60)
	)

export const useSimulationAvgDuration = () =>
	useQuery(['SimulationAvgDuration'], () =>
		axios
			.get(
				`https://stats.data.gouv.fr/?module=API&idSite=${idSite}&method=Actions.getPageUrl&pageUrl=simulateur/bilan&period=range&date=last60&format=JSON&segment=eventAction%3D%3DA%252520termin%2525C3%2525A9%252520la%252520simulation;visitDuration>=60`
			)
			// .then((res) => res.data.find((page) => page.label === 'simulateur'))
			.then((res) => res.data[0].sum_time_spent / res.data[0].nb_visits / 60)
	)

export const useTotal = () =>
	useQuery('total', () =>
		axios
			.get(
				`https://stats.data.gouv.fr/?module=API&date=last30&period=range&format=json&idSite=${idSite}&method=VisitsSummary.getVisits`
			)
			.then((res) => res.data)
	)

export const useWebsites = () =>
	useQuery('websites', () =>
		axios
			.get(
				`https://stats.data.gouv.fr/?module=API&date=last30&period=range&format=json&idSite=${idSite}&method=Referrers.getWebsites&filter_limit=1000`
			)
			.then((res) => res.data)
	)
export const useOldWebsites = () =>
	useQuery('oldwebsites', () =>
		axios
			.get(
				`https://stats.data.gouv.fr/?module=API&date=lastYear,lastMonth&period=range&format=json&idSite=${idSite}&method=Referrers.getWebsites&filter_limit=1000`
			)
			.then((res) => res.data)
	)
export const useSocials = () =>
	useQuery('socials', () =>
		axios
			.get(
				`https://stats.data.gouv.fr/?module=API&date=last30&period=range&format=json&idSite=${idSite}&method=Referrers.getSocials`
			)
			.then((res) => res.data)
	)

export const useKeywords = () =>
	useQuery('keywords', () =>
		axios
			.get(
				`https://stats.data.gouv.fr/?module=API&date=last30&period=range&format=json&idSite=${idSite}&method=Referrers.getKeywords`
			)
			.then((res) => res.data)
	)

export const usePeriod = () =>
	useQuery('period', () =>
		axios
			.get(
				`https://stats.data.gouv.fr/?module=API&date=last30&period=range&format=json&idSite=${idSite}&method=VisitsSummary.getVisits`
			)
			.then((res) => res.data)
	)
export const useReference = () =>
	useQuery('reference', () =>
		axios
			.get(
				`https://stats.data.gouv.fr/?module=API&date=last60&period=range&format=json&idSite=${idSite}&method=VisitsSummary.getVisits`
			)
			.then((res) => res.data)
	)
export const usePages = () =>
	useQuery('pages', () =>
		axios
			.get(
				`https://stats.data.gouv.fr/?module=API&date=last30&period=range&format=json&idSite=${idSite}&method=Actions.getEntryPageUrls&filter_limit=1000`
			)
			.then((res) => res.data)
	)
export const useAllTime = () =>
	useQuery('allTime', () =>
		axios
			.get(
				`https://stats.data.gouv.fr/?module=API&date=last6000&period=range&format=json&idSite=${idSite}&method=VisitsSummary.getVisits`
			)
			.then((res) => res.data)
			.then((data) => {
				const base = 109689 //base NGC
				data.value += base
				return data
			})
	)

const kmDate = '2022-02-24,today'

export const useKmHelp = () =>
	useQuery(
		['KmHelp'],

		() =>
			axios
				.get(
					`https://stats.data.gouv.fr/?module=API&method=Events.getAction&idSite=${idSite}&period=range&date=${kmDate}&format=JSON`
				)
				.then((res) => {
					const open = res.data.find(
						(action) => action.label === 'Ouvre aide à la saisie km voiture'
					).nb_visits
					const close = res.data.find(
						(action) => action.label === 'Ferme aide à la saisie km voiture'
					).nb_visits
					const realUse = open - close
					return realUse
				}),
		{
			keepPreviousData: true,
		}
	)

export const useSimulationsfromKmHelp = () =>
	useQuery(
		['SimulationsTermineesfromKmHelp'],
		() =>
			axios
				.get(
					`https://stats.data.gouv.fr/?module=API&method=Events.getAction&idSite=${idSite}&period=range&date=${kmDate}&format=JSON`
				)
				.then((res) =>
					res.data.find((action) => action.label === 'A terminé la simulation')
				),
		{
			keepPreviousData: true,
		}
	)

export const useRidesNumber = () =>
	useQuery(
		'ridesNumber',
		() =>
			axios
				.get(
					`https://stats.data.gouv.fr/?module=API&method=Events.getAction&idSite=${idSite}&period=range&date=${kmDate}&format=JSON`
				)
				.then((res) =>
					res.data.find((action) => action.label === 'Ajout trajet km voiture')
				),
		{
			keepPreviousData: true,
		}
	)
