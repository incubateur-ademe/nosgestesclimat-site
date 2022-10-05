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
	const label = props.label && props.label.replace(/\s/g, ' ')
	return props.active && props.payload && props.payload.length ? (
		<Wrapper>
			{label === '30+ min' ? (
				<Label>Plus de 30 minutes</Label>
			) : (
				<Label>
					Entre {label.split('-')[0].toLocaleString('fr-fr')} et{' '}
					{label.split('-')[1].split(' ')[0].toLocaleString('fr-fr')} minutes
				</Label>
			)}
			<Number>
				{props.payload[0].value
					.toString()
					.replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0')}{' '}
			</Number>
			{props.naming || 'visites'}
		</Wrapper>
	) : null
}
