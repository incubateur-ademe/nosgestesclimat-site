import styled from 'styled-components'
import { Trans } from 'react-i18next'

import Tile from '../utils/Tile'

const FigureWrapper = styled.div`
	width: 40%;
	text-align: center;
	padding-top: 1rem;
	display: flex;
	flex-direction: column;
	justify-content: center;
	@media screen and (max-width: ${1200}px) {
		width: 100%;
		padding-top: 0rem;
		flex-direction: row;
	}
`

const TileWrapper = styled(Tile.Tile)`
	width: 100%;
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
						{!isNaN(props.avgduration)
							? Math.round(props.avgduration).toLocaleString('fr-FR')
							: '-'}
						<Small>&nbsp;min</Small>
					</Number>
					<Label>
						<Trans>en moyenne sur le site</Trans>
					</Label>
				</Tile.Content>
			</TileWrapper>
			{/* Firsly, we used to display average time spent on the /simulation/bilan test but figures seemed to be uncorrect.
			We decided to delete it until we find a better way to estimate the average time of simulation */}
		</FigureWrapper>
	)
}
