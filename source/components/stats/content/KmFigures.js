import React from 'react'
import styled from 'styled-components'

import Tile from '../utils/Tile'

const StyledTile = styled(Tile.Wrapper)`
	> div {
		width: 50%;
		/* @media screen and (max-width: ${1200}px) {
			width: 100%;
		} */
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
		<StyledTile>
			<Tile.Tile>
				<Tile.Content>
					<Number> {Math.round(userPercent).toLocaleString('fr-FR')}%</Number>
					<Label>ont utilisé l'aide à la saisie</Label>
				</Tile.Content>
			</Tile.Tile>
			<Tile.Tile>
				<Tile.Content>
					<Number>{Math.round(ridesavg).toLocaleString('fr-FR')}</Number>
					<Label>trajets saisis en moyenne</Label>
				</Tile.Content>
			</Tile.Tile>
		</StyledTile>
	)
}
