import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import Tile from '../utils/Tile'

const Wrapper = styled(Tile.Content)`
	width: 40%;
	text-align: center;
	padding-top: 2rem;
	margin-bottom: 2rem;

	@media screen and (max-width: ${1200}px) {
		width: 100%;
		padding-top: 0rem;
	}
`

const TopBlock = styled.div`
	margin-bottom: 2rem;
	margin-top: 1rem;
	width: 100%;
	font-size: 150%;
	@media screen and (max-width: ${1200}px) {
		display: inline-flex;
		justify-content: center;
		align-items: baseline;
	}
`
const BlockWrapper = styled.div`
	width: 100%;

	@media screen and (max-width: ${1200}px) {
		display: inline-flex;
		justify-content: space-evenly;
	}
`

const Block = styled.div`
	@media screen and (max-width: ${1200}px) {
		width: 50%;
	}
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
	const simulations = props.simulations

	const [iframes, activeIframes] = props.pages && getIframeRate(props.pages)

	// console.log(iframes, activeIframes)

	return (
		<Wrapper>
			<TopBlock>
				<BigNumber>
					{props.allTime.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0')}
				</BigNumber>{' '}
				&nbsp;visites depuis le lancement
			</TopBlock>
			<BlockWrapper>
				<Block>
					<Number>
						{percent > 0 && '+'}
						{Math.round(percent * 10) / 10}%
					</Number>
					de visites ce mois ci
					<Small>&nbsp;(par rapport au mois d'avant)</Small>
				</Block>
				<Block>
					<Number>
						{(simulations?.nb_visits + baseSimulations)
							.toString()
							.replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0')}
					</Number>{' '}
					simulations terminées depuis le lancement
				</Block>
			</BlockWrapper>
		</Wrapper>
	)
}

// for iframe rate we consider as iframe url pages which include 'iframe' and inactive landing pages
const getIframeRate = (pages) => {
	const totalPages = pages.reduce((acc, cur) => acc + cur.entry_nb_visits, 0)

	const iframePages = pages.filter((page) => page.label.includes('iframe'))

	const iframeLandingPages = pages.filter(
		(page) => page.label.includes('iframe') && page.label.includes('index')
	)

	const totalIframe = iframePages.reduce(
		(acc, cur) => acc + cur.entry_nb_visits,
		0
	)

	const totalExitIframe = iframeLandingPages.reduce(
		(acc, cur) => acc + cur.exit_nb_visits,
		0
	)
	const totalActiveIframe = totalIframe - totalExitIframe

	const landingPage = pages.find((obj) => obj.label === '/index')

	const exitLandingPage = landingPage.exit_nb_visits

	const approximatedTotalIframes = exitLandingPage + totalIframe

	const iframes = (approximatedTotalIframes / totalPages) * 100

	const activeIframes = (totalActiveIframe / approximatedTotalIframes) * 100

	return [iframes, activeIframes]
}
