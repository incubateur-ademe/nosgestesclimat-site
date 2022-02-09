import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
	padding: 1rem;
	background-color: #fff;
	border: 1px solid #f0f0f0;
`
const Label = styled.div`
	line-height: 1.5;
	color: #6a6a6a;
	&::first-letter {
		text-transform: uppercase;
	}
`
const Number = styled.span`
	font-size: 1.125rem;
	font-weight: 700;
`
export default function CustomTooltip(props) {
	return props.active && props.payload && props.payload.length ? (
		<Wrapper>
			{props.period === 'week' && (
				<Label>
					Semaine du{' '}
					{new Date(props.label.split(',')[0]).toLocaleDateString('fr-fr', {
						day: '2-digit',
						month: '2-digit',
					})}{' '}
					au{' '}
					{new Date(props.label.split(',')[1]).toLocaleDateString('fr-fr', {
						day: '2-digit',
						month: '2-digit',
					})}
				</Label>
			)}
			{props.period === 'month' && (
				<Label>
					{new Date(props.label).toLocaleDateString('fr-fr', {
						month: 'long',
						year: 'numeric',
					})}
				</Label>
			)}
			{props.period === 'day' && (
				<Label>
					{new Date(props.label).toLocaleDateString('fr-fr', {
						weekday: 'long',
						day: '2-digit',
						month: 'long',
					})}
				</Label>
			)}
			<Number>
				{props.payload[0].value
					.toString()
					.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}{' '}
			</Number>
			{props.naming || 'visiteurs'}
		</Wrapper>
	) : null
}
