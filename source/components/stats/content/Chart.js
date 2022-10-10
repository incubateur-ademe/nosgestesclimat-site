import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from 'recharts'
import { useChart } from '../matomo'
import Search from './chart/Search'
import CustomTooltip from './chart/CustomTooltip'

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
export default function AreaWeekly(props) {
	const [chartDate, setChartDate] = useState('12')
	const [chartPeriod, setChartPeriod] = useState('week')

	const { data: chart } = useChart({
		chartDate: Number(chartDate) + 1,
		chartPeriod,
	})

	const [data, setData] = useState(null)

	useEffect(() => {
		if (chart) {
			let dates = Object.keys(chart)
			dates.length--
			setData(
				dates.map((date) => {
					let points = { date }
					points['Visiteurs'] = chart[date]
					return points
				})
			)
		}
	}, [chart])

	return chart && data ? (
		<Wrapper>
			<Search
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
							tickFormatter={(tick) => {
								const date = new Date(tick.split(',')[0])
								return chartPeriod === 'month'
									? date.toLocaleDateString('fr-fr', {
											month: 'long',
											year: 'numeric',
									  })
									: date.toLocaleDateString('fr-fr', {
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
						<Tooltip content={<CustomTooltip period={chartPeriod} />} />
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
