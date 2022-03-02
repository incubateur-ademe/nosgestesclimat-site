import styled from 'styled-components'

import Tile from '../utils/Tile'

const FigureWrapper = styled.div`
	width: 40%;
	text-align: center;
	padding-top: 1rem;
	display: flex;
	flex-direction: column;
	@media screen and (max-width: ${1200}px) {
		width: 100%;
		padding-top: 0rem;
		flex-direction: row;
	}
`

const TileWrapper = styled(Tile.Tile)`
	width: 100%;
	@media screen and (max-width: ${1200}px) {
		width: 50%;
	}
`

const Number = styled.span`
	display: block;
	font-size: 5rem;
	font-weight: 800;
	line-height: 1;
	text-align: center;
	color: var(--color);
	transition: color 500ms ease-out;
	display: inline-flex;
	align-items: flex-end;
	justify-content: center;
`
const Small = styled(Number)`
	font-size: 3.5rem;
`
const Label = styled.span`
	text-align: center;
	font-size: 1.25rem;
	font-weight: 700;
`

export default function DurationFigures(props) {
	return (
		<FigureWrapper>
			<TileWrapper>
				<Tile.Content>
					<Number>
						{' '}
						{Math.round(props.avgduration).toLocaleString('fr-FR')}{' '}
						<Small>&nbsp;min</Small>
					</Number>
					<Label>en moyenne sur le site</Label>
				</Tile.Content>
			</TileWrapper>
			<TileWrapper>
				<Tile.Content>
					<Number>
						{' '}
						{Math.round(props.avgsimulation).toLocaleString('fr-FR')}
						<Small>&nbsp;min</Small>
					</Number>
					<Label>en moyenne pour le test</Label>
				</Tile.Content>
			</TileWrapper>
		</FigureWrapper>
	)
}
