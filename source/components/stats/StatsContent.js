import { useState } from 'react'
import styled from 'styled-components'

import {
	useChart,
	useTotal,
	useSimulationsTerminees,
	useVisitsDuration,
	useVisitsAvgDuration,
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
import DurationChart from './content/DurationChart'
import DurationFigures from './content/DurationFigures'
import KmFigures from './content/KmFigures'
import { Trans } from 'react-i18next'
// import Loader from './applications/Loader'

const Wrapper = styled.div`
	display: flex;
	width: 100%;
	margin-bottom: 2rem;

	@media screen and (max-width: ${1200}px) {
		flex-direction: column;
	}
`
export default function Data() {
	const [chartDate, setChartDate] = useState('12')
	const [chartPeriod, setChartPeriod] = useState('week')

	const { data: chart } = useChart({
		chartDate: Number(chartDate) + 1,
		chartPeriod,
	})
	const { data: total } = useTotal()
	const { data: simulations } = useSimulationsTerminees()
	const { data: duration } = useVisitsDuration()
	const { data: avgduration } = useVisitsAvgDuration()
	// const { data: avgsimulation } = useSimulationAvgDuration() -> not used anymore
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

	return (
		<div>
			<Section.TopTitle>
				<Trans>Statistiques</Trans>
			</Section.TopTitle>
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
						<Section.Title>
							<Trans>Stats générales</Trans>
						</Section.Title>
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
						<Section.Title>
							<Trans>Durée des visites</Trans>
						</Section.Title>
						<Section.Intro>
							<Trans i18nKey={`components.stats.StatsContent.enSavoirPlus`}>
								<summary>En savoir plus</summary>
								Cette section est générée à partir des visites des 60 derniers
								jours. Les visites dont le temps passé sur le site est inférieur
								à 1 minute ont été écartées. Pour éviter le biais de l'iframe
								qui peut générer des visiteurs inactifs dans les statistiques,
								le temps moyen sur le site a été calculé à partir des visites
								actives (l'utilisateur a cliqué sur "Faire le test").
							</Trans>
						</Section.Intro>
						<Wrapper>
							<DurationFigures avgduration={avgduration} />
							{duration && <DurationChart duration={duration} />}
						</Wrapper>
					</Section>
					<Section>
						<Section.Title>
							<Trans>La voiture en chiffres</Trans>
						</Section.Title>
						<KmFigures
							kmhelp={kmhelp}
							simulationsfromhelp={simulationsfromhelp?.nb_visits}
							ridesnumber={ridesnumber?.nb_events}
						/>
					</Section>
				</>
			) : (
				<div>Chargement</div>
				//TODO: what should we do here?
				// <Loader />
			)}
		</div>
	)
}
