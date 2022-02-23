import styled from 'styled-components'
import {
	BarChart,
	Bar,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts'

import CustomTooltip from './histogram/CustomTooltip'

const ChartTitle = styled.div`
	margin-bottom: 0.5rem;
	text-align: right;

	@media screen and (max-width: ${800}px) {
		font-size: 0.75rem;
	}
`

const ChartWrapper = styled.div`
	width: 60%;
	padding-left: 1rem;
	height: 22rem;

	@media screen and (max-width: ${1200}px) {
		width: 100%;
		padding-left: 0rem;
		padding-top: 2rem;
	}

	svg {
		overflow: visible;
	}
`

export default function visitDuration(props) {
	// 0-1 min excluded
	const zeroToSeven = props.duration
		.slice(3, 6)
		.reduce((memo, elt) => memo + elt.nb_visits, 0)

	const duration = props.duration.slice(6, 10)
	duration.unshift({
		label: '1-7\u00A0min',
		nb_visits: zeroToSeven,
		segment: 'visitDuration>=60;visitDuration<=420',
	})

	return (
		<ChartWrapper>
			<ChartTitle>Nombre de visites pour les 60 derniers jours</ChartTitle>
			<ResponsiveContainer width="100%" height="100%">
				<BarChart data={duration}>
					<XAxis dataKey="label" />
					<YAxis />
					<Tooltip content={<CustomTooltip label={duration} />} />
					<Bar dataKey="nb_visits" fill="var(--color)" />
				</BarChart>
			</ResponsiveContainer>
		</ChartWrapper>
	)
}
