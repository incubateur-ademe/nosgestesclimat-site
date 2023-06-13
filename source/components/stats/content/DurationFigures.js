import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'

import {
	getLangFromAbreviation,
	getLangInfos,
} from '../../../locales/translation'
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
	font-size: 2rem;
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
	font-size: 2rem;
`
const Label = styled.span`
	text-align: center;
	font-size: 1.25rem;
	font-weight: 700;
`

export default function DurationFigures(props) {
	const { i18n } = useTranslation()
	const currentLangInfos = getLangInfos(getLangFromAbreviation(i18n.language))

	return (
		<FigureWrapper>
			<TileWrapper>
				<Tile.Content>
					<Number>
						{' '}
						{!isNaN(props.avgduration)
							? Math.round(props.avgduration).toLocaleString(
									currentLangInfos.abrvLocale
							  )
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
