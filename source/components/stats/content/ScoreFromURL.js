import { rehydrateDetails, sumFromDetails } from '../../../sites/publicodes/fin'
import styled from 'styled-components'
import Tile from '../utils/Tile'
import { formatValue } from 'publicodes'
import TotalChart from './TotalChart'

const Wrapper = styled.div`
	width: 100%;
	text-align: center;
	padding-top: 0rem;
`

const TopBlock = styled(Tile.Content)`
	margin-bottom: 2rem;
	margin-top: 1rem;
	width: 100%;
	font-size: 150%;
`
const Number = styled.span`
	display: block;
	margin-bottom: 2rem;
	font-size: 2.5rem;
	font-weight: 800;
	line-height: 1;
	color: var(--color);
	transition: color 500ms ease-out;
	> small {
		color: var(--lightColor);
		font-size: 60%;
	}
`
const Text = styled.p`
	margin-top: 1rem;
	margin-bottom: -1rem;
	font-size: 0.75rem;
	font-weight: 300;
	text-align: right;
`

export default function ScoreFromURL(props) {
	const scores = props.pages && getScores(props.pages)
	// we exclude high number of visits on same urls (corresponds to average test score ?)
	// pb : if a user goes to end page, come back to test, change test score, come back to end page, 2 score values are taken into account instead of one.
	const filteredScores = scores.slice(scores.findIndex((elt) => elt[1] < 50))
	const meanScore = weightedAverage(filteredScores)
	const roundedMeanScore = formatValue(meanScore / 1000)
	const flatScoreArray = filteredScores
		.map((elt) => [Array(elt[1]).fill(elt[0])])
		.flat()
		.flat()
	const totalVisits = flatScoreArray.length
	return (
		<Wrapper>
			<Tile.Tile>
				<TopBlock>
					<Number>
						{roundedMeanScore} tonnes{' '}
						<small>de CO₂e en moyenne ({totalVisits} simulations)</small>
					</Number>
					<TotalChart flatScoreArray={flatScoreArray} />
					<Text>Données valables pour les 30 derniers jours</Text>
				</TopBlock>
			</Tile.Tile>
		</Wrapper>
	)
}

const getScores = (pages) => {
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
