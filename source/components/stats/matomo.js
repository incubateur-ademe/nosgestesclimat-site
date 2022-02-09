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

export const useTotalNgcSimulations = () =>
	useQuery(
		['totalNgcSimulations'],
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
