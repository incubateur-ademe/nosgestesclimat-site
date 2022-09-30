import { rehydrateDetails, sumFromDetails } from '../../../sites/publicodes/fin'

export default function Evolution(props) {
	const score = props.pages && getScore(props.pages)
	console.log(score.slice(1))
	const meanScore = weightedAverage(score.slice(1))
	console.log(meanScore)
	return
}

const getScore = (pages) => {
	const endPages = pages.filter((page) => page.label.includes('fin'))
	return endPages.map((obj) => {
		const regex = /[tasdln](\d*\.?[\d*$])+/g
		const encodedDetails = obj.label.match(regex).join()
		const rehydratedDetails = rehydrateDetails(encodedDetails)
		const score = sumFromDetails(rehydratedDetails)
		return [score, obj.nb_visits]
	})
}

const weightedAverage = (score) => {
	const [sum, weightSum] = score.reduce(
		(acc, [value, weight]) => {
			acc[0] = acc[0] + value * weight
			acc[1] = acc[1] + weight
			return acc
		},
		[0, 0]
	)
	return sum / weightSum
}
