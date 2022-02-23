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
			{props.label === '30+\u00A0min' ? (
				<Label>Plus de 30 minutes</Label>
			) : (
				<Label>
					Entre {props.label.split('-')[0].toLocaleString('fr-fr')} et{' '}
					{props.label.split('-')[1].split('\u00A0')[0].toLocaleString('fr-fr')}{' '}
					minutes
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
