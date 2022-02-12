import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { useTotalNgcSimulations } from '../matomo'

const Wrapper = styled.div`
	width: 33.333%;
	text-align: center;
	padding-top: 2rem;

	@media screen and (max-width: ${1200}px) {
		width: 100%;
		padding-top: 0rem;
	}
`

const TopBlock = styled.div`
	margin-bottom: 2rem;
	width: 100%;
	font-size: 150%;
	@media screen and (max-width: ${1200}px) {
		display: inline-flex;
		justify-content: center;
		align-items: baseline;
	}
`
const BlockWrapper = styled.div`
	margin-bottom: 2rem;
	width: 100%;

	@media screen and (max-width: ${1200}px) {
		display: inline-flex;
		justify-content: space-evenly;
	}
`

const Block = styled.div`
	margin-bottom: 2rem;

	@media screen and (max-width: ${1200}px) {
		width: 50%;
	}
`

const Number = styled.span`
	display: block;
	font-size: 2.5rem;
	font-weight: 800;
	line-height: 1;
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
			<TopBlock>
				<BigNumber>
					{props.allTime.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
				</BigNumber>{' '}
				&nbsp;visiteurs depuis le lancement
			</TopBlock>
			<BlockWrapper>
				<Block>
					<Number>
						{percent > 0 && '+'}
						{Math.round(percent * 10) / 10}%
					</Number>
					de visiteurs ce mois ci
					<Small>&nbsp;(par rapport au mois d'avant)</Small>
				</Block>
				<Block>
					<Number>
						{(simulations?.nb_visits + baseSimulations)
							.toString()
							.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
					</Number>{' '}
					simulations terminées depuis le lancement
				</Block>
			</BlockWrapper>
		</Wrapper>
	)
}
