import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { useTotalNgcSimulations } from '../matomo'

const Wrapper = styled.div`
	width: 33.333%;
	text-align: center;
	padding-top: 2rem;

	@media screen and (max-width: ${1200}px) {
		width: 100%;
	}
`
const Block = styled.div`
	margin-bottom: 2rem;
`
const Number = styled.span`
	display: block;
	font-size: 2.5rem;
	font-weight: 800;
	line-height: 1;
	color: var(--color);
	transition: color 500ms ease-out;
`
const BigNumber = styled(Number)`
	font-size: 3.5rem;
`
const Small = styled.span`
	font-size: 0.75rem;
`
export default function Evolution(props) {
	const [percent, setPercent] = useState(0)
	useEffect(() => {
		const lastPeriod = props.reference - props.period
		const difference = props.period - lastPeriod
		setPercent((difference / lastPeriod) * 100)
	}, [props.period, props.reference])

	// We didn't track this stat at the beginning so we're guessing based on todays average completion
	const baseSimulations = 32015
	const { data: simulations } = useTotalNgcSimulations()

	return (
		<Wrapper>
			<Block>
				<BigNumber>
					{props.allTime.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
				</BigNumber>{' '}
				visiteurs depuis le lancement
			</Block>
			<Block>
				<Number>
					{percent > 0 && '+'}
					{Math.round(percent * 10) / 10}%
				</Number>
				de visiteurs ce mois ci
				<br />
				<Small>(par rapport au mois d'avant)</Small>
			</Block>
			<Block>
				<Number>
					{(simulations?.nb_visits + baseSimulations)
						.toString()
						.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
				</Number>{' '}
				simulations terminées depuis le lancement
			</Block>
		</Wrapper>
	)
}
