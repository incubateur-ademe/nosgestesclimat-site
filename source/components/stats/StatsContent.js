import React, { useState, useEffect, useContext } from 'react'
import styled from 'styled-components'

import {
	useChart,
	useTotal,
	useWebsites,
	useOldWebsites,
	useSocials,
	useKeywords,
	usePeriod,
	useReference,
	usePages,
	useAllTime,
} from './matomo'
import Section from './utils/Section'
import Evolution from './applications/Evolution'
import Sources from './applications/Sources'
import Chart from './applications/Chart'
import NumSimulations from './NumSimulations'
import NumForks from './NumForks'
import Tile from './utils/Tile'
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
	const { data: websites } = useWebsites()
	const { data: oldWebsites } = useOldWebsites()
	const { data: socials } = useSocials()
	const { data: keywords } = useKeywords()
	const { data: period } = usePeriod()
	const { data: reference } = useReference()
	const { data: pages } = usePages()
	const { data: allTime } = useAllTime()

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
					{/* <Section>
				<Section.Title>Nos GEStes Climat en chiffres</Section.Title>
				<Tile.Wrapper>
					<NumSimulations />
					<NumForks />
				</Tile.Wrapper>
			</Section> */}
				</>
			) : (
				<div>Loading</div>
				// <Loader />
			)}
		</div>
	)
}
