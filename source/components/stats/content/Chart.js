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
	const [data, setData] = useState(null)
	useEffect(() => {
		let dates = Object.keys(props.chart)
		dates.length--
		setData(
			dates.map((date) => {
				let points = { date }
				points['Visiteurs'] = props.chart[date]
				return points
			})
		)
	}, [props.chart, props.sites])

	return data ? (
		<Wrapper>
			<Search
				period={props.period}
				date={props.date}
				setPeriod={props.setPeriod}
				setDate={props.setDate}
			/>
			<ChartWrapper>
				<ResponsiveContainer>
					<AreaChart data={data}>
						<XAxis
							dataKey="date"
							tick={{ fontSize: 12 }}
							tickFormatter={(tick) => {
								const date = new Date(tick.split(',')[0])
								return props.period === 'month'
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
								tick.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
							}
						/>
						<Tooltip content={<CustomTooltip period={props.period} />} />
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
