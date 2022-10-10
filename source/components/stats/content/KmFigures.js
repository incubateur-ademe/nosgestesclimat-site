import React from 'react'
import styled from 'styled-components'

import Tile from '../utils/Tile'

const FigureWrapper = styled.div`
	width: 100%;
	text-align: center;
	padding-top: 0rem;
	display: flex;
	flex-direction: row;
	justify-content: center;
`

const TileWrapper = styled(Tile.Tile)`
	width: 100%;
	@media screen and (max-width: ${1200}px) {
		width: 50%;
	}
`

const Number = styled.span`
	display: block;
	font-size: 6rem;
	font-weight: 800;
	line-height: 1;
	text-align: center;
	color: var(--color);
	transition: color 500ms ease-out;
`
const Label = styled.span`
	text-align: center;
	font-size: 1.25rem;
	font-weight: 700;
`
export default function KmFigures(props) {
	const userPercent = (props.kmhelp / props.simulationsfromhelp) * 100
	const ridesavg = props.ridesnumber / props.kmhelp
	return (
		<FigureWrapper>
			<TileWrapper>
				<Tile.Content>
					<Number> {Math.round(userPercent).toLocaleString('fr-FR')}%</Number>
					<Label>ont utilisé l'aide à la saisie des km</Label>
				</Tile.Content>
			</TileWrapper>
			<TileWrapper>
				<Tile.Content>
					<Number>{Math.round(ridesavg).toLocaleString('fr-FR')}</Number>
					<Label>trajets saisis en moyenne</Label>
				</Tile.Content>
			</TileWrapper>
		</FigureWrapper>
	)
}
