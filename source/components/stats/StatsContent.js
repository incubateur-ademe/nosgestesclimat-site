import React, { useState, useEffect, useContext } from 'react'
import styled from 'styled-components'

import {
	useChart,
	useTotal,
	useSimulationsTerminees,
	useWebsites,
	useOldWebsites,
	useSocials,
	useKeywords,
	usePeriod,
	useReference,
	usePages,
	useAllTime,
	useKmHelp,
	useSimulationsfromKmHelp,
	useRidesNumber,
} from './matomo'
import Section from './utils/Section'
import Evolution from './content/Evolution'
import Sources from './content/Sources'
import Chart from './content/Chart'
import KmFigures from './content/KmFigures'
// import Loader from './applications/Loader'

const Wrapper = styled.div`
	display: flex;
	width: 100%;
	margin-bottom: 2rem;

	@media screen and (max-width: ${1200}px) {
		flex-direction: column;
	}
`
export default function Data(props) {
	const [chartDate, setChartDate] = useState('12')
	const [chartPeriod, setChartPeriod] = useState('week')

	const { data: chart } = useChart({
		chartDate: Number(chartDate) + 1,
		chartPeriod,
	})
	const { data: total } = useTotal()
	const { data: simulations } = useSimulationsTerminees()
	const { data: websites } = useWebsites()
	const { data: oldWebsites } = useOldWebsites()
	const { data: socials } = useSocials()
	const { data: keywords } = useKeywords()
	const { data: period } = usePeriod()
	const { data: reference } = useReference()
	const { data: pages } = usePages()
	const { data: allTime } = useAllTime()
	const { data: kmhelp } = useKmHelp()
	const { data: simulationsfromhelp } = useSimulationsfromKmHelp()
	const { data: ridesnumber } = useRidesNumber()

	// console.log({
	// 	total,
	// 	websites,
	// 	oldWebsites,
	// 	socials,
	// 	keywords,
	// 	period,
	// 	reference,
	// 	pages,
	// 	allTime,
	// })

	return (
		<div>
			<Section.TopTitle>Statistiques</Section.TopTitle>
			{total &&
			websites &&
			oldWebsites &&
			socials &&
			keywords &&
			period &&
			reference &&
			pages &&
			allTime ? (
				<>
					<Section>
						<Wrapper>
							<Evolution
								period={period.value}
								reference={reference.value}
								pages={pages.value}
								allTime={allTime.value}
								simulations={simulations}
							/>
							{chart && (
								<Chart
									chart={chart}
									period={chartPeriod}
									date={chartDate}
									setPeriod={setChartPeriod}
									setDate={setChartDate}
								/>
							)}
						</Wrapper>
						<Sources
							total={total.value}
							websites={websites}
							oldWebsites={oldWebsites}
							socials={socials}
							keywords={keywords}
						/>
					</Section>
					<Section>
						<Section.Title>La voiture en chiffres</Section.Title>
						<KmFigures
							kmhelp={kmhelp?.nb_visits}
							simulationsfromhelp={simulationsfromhelp?.nb_visits}
							ridesnumber={ridesnumber?.nb_events}
						/>
					</Section>
				</>
			) : (
				<div>Loading</div>
				// <Loader />
			)}
		</div>
	)
}
