import styled from 'styled-components'

import Tile from '../utils/Tile'

const FigureWrapper = styled.div`
	width: 40%;
	text-align: center;

	@media screen and (max-width: ${1200}px) {
		width: 100%;
		padding-top: 0rem;
		padding-top: 2rem;
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

export default function DurationFigures(props) {
	return (
		<FigureWrapper>
			<Tile.Tile>
				<Tile.Content>
					<Number>
						{' '}
						{Math.round(props.avgduration).toLocaleString('fr-FR')} min
					</Number>
					<Label>
						C'est le temps moyen que passe un utilisateur sur le site
					</Label>
				</Tile.Content>
			</Tile.Tile>
		</FigureWrapper>
	)
}
