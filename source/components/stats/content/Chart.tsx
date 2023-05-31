import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
	Area,
	AreaChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import styled from 'styled-components'

import { getLangFromAbreviation, getLangInfos } from '@/locales/translation'
import { useChart } from '../matomo.js'
import CustomTooltip from './chart/CustomTooltip.js'
import Search from './chart/Search.js'

const Wrapper = styled.div`
	width: 60%;
	padding-left: 1rem;

	@media screen and (max-width: ${1200}px) {
		width: 100%;
		padding-left: 0rem;
	}

	svg {
		overflow: visible;
	}
`
const ChartWrapper = styled.div`
	height: 22rem;
`
type Props = {
	period: string
	elementAnalysedTitle: string
	target: string
	tooltipLabel?: string
}

export default function Chart(props: Props) {
	const { i18n } = useTranslation()
	const currentLangInfos = getLangInfos(getLangFromAbreviation(i18n.language))

	const [chartDate, setChartDate] = useState('12')
	const [chartPeriod, setChartPeriod] = useState('week')

	const { data: chart } = useChart({
		chartDate: Number(chartDate) + 1,
		chartPeriod,
		target: props.target,
	})

	const [data, setData] = useState<{ date: string }[] | undefined>(undefined)

	useEffect(() => {
		if (chart) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			const dates = Object.keys(chart)
			dates.length-- //last period is removed from data
			const dataDots = dates?.map((date) => {
				const points = { date }
				console.log(chart[date])
				points['Visiteurs'] =
					chart[date] === 'number' ? chart[date] : chart[date]?.[0]?.nb_visits
				return points
			})
			setData(dataDots)
		}
	}, [chart])

	return chart && data ? (
		<Wrapper>
			<Search
				elementAnalysedTitle={props.elementAnalysedTitle}
				period={chartPeriod}
				date={chartDate}
				setPeriod={setChartPeriod}
				setDate={setChartDate}
			/>
			<ChartWrapper>
				<ResponsiveContainer>
					<AreaChart data={data}>
						<XAxis
							dataKey="date"
							tick={{ fontSize: 12 }}
							tickFormatter={(tick: string) => {
								const date = new Date(tick.split(',')[0])
								return props.period === 'month'
									? date.toLocaleDateString(currentLangInfos.abrvLocale, {
											month: 'long',
											year: 'numeric',
									  })
									: date.toLocaleDateString(currentLangInfos.abrvLocale, {
											day: '2-digit',
											month: '2-digit',
									  })
							}}
							interval={'preserveStartEnd'}
							minTickGap={1}
						/>
						<YAxis
							tickFormatter={(tick) =>
								tick.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0')
							}
						/>
						<Tooltip
							content={
								<CustomTooltip
									period={chartPeriod}
									naming={props.tooltipLabel}
								/>
							}
						/>
						<Area
							type="monotone"
							dataKey={'Visiteurs'}
							stroke="var(--darkColor)"
							fill="var(--color)"
							fillOpacity={1}
						/>
					</AreaChart>
				</ResponsiveContainer>
			</ChartWrapper>
		</Wrapper>
	) : null
}
